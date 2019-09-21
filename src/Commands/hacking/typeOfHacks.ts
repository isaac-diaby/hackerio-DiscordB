import * as Discord from "discord.js";
import { LearnCommand } from "../guide/learnHackCommands";
export class TypeOfHacks {
  hackTypes = [this.guessTheCommand];
  constructor(
    public msConstruct: Discord.RichEmbed,
    public questionMsg: Discord.Message,
    public hacker: Discord.User,
    public difficulty: number
  ) {}
  async guessTheCommand() {
    const randomDifficulty = Math.floor(Math.random() * this.difficulty);
    const randomQuestionIndex = Math.floor(
      Math.random() * LearnCommand.HACKER_SCRIPTS[randomDifficulty].length
    );

    this.msConstruct
      .setDescription("Type the command that does the following.")
      .addField(
        "Program Platform",
        LearnCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex]
          .program
      )
      .addField(
        "What Command Does this:",
        LearnCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex]
          .description
      )
      .setFooter("If You dont know the answer just send an guest to skip");
    await this.questionMsg.edit(this.msConstruct);
    return await this.questionMsg.channel
      .awaitMessages(
        (m: Discord.Message) => m.author.id === this.hacker.id, //m.content == HackCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex].primaryCmd &&
        { max: 1, time: 15000 }
      )
      .then(
        c =>
          c.first().content ===
          LearnCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex]
            .primaryCmd
      )
      .catch(c => false);
  }

  /**
   * Gets a random hack type
   */
  get randomHackType() {
    return this.hackTypes[Math.floor(Math.random() * this.hackTypes.length)];
  }
}
