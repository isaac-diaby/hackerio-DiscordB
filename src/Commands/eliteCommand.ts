import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";
import { UserMD, IUserState } from "../Models/userState";

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
            this.joinElite(userData.userID);
            break;
          default:
            const Msg = new Discord.RichEmbed()
              .setColor("#1E90FF")
              .setTitle("Elite players (EP)")
              .setDescription("These players are harder to hack")
              .addField("EP perks ⭐", [
                "- Enemies have a  (level*0.072) =  just over 13%+ disadvantage success rate when trying to hack you!",
                "- You are able to protect more of your money . Only 20% of your money is at risk when getting hacked (instead of 60%).",
                "- When hacking a target you get a better chance of stealing more crypo's 💸",
                "- Only pay 80% when paying to get off the out casted players list"
              ])

              .setFooter(
                `To join the elte list type ${process.env.BOT_PREFIX}elite -j`
              );
            this.sendMsgViaDm(Msg);
            return;
        }
      }
    );
  }
  joinElite(userID: string) {
    const Msg = new Discord.RichEmbed()
      .setColor("#60BE82")
      .setTitle("How To Become Elite")
      .setDescription("follow these simple steps: ")
      .addField("1. Join The Official Sever", "http://bit.ly/CGBofficialServer")
      .addField(
        "2. Donate To Get The Title: HackerIO Elite ",
        "http://bit.ly/CGBdonate"
      )
      .setFooter("Then type this command again to active Elite");
    const isUserInOfficialServer = this.botClient.guilds
      .get("566982444822036500")
      .members.get(this.msg.author.id);
    if (isUserInOfficialServer !== undefined) {
      // console.log('is in server', isUserInOfficialServer)
      //   console.log(this.botClient.guilds.get('566982444822036500').roles)
      // HackerIO Elite == 605180133535645745
      if (!isUserInOfficialServer.roles.has("605180133535645745"))
        return this.sendMsgViaDm(Msg);
      EliteCommand.altEliteStatus(userID, true, this.msg.author);
    } else {
      this.sendMsgViaDm(Msg);
    }
  }
  static altEliteStatus(userID: string, isElite: boolean, user: Discord.User) {
    const Msg = new Discord.RichEmbed()
      .setColor("#F44336")
      .setTitle("Elite Update");
    isElite
      ? Msg.setDescription("Welcome to the elite ⚔.").setColor("#60BE82")
      : Msg.setDescription("Expired Membership to elite ⌛").addField(
          "Rejoin",
          "http://bit.ly/CGBdonate"
        );
    UserMD.findOneAndUpdate(
      { userID },
      {
        "playerStat.elite": isElite
      }
    ).then(d => user.send(Msg));
  }
}
