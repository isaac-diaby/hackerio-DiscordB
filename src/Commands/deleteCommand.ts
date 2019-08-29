import * as Discord from "discord.js";
import { UserMD, IUserState } from "../Models/userState";
import { DiscordCommand } from "./DiscordCommand";

export class DeleteCommand extends DiscordCommand {
  userData: IUserState;
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    //@ts-ignore
    UserMD.byUserID(message.author.id).then(async (userData: IUserState) => {
      // console.log(userData);
      this.userData = userData;

      switch (cmdArguments[0]) {
        case "account":
          await this.deleteAccountConformation(message);
          break;
        default:
          message.reply("!delete <mode>    modes = account");
      }
    });
  }
  async deleteAccountConformation(message: Discord.Message) {
    const acceptEmoji = `🔵`,
      rejectEmoji = `🔴`;

    const ConfirmationMSG = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setColor("#F44336")
      .setDescription("Are You Sure You Want To Delete This Account?")
      .addField("Level", this.userData.level.current, true)
      .addField("Experience", this.userData.level.xp, true)
      .addField("crypo", this.userData.crypo, true)

      .addField("Wins", this.userData.playerStat.wins, true)
      .addField("Loses", this.userData.playerStat.loses, true)
      .addField("Current Streak", this.userData.playerStat.streak, true)
      .addField("Joined data", this.userData.playerStat.joinedDate)
      .setFooter(`please confirm this action by adding ${acceptEmoji}`);

    let sentConfMSG = (await message.channel.send(
      ConfirmationMSG
    )) as Discord.Message;
    // waits for the reactions to be added
    await Promise.all([
      sentConfMSG.react(acceptEmoji),
      sentConfMSG.react(rejectEmoji)
    ]);

    const filter = (
      reaction: Discord.MessageReaction,
      user: Discord.GuildMember
    ) => {
      if (
        user.id === message.author.id &&
        (reaction.emoji.name === acceptEmoji ||
          reaction.emoji.name === rejectEmoji)
      ) {
        return true;
      }

      return false;
    };

    await sentConfMSG
      .awaitReactions(
        filter,
        { max: 1, time: 6000 } // waits for 6ms => 6 seconds
      )
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(acceptEmoji) == null ||
          reactionResults.get(acceptEmoji).count - 1 !== 1
        ) {
        } else {
          UserMD.findOneAndDelete({
            userID: message.author.id
          }).then(async next => {
            await message.channel.send("Account Deleted");
          });
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
      })
      .finally(() => sentConfMSG.delete());
  }
}
