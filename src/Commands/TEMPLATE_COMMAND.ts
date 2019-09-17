import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";

export class TemplateCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    // Implement code here
  }
}
