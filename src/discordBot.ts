import * as Discord from "discord.js";
import { GameCommandsOBJ } from "./Commands";
import { UserMD, IUserState } from "./Models/userState";
import { EliteCommand } from "./Commands/account/eliteCommand";
import { RigisterUser } from "./Commands/account/registerUser";

import blapi from "blapi";

import { UserStatsCommand } from "./Commands/account/getUserStat";
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
    "botlist.space": process.env.SC_DBSPACE, // Online
    "yabl.xyz": process.env.SC_YABL, // Online
    "discordbotlist.com": process.env.SC_DBL // Online
  };

  constructor() {
    this.botClient = new Discord.Client();
    this.botClient.login(process.env.BOT_AUTHTOKEN);
    this.botClient.on("ready", () => {
      if (process.env.PRODUCTION == "True")
        this.botClient.user.setActivity(
          `Hackers |  ${process.env.BOT_PREFIX}register | v${
            process.env.BOT_VERSION
          }`,
          { type: "WATCHING" }
        );

      // send server count to botlisting sites
      // blapi.setLogging(true);
      try {
        blapi.handle(this.botClient, this.apiKeys, 15);
      } catch (err) {
        console.error("FAILED to push bot stats", "handle() undefined in DiscordBot.ts");
      }
      console.log(`${this.botClient.user.username} is online`);
      // set all users to offline
      UserMD.updateMany(
        { online: true },
        {
          online: false
        }
      ).exec();

      this.botOnlineListen();
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
          new Discord.MessageEmbed()
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
            UserStatsCommand.setUserToOnline({
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
                UserStatsCommand.setUserToOnline({
                  userID: receivedMessage.author.id,
                  status: false
                });
                this.CURRENTLY_ONLINE.delete(receivedMessage.author.id);
                clearInterval(StatusUpdate);
              }
              UserStatsCommand.checkIfUserLeveledUp(userData, receivedMessage);
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
            UserStatsCommand.checkIfUserLeveledUp(userData, receivedMessage);
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

  // tells the user that there is no command with that primary command
  noCommandsFound({
    Msg,
    triedCmd
  }: {
    Msg: Discord.Message;
    triedCmd: string;
  }) {
    const primaryCmdErrorMSG = new Discord.MessageEmbed()
      .setColor("#F44336")
      .setDescription(`${Msg.author}`)
      .addField("Error:", `The command "${triedCmd}" does not exist!`);
    Msg.channel.send(primaryCmdErrorMSG);
  }
}


// require('dotenv').config()
import { Database } from "./Database";


new Database();
new DiscordBotRun();
// ©Isaac Diaby 2019
