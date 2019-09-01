import * as Discord from "discord.js";

export abstract class DiscordCommand {
  botClient: Discord.Client;
  msg: Discord.Message;
  args: Array<string>;

  mainGuildData = {
    id: "566982444822036500",
    roles: {
      team: "616673712250552321"
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
    user: Discord.User = this.msg.author
  ) {
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
}
