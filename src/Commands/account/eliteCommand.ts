import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { UserMD, IUserState } from "../../Models/userState";

export interface IhackingScripts {
  primaryCmd: string;
  description: string;
  program: "Metasploitable";
}

export class EliteCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    UserMD.findOne({ userID: message.author.id }).then(
      (userData: IUserState) => {
        switch (this.args[0]) {
          case "-j":
            this.joinElite(userData.userID, userData.playerStat.elite);
            break;
          case "-join":
            this.joinElite(userData.userID, userData.playerStat.elite);
            break;
          default:
            const Msg = new Discord.RichEmbed()
              .setColor("#1E90FF")
              .setTitle("Elite players (EP)")
              .setDescription("These players are harder to hack")
              .addField("EP perks ⭐", [
                "- Enemies have a  (level*0.072) =  just over 13%+ disadvantage success rate when trying to hack you!",
                "- You are able to protect more of your crypto . Only 20% of your crypto is at risk when getting hacked (instead of 60%).",
                "- When hacking a target you get a better chance of stealing more crypto's 💸",
                "- Only pay 80% when paying to get off the out casted players list"
              ])

              .setFooter(
                `To join the elte list type ${
                  process.env.BOT_PREFIX
                }elite -join`
              );
            this.sendMsgViaDm(Msg);
            return;
        }
      }
    );
  }
  joinElite(userID: string, alreadyElite: Boolean) {
    if (alreadyElite) return this.msg.reply("You Are Already Elite");
    const Msg = new Discord.RichEmbed()
      .setColor("#60BE82")
      .setTitle("How To Become Elite")
      .setDescription("follow these simple steps: ")
      .addField("1. Join The Official Sever", "http://bit.ly/CGBofficialServer")
      .addField(
        "2. Donate To Get The Title: HackerIO Elite ",
        "http://bit.ly/HIOdonate"
      )
      .setFooter("Then type this command again to active Elite");
    const isUserInOfficialServer = this.OfficialServer.members.get(
      this.msg.author.id
    );
    if (isUserInOfficialServer !== undefined) {
      // console.log('is in server', isUserInOfficialServer)
      //   console.log(this.botClient.guilds.get('566982444822036500').roles)
      // HackerIO Elite == 605180133535645745
      if (!isUserInOfficialServer.roles.has(this.mainGuildData.roles.elite))
        return this.msg.channel.send(Msg);
      EliteCommand.altEliteStatus(userID, true, this.msg.author);
    } else {
      this.msg.channel.send(Msg);
    }
  }
  static altEliteStatus(userID: string, isElite: boolean, user: Discord.User) {
    const Msg = new Discord.RichEmbed()
      .setColor("#F44336")
      .setTitle("Elite Update")
      .setAuthor(user.tag, user.avatarURL);
    isElite
      ? Msg.setDescription("Welcome to the elite ⚔.").setColor("#60BE82")
      : Msg.setDescription("Expired Membership to elite ⌛")
          .addField("Rejoin", "http://bit.ly/HIOdonate")
          .setFooter("Then type elite -j command again to active Elite");
    UserMD.findOneAndUpdate(
      { userID },
      {
        "playerStat.elite": isElite,
        "playerStat.eliteExpireDate": new Date(
          new Date().setMonth(new Date().getMonth() + (1 % 12))
        ) // plus one month
      }
    ).then(d => user.send(Msg));
  }

  static checkIfStillElite(
    user: Discord.User,
    userData: IUserState,
    botClient: Discord.Client
  ) {
    const isUserInOfficialServer = botClient.guilds
      .get("566982444822036500")
      .members.get(user.id);
    // @ts-ignore
    if (userData.playerStat.eliteExpireDate <= Date.now().valueOf()) {
      // membership expired
      isUserInOfficialServer
        .removeRole("605180133535645745", "Membership has expired")
        .catch(e =>
          console.log("tried to remove elite role from someone high up")
        );
      return EliteCommand.altEliteStatus(user.id, false, user);
    }
    if (isUserInOfficialServer !== undefined) {
      // HackerIO Elite == 605180133535645745
      if (!isUserInOfficialServer.roles.has("605180133535645745")) {
        isUserInOfficialServer
          .removeRole("605180133535645745", "Membership has expired")
          .catch(e =>
            console.log("tried to remove elite role from someone high up")
          );
        return EliteCommand.altEliteStatus(user.id, false, user);
      }
    } else {
      // this means they left the support server. not allowed if your elite!
      return EliteCommand.altEliteStatus(user.id, false, user);
    }
  }
}
