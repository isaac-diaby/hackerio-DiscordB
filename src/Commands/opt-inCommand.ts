import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";
import { IUserState, UserMD } from "../Models/userState";

export class OptCommand extends DiscordCommand {
  acceptEmoji = `🔵`;
  rejectEmoji = `🔴`;

  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    UserMD.findOne({ userID: message.author.id }).then(
      async (userData: IUserState) => {
        if (userData) {
          let Msg = new Discord.RichEmbed()
            .setTitle("Toggle Opt-in")
            .setDescription(
              "Opt-in means that you allow HackerIO to message you via Direct Messages about events and news updates"
            )
            .addField("Current Opt-in Status", userData.playerStat.opt_in)
            .setFooter(
              `please confirm this action by reacting ${this.acceptEmoji}`
            );

          let sentConfMSG = (await this.msg.channel.send(
            Msg
          )) as Discord.Message;
          // waits for the reactions to be added
          await Promise.all([
            sentConfMSG.react(this.acceptEmoji),
            sentConfMSG.react(this.rejectEmoji)
          ]);

          const filter = (
            reaction: Discord.MessageReaction,
            user: Discord.GuildMember
          ) => {
            if (
              user.id === this.msg.author.id &&
              (reaction.emoji.name === this.acceptEmoji ||
                reaction.emoji.name === this.rejectEmoji)
            ) {
              return true;
            }

            return false;
          };

          return sentConfMSG
            .awaitReactions(
              filter,
              { max: 1, time: 7000 } // 7 seconds
            )
            .then(reactionResults => {
              // console.log(reactionResults.get(acceptEmoji));
              if (
                reactionResults.get(this.acceptEmoji) !== null &&
                reactionResults.get(this.acceptEmoji).count - 1 === 1
              ) {
                UserMD.findOneAndUpdate(
                  {
                    userID: this.msg.author.id
                  },
                  { "playerStat.opt_in": !userData.playerStat.opt_in }
                ).then(async next => {
                  await message.channel.send(
                    next.playerStat.opt_in
                      ? "You have been removed from the opt-in list"
                      : "You are now opt-in"
                  );
                });
                return true;
              }
            })
            .catch((e: any) => {
              console.log("ERROR: listening to players accept/reject reaction");
              console.log(e);
            })
            .finally(() => sentConfMSG.delete());
        }
      }
    );
  }
}
