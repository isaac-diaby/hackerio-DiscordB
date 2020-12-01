import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { UserMD, IUserState } from "../../Models/userState";
import Stripe from "stripe";
import { SubscriptionMD } from "../../Models/subscriptionState";
const stripe = new Stripe(process.env.STRIPE_STOKEN, {
  apiVersion: "2020-08-27"
});
const port = process.env.PORT || 3000;
const domain =
  process.env.PRODUCTION == "True"
    ? "https://hacker-io-discord.herokuapp.com"
    : `http://localhost:${port}`;

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
          case "-join":
          case "-j":
            this.joinElite(
              userData.userID,
              userData.playerStat.elite,
              userData.custumerID
            );
            break;

          case "-cancel":
          case "-c":
            this.cancelElite(userData);
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
                `To join the elte list type ${process.env.BOT_PREFIX}elite -join`
              );
            this.sendMsgViaDm(Msg);
            return;
        }
      }
    );
  }

  /**
   * create a cancel subscription function
   * @param userData
   */
  private cancelElite(userData: IUserState) {
    if (userData.custumerID) {
      SubscriptionMD.findOne({
        custumerID: userData.custumerID
      })
        .then((Subscription: { subscriptionID: any }) =>
          this.sendMsgViaDm(
            `${domain}/subscription/cancel/${Subscription.subscriptionID}`
          ).then((msg) => msg.delete({ timeout: 300000 }))
        )
        .catch((e: any) =>
          this.sendMsgViaDm(
            "You dont have an active subscription"
          ).then((msg) => msg.delete({ timeout: 300000 }))
        );
    }
  }

  async joinElite(
    userID: string,
    alreadyElite: Boolean,
    custumerID: string = undefined
  ) {
    if (alreadyElite)
      return this.msg.reply(
        new Discord.MessageEmbed()
          .setColor("#60BE82")
          .setDescription("You Are Already Elite!")
          .setFooter("Cancel at any time with elite -cancel")
      );

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
      //  Check if already payed
      let subscriptionData = await SubscriptionMD.findOne({
        custumerID
      }).catch(err => this.sendMsgViaDm(`ERROR: ${err.raw.message}. Please Contact a developer in the support server. http://bit.ly/CGBofficialServer`, this.msg.author, false));
      if (subscriptionData == null || !(subscriptionData.subscriptionID)) {

        if (custumerID == undefined) {
          // Create a new customer 
          custumerID = await stripe.customers.create({ metadata: { discordID: userID } }
            , { idempotencyKey: userID }
          ).then(
            newCustomer => {
              return UserMD.findOneAndUpdate({ userID }, { custumerID: newCustomer.id }).exec().then(() => newCustomer.id)
            }
          ).catch(err => this.sendMsgViaDm(`ERROR: ${err.raw.message}. Please Contact a developer in the support server. http://bit.ly/CGBofficialServer`, this.msg.author, false));
        }
        if (!subscriptionData) {
          subscriptionData = await new SubscriptionMD({
            custumerID
          }).save();
        }
        stripe.checkout.sessions
          .create(
            {
              success_url: `${domain}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${domain}/payment/cancel`,
              payment_method_types: ["card"],
              mode: "subscription",
              customer: custumerID,
              client_reference_id: userID,
              metadata: { discordID: userID },
              line_items: [
                {
                  price:
                    process.env.PRODUCTION == "True"
                      ? "price_1GuIskJEPnKOpGNRHxFzGYTr"
                      : "price_1GtZmRJEPnKOpGNRK2GrYKnC",
                  quantity: 1
                }
              ],
              subscription_data: {
                coupon:
                  process.env.PRODUCTION == "True"
                    ? "welcomeToElite"
                    : "b6koFEwj"
              }
            },
            {
              idempotencyKey: subscriptionData.id
            }
          )
          .then((paymentSession: { id: any }) => {
            this.sendMsgViaDm(
              `${domain}/payment?checkout_session_id=${paymentSession.id}`
            ).then((msg) => msg.delete({ timeout: 300000 }));
          })
          .catch((err: { raw: { message: any } }) =>
            this.sendMsgViaDm(
              `ERROR: ${err.raw.message}. Please Contact a developer in the support server. http://bit.ly/CGBofficialServer`,
              this.msg.author,
              false
            )
          );
      } else {
        // HackerIO Elite == 605180133535645745
        await isUserInOfficialServer.roles.add(
          this.mainGuildData.roles.elite,
          "Paid for elite status"
        );
        if (
          !isUserInOfficialServer.roles.cache.has(
            this.mainGuildData.roles.elite
          )
        )
          return this.msg.channel.send(Msg);
        // You need the elite role in the server.
        EliteCommand.altEliteStatus(userID, true, this.msg.author);
      }
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
      ? Msg.setDescription("Welcome to the elite ⚔")
          .setFooter("Cancel at any time with elite -cancel")
          .setColor("#60BE82")
      : Msg.setDescription("Expired Elite Membership ⌛").setFooter(
          "To rejoin type the elite -join command to re-active your Elite status"
        );
    UserMD.findOneAndUpdate(
      { userID },
      {
        "playerStat.elite": isElite,
        "playerStat.eliteExpireDate": new Date(
          new Date().setMonth(new Date().getMonth() + (1 % 12))
        ) // plus one month
      }
    ).then((d) => user.send(Msg));
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
        .catch((e) =>
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
          .catch((e) =>
            console.log("Tried to remove elite role from someone high up")
          );
        return EliteCommand.altEliteStatus(user.id, false, user);
      }
    } else {
      // this means they left the support server. not allowed if your elite!
      return EliteCommand.altEliteStatus(user.id, false, user);
    }
  }
}
