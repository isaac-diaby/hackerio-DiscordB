import * as Discord from "discord.js";

export abstract class DiscordCommand {
  botClient: Discord.Client;
  msg: Discord.Message;
  args: Array<string>;

  mainGuildData = {
    id: "566982444822036500",
    roles: {
      admin: "566985267635027978",
      team: "616673712250552321",
      elite: "605180133535645745"
    },
    channels: {
      claimedPerksLog: {
        channel: "588462707594887185"
      },
      dblVotesLog: {
        channel: "600027239190495236"
      },
      suggestions: {
        channel: "596871700423901221"
      }
    }
  };

  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    // init variables
    this.botClient = client;
    this.msg = message;
    this.args = cmdArguments;
  }
  async sendMsgViaDm(
    message: Discord.RichEmbed | string,
    user: Discord.User = this.msg.author,
    shouldNotifyUser: Boolean = true
  ) {
    if (this.msg.channel.type === "text" && shouldNotifyUser)
      this.msg.reply(
        "Check Your Direct Messages, i sent you the information there."
      );
    return user.send(message).catch(e => {
      this.msg.channel.send(
        new Discord.RichEmbed().setDescription(
          "📌 Please make sure you have 'Direct Message' enabled"
        )
      );
      return undefined;
    });
  }

  /**
   * safely delete a message
   * - message the message that you want to make disappear
   */
  async deleteMessageIfCan(message: Discord.Message, time: number = 0) {
    return message.delete(time).catch(e => {
      message.channel.send("Missing Manage Messages Role");
    });
  }
  get OfficialServer() {
    return this.botClient.guilds.get(this.mainGuildData.id);
  }
}
