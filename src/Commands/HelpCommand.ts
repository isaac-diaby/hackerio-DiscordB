import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
import { GameCommandsOBJ } from '.';

export class HelpCommand extends DiscordCommand {

  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);

    const helpMessage = new Discord.RichEmbed()
    .setColor('#D3D3D3')
    .setTitle('Help Command');
    if (this.args[0] !== undefined) {
        const commandMeta = GameCommandsOBJ[this.args[0]];
        if (commandMeta) {
          helpMessage
            .addField('Primary', this.args[0], true)
            .addField('Description', commandMeta.description!, true);
            if (commandMeta.args) helpMessage.addField('Arguments', commandMeta.args!, true)
        }
      } else {
        for (const command in GameCommandsOBJ) {
          const commandMeta = GameCommandsOBJ[command];
          helpMessage
          .addField('Primary', command, true)
          .addField('Description', commandMeta.description!,true)
          commandMeta.args ? helpMessage.addField('Arguments', commandMeta.args!, true) :
          helpMessage.addBlankField(true)
          helpMessage.addBlankField()
        }
      }
      this.msg.author
        .send(helpMessage)
        // @ts-ignore
        .then((messageSent: Discord.Message) => messageSent.delete(30000));
    }

  }