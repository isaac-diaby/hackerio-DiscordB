import * as Discord from "discord.js";
import { GameCommandsOBJ } from "./Commands";
import { UserMD, IUserState, uuidv4 } from "./Models/userState";
import { EliteCommand } from "./Commands/eliteCommand";
import { RigisterUser } from "./Commands/registerUser";
// @ts-ignore
import blapi from "blapi";
export class DiscordBotRun {
  mainGuildData = {
    id: "566982444822036500",
    channels: {
      claimedPerksLog: {
        channel: "588462707594887185"
      },
      dblVotesLog: {
        channel: "600027239190495236"
      }
    }
  };

  port: number = 5000;
  botClient: Discord.Client;
  CURRENTLY_ONLINE: Set<string> = new Set();
  // Get the leveling up Xp
  static LevelSystemXp: Set<{ level: number; xp: number | string }> = new Set([
    ...(function* getXp() {
      var xp = 0;
      for (let level = 1; level <= 199; level++) {
        xp += Math.floor(level + 150 * Math.pow(1.4, level / 7));
        yield { level, xp };
      }
      yield { level: 200, xp: "MAX" };
    })()
  ]);
  //
  apiKeys = {
    "discordbots.org": process.env.SC_DBS,
    "botlist.space": process.env.SC_DBSPACE,
    "mythicalbots.xyz": process.env.SC_MYTHB,
    "yabl.xyz": process.env.SC_YABL,
    "discordbotreviews.xyz": process.env.SC_DBR,
    "discordbotlist.com": process.env.SC_DBL,
    "divinediscordbots.com": process.env.SC_DDB

    // "discordbots.fun": "null"
  };

  constructor() {
    this.botClient = new Discord.Client();
    this.botClient.login(process.env.BOT_AUTHTOKEN);
    this.botClient.on("ready", () => {
      this.botClient.user.setActivity(
        `Hackers |  ${process.env.BOT_PREFIX}register | v${
          process.env.BOT_VERSION
        }`,
        { type: "WATCHING" }
      );

      // send server count to botlisting sites
      // blapi.setLogging(true);
      blapi.handle(this.botClient, this.apiKeys, 15);
      console.log(`${this.botClient.user.username} is online`);
      // set all users to offline
      UserMD.updateMany(
        { online: true },
        {
          online: false
        }
      ).exec();

      this.botOnlineListen();
      // console.log(DiscordBotRun.LevelSystemXp)
    });
  }

  async botOnlineListen() {
    this.botClient.on("message", receivedMessage => {
      if (!receivedMessage.content.startsWith(process.env.BOT_PREFIX)) return;
      // Prevent bot from responding to its own messages and other bots
      if (
        receivedMessage.author === this.botClient.user ||
        receivedMessage.author.bot
      )
        return;

      // Must be online to play
      if (
        receivedMessage.author.presence.status === "idle" ||
        receivedMessage.author.presence.status === "offline"
      ) {
        receivedMessage.channel.send(
          new Discord.RichEmbed()
            .setDescription(
              "Set your discord appearance to 'Online' or 'Do Not Disturb' in order to play the game"
            )
            .setColor("#F44336")
            .addField(
              "Current Status: ",
              receivedMessage.author.presence.status
            )
        );
        return;
      }
      // check if users info is A in the DB else create it
      UserMD.findOne({ userID: receivedMessage.author.id })
        .then(async (userData: IUserState) => {
          if (!userData) {
            if (
              receivedMessage.content === `${process.env.BOT_PREFIX}register`
            ) {
              new RigisterUser(receivedMessage.author, receivedMessage.channel);
            }
            return;
          }
          if (!userData.online)
            this.setUserToOnline({
              userID: receivedMessage.author.id,
              status: true
            });

          // checks if the user still active every userUpdateTime
          const userUpdateTime = 20000; // 20 seconds

          if (!this.CURRENTLY_ONLINE.has(receivedMessage.author.id)) {
            this.CURRENTLY_ONLINE.add(receivedMessage.author.id);
            const StatusUpdate = setInterval(() => {
              if (
                receivedMessage.author.presence.status === "idle" ||
                receivedMessage.author.presence.status === "offline"
              ) {
                this.setUserToOnline({
                  userID: receivedMessage.author.id,
                  status: false
                });
                this.CURRENTLY_ONLINE.delete(receivedMessage.author.id);
                clearInterval(StatusUpdate);
              }
              this.checkIfUserLeveledUp(userData, receivedMessage);
            }, userUpdateTime);
          }

          if (userData.playerStat.elite)
            EliteCommand.checkIfStillElite(
              receivedMessage.author,
              userData,
              this.botClient
            );
          // Parse the text to a command format
          let commands = receivedMessage.content
            .toLowerCase()
            .substr(process.env.BOT_PREFIX.length)
            .trim()
            .split(" ");
          let primaryCmd = commands[0];
          // if user is alady in a game or a hack Quit
          if (
            (userData.inHack.isInHack || userData.ingame.isInGame) &&
            primaryCmd !== "!leave"
          )
            return;
          let argsCmd = commands.slice(1);
          if (primaryCmd === "levelup") {
            this.checkIfUserLeveledUp(userData, receivedMessage);
            return;
          }
          // try execute the command
          let gameCommandClass = GameCommandsOBJ[primaryCmd];
          if (!gameCommandClass) {
            // this.noCommandsFound({ Msg: receivedMessage, triedCmd: primaryCmd }); // No command MSG
          } else if (gameCommandClass.execute !== undefined) {
            new gameCommandClass.execute(
              this.botClient,
              receivedMessage,
              argsCmd
            );
          }
        })
        .catch(e => console.log(e));
    });
  }

  // Set user to online/offline in DB
  setUserToOnline({ userID, status }: { userID: string; status: boolean }) {
    UserMD.findOneAndUpdate({ userID }, { $set: { online: status } })
      .exec()
      .catch(e => console.log(e));
  }
  // tells the user that there is no command with that primary command
  noCommandsFound({
    Msg,
    triedCmd
  }: {
    Msg: Discord.Message;
    triedCmd: string;
  }) {
    const primaryCmdErrorMSG = new Discord.RichEmbed()
      .setColor("#F44336")
      .setDescription(`${Msg.author}`)
      .addField("Error:", `The command "${triedCmd}" does not exist!`);
    Msg.channel.send(primaryCmdErrorMSG);
  }
  getChannelType(message: Discord.Message) {
    return message.channel.type;
  }
  async checkIfUserLeveledUp(userData: IUserState, msg: Discord.Message) {
    UserMD.findOne({ userID: userData.userID }).then(async userUpdatedData => {
      const currentLevelData = [...DiscordBotRun.LevelSystemXp].filter(
        stage => stage.level === userUpdatedData.level.current
      );
      // console.log(currentLevelData)
      if (currentLevelData) {
        if (
          userUpdatedData.level.xp >= currentLevelData[0].xp &&
          currentLevelData[0].xp
        ) {
          const newLevel = ++userUpdatedData.level.current;
          const cryptoGained = newLevel * 1500;
          await UserMD.findOneAndUpdate(
            { userID: userData.userID },
            {
              $inc: {
                "level.current": 1,
                "level.xp": -(currentLevelData[0].xp as number),
                crypto: cryptoGained
              }
            }
          ).exec();
          await msg.author.send(
            `🎉👏 Congrate you are now level ${newLevel} and got ${cryptoGained} Cryptos 🎉`
          );
        }
      }
    });
  }
}
