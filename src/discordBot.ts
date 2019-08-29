import * as Discord from "discord.js";
import { GameCommandsOBJ } from "./Commands";
import { UserMD, IUserState, uuidv4 } from "./Models/userState";
import { EliteCommand } from "./Commands/eliteCommand";
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
    "discordbotlist.com": process.env.SC_DBL

    // "divinediscordbots.com": "null",
    // "discordbots.fun": "null"
  };

  constructor() {
    this.botClient = new Discord.Client();
    this.botClient.login(process.env.BOT_AUTHTOKEN);
    this.botClient.on("ready", () => {
      this.botClient.user.setActivity(
        `Hackers |  ${process.env.BOT_PREFIX}help`,
        { type: "WATCHING" }
      );
      // blapi.setLogging(true);
      blapi.handle(this.botClient, this.apiKeys, 15);
      console.log(`${this.botClient.user.username} is online`);
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
      // check if users info is in the DB else create it
      UserMD.findOne({ userID: receivedMessage.author.id })
        .then((userData: IUserState) => {
          if (!userData) {
            this.createNewUserProfile(
              receivedMessage.author,
              receivedMessage.channel
            );
            return;
          }
          if (!userData.online)
            this.setUserToOnline({
              userID: receivedMessage.author.id,
              status: true
            });
          if (userData.inHack.isInHack) return;
          // checks if the user still active every 10 minutes
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
              this.checkIfStillElite(receivedMessage.author);
            }, 600000);
          }

          // Parse the text to a command format
          let commands = receivedMessage.content
            .toLowerCase()
            .substr(process.env.BOT_PREFIX.length)
            .trim()
            .split(" ");
          let primaryCmd = commands[0];
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
    await UserMD.findOne({ userID: userData.userID }).then(
      async (userData: IUserState) => {
        const currentLevelData = [...DiscordBotRun.LevelSystemXp].filter(
          stage => stage.level === userData.level.current
        );
        // console.log(currentLevelData)
        if (currentLevelData) {
          if (
            userData.level.xp >= currentLevelData[0].xp &&
            currentLevelData[0].xp
          ) {
            const newLevel = ++userData.level.current;
            const newXP =
              userData.level.xp - (currentLevelData[0].xp as number);
            await UserMD.findOneAndUpdate(
              { userID: userData.userID },
              {
                level: {
                  xp: newXP,
                  current: newLevel
                }
              }
            ).exec();
            await msg.author.send(
              `🎉👏 Congrate you are now level ${++userData.level.current} 🎉`
            );
          }
        }
      }
    );
  }
  async createNewUserProfile(
    userDiscordInfo: Discord.User,
    discordChannel:
      | Discord.TextChannel
      | Discord.DMChannel
      | Discord.GroupDMChannel
  ) {
    const newUser = new UserMD({
      userID: userDiscordInfo.id,
      ip: uuidv4()
    });
    newUser
      .save()
      .then(data => {
        // new user created success message
        const successfulNewAccountMSG = new Discord.RichEmbed()
          .setColor("#60BE82")
          .setAuthor(`${userDiscordInfo.tag}`)
          .setTitle("New Profile Created!")
          .setDescription(
            `Welcome, I see that this is your first time. Type ${
              process.env.BOT_PREFIX
            }help FOR HELP and good luck on your adventure. (Discord DM based game)`
          )
          .addField("discordbots.org", "http://bit.ly/HIOdiscordBots")
          .addField(
            "Join The Official Serverr",
            "http://bit.ly/CGBofficialServer"
          )
          .addField(
            "README: DISCLAIMER:",
            "HackerIO is an online educational game, IS JUST A GAME. DONT SHARE IP (you will be foolish to! 🦝)"
          )
          .addField("New Players", [
            `0. Your account has been created, Please re-enter a command you want to execute`,
            `1. You execute commands with the following prefix: ${
              process.env.BOT_PREFIX
            }`,
            `2. Execute ${
              process.env.BOT_PREFIX
            }help - this is all the in-game commands`,
            `3. Execute ${
              process.env.BOT_PREFIX
            }stat - this shows information about you! (don't share your Ip cuz you can't change it (until v3.0)!`,
            `4. Execute ${
              process.env.BOT_PREFIX
            }learn - get to know some of the commands that will help you get a better chance in your hacks. (very userful!)`,
            "5. EXPLORE THE ENDLESS HACKING AND BETTING GAMES"
          ])
          .setFooter(
            "For more features and exclusive bonuses become a Donater!: http://bit.ly/CGBdonate"
          );
        discordChannel.send(successfulNewAccountMSG);
      })
      .catch(e => {
        // new user created fail message
        const FailedNewUserMSG = new Discord.RichEmbed()
          .setTitle("New User Error!")
          .setColor("#F44336")
          .setAuthor(`${userDiscordInfo.tag}`)
          .setDescription(
            `There was an error creating ${userDiscordInfo} account on the server`
          );
        discordChannel.send(FailedNewUserMSG);
        // discordChannel.send(e)
      });
  }
  checkIfStillElite(user: Discord.User) {
    const isUserInOfficialServer = this.botClient.guilds
      .get("566982444822036500")
      .members.get(user.id);
    if (isUserInOfficialServer !== undefined) {
      // HackerIO Elite == 605180133535645745
      if (!isUserInOfficialServer.roles.has("605180133535645745"))
        return EliteCommand.altEliteStatus(user.id, false, user);
    }
  }
}
