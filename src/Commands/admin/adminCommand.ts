import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { IUserState, UserMD } from "../../Models/userState";

export class AdministratorCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    // 566985267635027978
    super(client, message, cmdArguments);
    if (!this.CheckIfAdmin()) return;
    // this.msg.reply("You are Admin");
    const mode = this.args.shift();
    switch (mode) {
      case "notify-users":
        this.notiflyUsers();
        return;
      default:
    }
  }
  CheckIfAdmin() {
    const OfficialServerGuildMember = this.OfficialServer.members.get(
      this.msg.author.id
    );
    if (OfficialServerGuildMember !== undefined) {
      // console.log('is in server', isUserInOfficialServer)
      //   console.log(this.botClient.guilds.get('566982444822036500').roles)
      // HackerIO Elite == 605180133535645745
      if (
        !OfficialServerGuildMember.roles.has(this.mainGuildData.roles.admin)
      ) {
        this.msg.reply("You Need Admin To Run This Command");
        return false;
      } else {
        return true;
      }
    } else {
      this.msg.reply("You Need Admin To Run This Command");
      return false;
    }
  }

  async notiflyUsers() {
    let argumentProps: {
      conditions?: IUserState;
      messagedata: {
        title: string;
        msg: string;
        author?: string;
        color?: string;
        fields?: { name: string; value: string }[];
      };
    } = JSON.parse(`${this.args.join(" ").match("{*}").input}`);
    const Msg = new Discord.RichEmbed()

      .setAuthor(
        argumentProps.messagedata.author
          ? argumentProps.messagedata.author
          : "Agent 001"
      )
      .setColor(
        argumentProps.messagedata.color
          ? argumentProps.messagedata.color
          : "#60BE82"
      )
      .setTitle(argumentProps.messagedata.title)
      .setDescription(argumentProps.messagedata.msg)
      .setFooter(
        "Support Server: http://bit.ly/CGBofficialServer , Become An Elite!: http://bit.ly/CGBdonate "
      );
    if (argumentProps.messagedata.fields) {
      for (let field of argumentProps.messagedata.fields)
        Msg.addField(field.name, field.value);
    }

    // allows me to target users.
    await UserMD.find(
      argumentProps.conditions
        ? {
            ...argumentProps.conditions,
            "playerStat.opt_in": true
          }
        : { "playerStat.opt_in": true }
    ).then(async users => {
      let playersSuccessullyReached = 0;
      let playersFailedReached = 0;
      function ReachedPlayerDm(status: Boolean) {
        if (status) {
          playersSuccessullyReached++;
        } else {
          playersFailedReached++;
        }
      }
      for (let user of users) {
        const discordUser = this.botClient.users.get(user.userID);
        if (discordUser)
          await discordUser
            .send(Msg)
            .then(d => ReachedPlayerDm(true)) // Make a function that will reword the user for viewing this
            .catch(e => ReachedPlayerDm(false));
      }

      await this.msg.channel.send(
        Msg.addField("Successully Reached", playersSuccessullyReached).addField(
          "Failed Reached",
          playersFailedReached
        )
      );
    });
  }
}
