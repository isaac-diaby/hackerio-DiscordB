import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
// @ts-ignore
import request from "request";

export class SuggestCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);

    // checks if the user made a suggestion
    if (this.args.length < 1) {
      this.displaySuggestionFormat();
      return;
    }
    // parse the suggestion type
    const suggestionType = this.args.shift();

    const suggestionMSG = new Discord.RichEmbed().setAuthor(
      this.msg.author.tag
    );

    if (suggestionType === "bug" || suggestionType === "update") {
      suggestionMSG.addField("TYPE", suggestionType);
      // turns the rest of the args to the suggestion message
      const suggestionMessage = this.args.join(" ");
      suggestionMSG.addField(">", suggestionMessage);
      new Discord.TextChannel(
        this.botClient.guilds.get(this.mainGuildData.id),
        this.botClient.channels.get(
          this.mainGuildData.channels.suggestions.channel
        )
      )
        .send(suggestionMSG)

        .then(sentMSG => {
          const suggestionSentMSG = sentMSG as Discord.Message;
          this.listenForSuggestionApproval(suggestionSentMSG, {
            suggestionType,
            suggestionMessage,
            author: this.msg.author.tag
          });
          suggestionMSG
            .setDescription("📜 Suggestion Sent")
            .setFooter("support server: http://bit.ly/CGBofficialServer")
            .setColor("#60BE82");
          this.msg.channel.send(suggestionMSG);
        })
        .catch(e => {
          console.log(e);
          this.msg.reply("Failed to send suggestion");
        });
    } else {
      this.displaySuggestionFormat();
    }
  }
  /**
   * sends the user the format on howthe suggestion should be constructed
   */
  async displaySuggestionFormat() {
    const formatMSG = new Discord.RichEmbed()
      .setColor("#F44336")
      .setDescription(
        `Invalid Suggestion format\n
                    example: ${
                      process.env.BOT_PREFIX
                    }suggest bug this is just a test bug report\n
                    exampl:. ${
                      process.env.BOT_PREFIX
                    }suggest update this is just a test update report\n`
      )
      .setAuthor(this.msg.author.tag);
    await this.msg.channel.send(formatMSG);
  }
  /**
   * this will listen to a message for approval then add the suggestion to
   * @param message the suggestion that you want to listen to
   */
  async listenForSuggestionApproval(
    message: Discord.Message,
    suggestionData: {
      suggestionType: string;
      suggestionMessage: string;
      author: string;
    }
  ) {
    const approvalEmoji = "👍";
    const teamOnlyFilter = (
      reaction: Discord.MessageReaction,
      user: Discord.GuildMember
    ) => {
      const isPartOftheTeam = this.botClient.guilds
        .get(this.mainGuildData.id)
        .members.get(user.id)
        .roles.has(this.mainGuildData.roles.team);

      if (isPartOftheTeam && reaction.emoji.name === approvalEmoji) {
        return true;
      }

      return false;
    };
    message
      .awaitReactions(teamOnlyFilter, { time: 86400000, max: 1 })
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(approvalEmoji) !== null ||
          reactionResults.get(approvalEmoji).count - 1 === 1
        ) {
          // Add the suggestion to kraken via API
          const boardID = "5d6a8d020b4324000f1be0c4";
          let columnID: string;
          switch (suggestionData.suggestionType) {
            case "bug":
              columnID = "5d6a8d51e6bd4e000ffb1581";
              break;
            case "update":
              columnID = "5d6a8d11556e08000f813cf9";
              break;
          }

          const options = {
            method: "POST",
            url: `https://gloapi.gitkraken.com/v1/glo/boards/${boardID}/cards/`,
            headers: {
              "cache-control": "no-cache",
              Authorization: `Bearer ${process.env.API_GITKRAKEN}`,
              "Content-Type": "application/json"
            },

            // the card data
            body: {
              name: suggestionData.suggestionMessage,
              labels: [
                {
                  id: "5d6b73ae0b4324000f1bed53"
                }
              ],
              column_id: columnID
            },
            json: true
          };

          request(options, function(error: any, response: any, body: any) {
            if (error) throw new Error(error);

            console.log(body);
            message.channel.send(
              new Discord.RichEmbed()
                .setColor(
                  suggestionData.suggestionType === "bug"
                    ? "#F44336"
                    : "#60BE82"
                )
                .setTitle(
                  `New ${suggestionData.suggestionType.toUpperCase()} Approved`
                )
                .setDescription(
                  `Link to the card: ${"https://app.gitkraken.com/glo/board/XWqNAgtDJAAPG_DE/card/" +
                    body.id}`
                )
                .addField("Suggestion Message", message.url)
                .addField(
                  "Aprove By",
                  reactionResults.get(approvalEmoji).users.first().tag
                )
            );
          });

          // .then(async next => {
          //   await message.channel.send("");
          // });
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
      });
  }
}
