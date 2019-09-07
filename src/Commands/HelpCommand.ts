import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";
import { GameCommandsOBJ, CommandObj } from ".";

export class HelpCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);

    if (this.args[0] !== undefined) {
      this.getACommandInfo();
    } else {
      this.getHelpAll(GameCommandsOBJ);
    }
  }
  getACommandInfo() {
    const helpMessage = new Discord.RichEmbed()
      .setColor("#D3D3D3")
      .setTitle("Help Command");
    const commandMeta = GameCommandsOBJ[this.args[0]];
    if (commandMeta) {
      helpMessage
        .addField("Primary", this.args[0], true)
        .addField("Description", commandMeta.description!, true);
      if (commandMeta.args)
        helpMessage.addField("Arguments", commandMeta.args!, true);
    } else {
      helpMessage.setDescription("Couldn't find that command");
    }
    this.msg.channel
      .send(helpMessage)
      // @ts-ignore
      .then((m: Discord.Message) => m.delete(60000));
  }
  getHelpAll(GameCommandsOBJ: { [key: string]: CommandObj }) {
    let page = 1;

    this.msg.channel.send(this.GetHelpPage(page, GameCommandsOBJ)).then(
      //@ts-ignore
      (m: Discord.Message) => {
        m.delete(60000);
        m.react("👈").then(mr => {
          m.react("👉");
          const backWordsFilter = (
            r: Discord.MessageReaction,
            u: Discord.User
          ) => r.emoji.name === "👈" && u.id === this.msg.author.id;
          const forWordsFilter = (
            r: Discord.MessageReaction,
            u: Discord.User
          ) => r.emoji.name === "👉" && u.id === this.msg.author.id;

          const backWords = m.createReactionCollector(backWordsFilter, {
            time: 60000
          });
          const forWords = m.createReactionCollector(forWordsFilter, {
            time: 60000
          });

          backWords.on("collect", r => {
            if (page === 1) return;
            page--;
            m.edit(this.GetHelpPage(page, GameCommandsOBJ));
          });
          forWords.on("collect", r => {
            if (page === this.splitHelp(GameCommandsOBJ).length) return;
            page++;
            m.edit(this.GetHelpPage(page, GameCommandsOBJ));
          });
        });
      }
    );
  }
  splitHelp(commands: { [key: string]: CommandObj }) {
    const splitBy = 5;
    var toArray = Object.keys(commands).map(function(key) {
      return [key, commands[key]];
    });

    let newSplitArray = [];
    for (let i = 0; i < toArray.length; i += splitBy) {
      newSplitArray.push(toArray.slice(i, i + splitBy));
    }
    // console.log(newSplitArray)
    return newSplitArray;
  }
  GetHelpPage(page: number, commands: { [key: string]: CommandObj }) {
    const newSplitArrayFull = this.splitHelp(commands);
    const newSplitArraySelected = this.splitHelp(commands)[page - 1];
    // console.log(newSplitArraySelected)
    const Msg = new Discord.RichEmbed()
      .setTitle("Help Commands")
      .setFooter(`Page ${page} of ${newSplitArrayFull.length}`);

    let logIndex = page - 1 !== 0 ? (page - 1) * 5 : 0;
    newSplitArraySelected.forEach(command => {
      // console.log(command)
      Msg.addField("Primary", command[0], true)
        // @ts-ignore
        .addField("Description", command[1].description!, true);
      // @ts-ignore
      command[1].args
        ? Msg.addField(
            "Arguments",
            // @ts-ignore
            command[1].args!,
            true
          )
        : Msg.addBlankField(true);
      Msg.addBlankField();
      logIndex = logIndex + 1;
    });
    return Msg;
  }
}
