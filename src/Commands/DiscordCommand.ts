import * as Discord from "discord.js";

export abstract class DiscordCommand {
  botClient: Discord.Client;
  msg: Discord.Message;
  args: Array<string>;
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
  async sendMsgViaDm(message: Discord.RichEmbed | string) {
    return await this.msg.author
      .send(message)
      .catch(e =>
        this.msg.channel.send(
          new Discord.RichEmbed().setDescription(
            "📌 Please make sure you have 'Direct Message' enabled"
          )
        )
      );
  }
}
