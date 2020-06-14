import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { UserMD, IUserState } from "../../Models/userState";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_TOKEN, {
  apiVersion: "2020-03-02"
});

export interface IhackingScripts {
  primaryCmd: string;
  description: string;
  program: "Metasploitable";
}

export class EliteCommand extends DiscordCommand {
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    UserMD.findOne({ userID: message.author.id }).then(
      (userData: IUserState) => {
        switch (this.args[0]) {
          case "-j":
            this.joinElite(userData.userID, userData.playerStat.elite);
            break;
          case "-join":
            this.joinElite(userData.userID, userData.playerStat.elite);
            break;
          default:
            const Msg = new Discord.MessageEmbed()
              .setColor("#1E90FF")
              .setTitle("Elite players (EP)")
              .setDescription("These players are harder to hack")
              .addField("EP perks ⭐", [
                "- Enemies have a (level*0.072) =  just over 13%+ disadvantage success rate when trying to hack you!",
                "- You are able to protect more of your crypto . Only 20% of your crypto is at risk when getting hacked (instead of 60%).",
                "- When hacking a target you get a better chance of stealing more crypto's 💸",
                "- Only pay 80% when paying to get off the out casted players list"
              ])

              .setFooter(
                `To join the elte list type ${
                  process.env.BOT_PREFIX
                }elite -join`
              );
            this.sendMsgViaDm(Msg);
            return;
        }
      }
    );
  }
  joinElite(userID: string, alreadyElite: Boolean) {
    if (alreadyElite) return this.msg.reply("You Are Already Elite!");

    const Msg = new Discord.MessageEmbed()
      .setColor("#60BE82")
      .setTitle("How To Become Elite")
      .setDescription("Follow these simple steps: ")
      .addField("1. Join The Official Sever", "http://bit.ly/CGBofficialServer")
      .addField("2. Pay £1.99 To Get The Title", "HackerIO Elite")
      .setFooter("Run this command again when you joined the officail server!");
    const isUserInOfficialServer = this.OfficialServer.members.cache.get(
      this.msg.author.id
    );
    if (isUserInOfficialServer !== undefined) {
      // prod_HSUluY1kPdL9Ug

      stripe.checkout.sessions.create({
        success_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
        payment_method_types: ["card"],
        line_items: [
          {
            price: "price_1GtZmRJEPnKOpGNRK2GrYKnC",
            quantity: 1
          }
        ]
      });
      stripe.paymentIntents
        .create({
          amount: 199,
          currency: "gbp",
          payment_method_types: ["card"],
          metadata: { discordID: userID }
        })
        .then(paymentIntent => {
          console.log(paymentIntent);
        })
        .then(() => {
          // HackerIO Elite == 605180133535645745
          if (
            !isUserInOfficialServer.roles.cache.has(
              this.mainGuildData.roles.elite
            )
          )
            return this.msg.channel.send(Msg);
          EliteCommand.altEliteStatus(userID, true, this.msg.author);
        })
        .catch(err => console.log(err));
    } else {
      this.msg.channel.send(Msg);
    }
  }
  static altEliteStatus(userID: string, isElite: boolean, user: Discord.User) {
    const Msg = new Discord.MessageEmbed()
      .setColor("#F44336")
      .setTitle("Elite Update")
      .setAuthor(user.tag, user.avatarURL());
    isElite
      ? Msg.setDescription("Welcome to the elite ⚔.")
          .setFooter("Cancel at any time with elite -c")
          .setColor("#60BE82")
      : Msg.setDescription("Expired Membership to elite ⌛")
          .addField("Rejoin", "http://bit.ly/HIOdonate")
          .setFooter("Then type elite -j command again to active Elite");
    UserMD.findOneAndUpdate(
      { userID },
      {
        "playerStat.elite": isElite,
        "playerStat.eliteExpireDate": new Date(
          new Date().setMonth(new Date().getMonth() + (1 % 12))
        ) // plus one month
      }
    ).then(d => user.send(Msg));
  }

  static checkIfStillElite(
    user: Discord.User,
    userData: IUserState,
    botClient: Discord.Client
  ) {
    const isUserInOfficialServer = botClient.guilds.cache
      .get("566982444822036500")
      .members.cache.get(user.id);
    // @ts-ignore
    if (userData.playerStat.eliteExpireDate <= Date.now().valueOf()) {
      // membership expired
      isUserInOfficialServer.roles
        .remove("605180133535645745", "Membership has expired")
        .catch(e =>
          console.log(
            e +
              ": Tried to remove elite role from someone high up or doesnt exist"
          )
        );
      return EliteCommand.altEliteStatus(user.id, false, user);
    }
    if (isUserInOfficialServer !== undefined) {
      // HackerIO Elite == 605180133535645745
      if (!isUserInOfficialServer.roles.cache.has("605180133535645745")) {
        isUserInOfficialServer.roles
          .remove("605180133535645745", "Membership has expired")
          .catch(e =>
            console.log("tried to remove elite role from someone high up")
          );
        return EliteCommand.altEliteStatus(user.id, false, user);
      }
    } else {
      // this means they left the support server. not allowed if your elite!
      return EliteCommand.altEliteStatus(user.id, false, user);
    }
  }
}
