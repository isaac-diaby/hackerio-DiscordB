import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { UserMD } from "../../Models/userState";

export class DailyRewardCommand extends DiscordCommand {
  static CLAIMED: Set<string> = new Set();
  BASE_REWARD = 250; // base ammout that is given out
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    if (DailyRewardCommand.CLAIMED.has(this.msg.author.id)) {
      this.msg.reply("you already claimed your daily reward");
      return;
    } else {
      UserMD.findOne({ userID: this.msg.author.id }).then(
        async userUpdatedData => {
          await UserMD.findOneAndUpdate(
            { userID: this.msg.author.id },
            {
              $inc: {
                crypto: this.BASE_REWARD * userUpdatedData.level.current
              }
            }
          )
            .exec()
            .then(d => {
              if (!DailyRewardCommand.CLAIMED.has(this.msg.author.id)) {
                DailyRewardCommand.CLAIMED.add(this.msg.author.id);
                this.msg.reply(
                  `Claimed:  ${this.BASE_REWARD *
                    userUpdatedData.level.current}`
                );
                const StatusUpdate = setInterval(() => {
                  DailyRewardCommand.CLAIMED.delete(this.msg.author.id);
                  clearInterval(StatusUpdate);
                }, 86400); // 86,400 = 1 day
              }
            });
        }
      );
    }
  }
}
