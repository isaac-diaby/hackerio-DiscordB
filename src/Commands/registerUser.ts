import * as Discord from "discord.js";
import { IUserState, UserMD, uuidv4 } from "../Models/userState";
export class RigisterUser {
  acceptEmoji = `🔵`;
  rejectEmoji = `🔴`;
  // user: Discord.User;
  // channel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel
  constructor(
    public user: Discord.User,
    public channel:
      | Discord.TextChannel
      | Discord.DMChannel
      | Discord.GroupDMChannel
  ) {
    this.RegisterUser();
  }
  // make confimation form for both account and opt-in
  async RegisterUser() {
    const acceptTerms = await this.createAccountConfimation();
    // console.log(acceptTerms);
    if (!acceptTerms) return;
    // console.log("accepted");
    const opt = await this.askToOptinTheDmsNews();
    await this.createNewUserProfile(opt as boolean);
  }
  /**
   * This make the user confirm the creation of their account
   */
  async createAccountConfimation() {
    const ConfirmationMSG = new Discord.RichEmbed()
      .setAuthor(this.user.username)
      .setColor("#F44336")
      .setDescription(
        "You are about to create a HackerIO account, by doing so, you are accepting the following terms. Are you sure you Want create an account?"
      )
      .addField("1.", "Allow HackerIO to store your userID in it's database")
      .addField(
        "2.",
        "Allow HackerIO to send Direct Messages you, you can opt-in or out of news/events/challenges at any time."
      )
      .addField(
        "3.",
        "Allow monitization of in game perks such as 'Elite Status' with in reason OFC"
      )
      .addField(
        "4.",
        "If you ever change your mind there is a delete account command built it. Lets hope it doesnt get to that. "
      )
      .setFooter(`please confirm this action by reacting ${this.acceptEmoji}`);

    let sentConfMSG = (await this.channel.send(
      ConfirmationMSG
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
        user.id === this.user.id &&
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
        { max: 1, time: 20000 } // 20 seconds
      )
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(this.acceptEmoji) !== null &&
          reactionResults.get(this.acceptEmoji).count - 1 === 1
        ) {
          return true;
        } else {
          return false;
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
      })
      .finally(() => sentConfMSG.delete());
  }

  /**
   * This makes the user choose wither or not to opt in the Dm news / updates and more
   */
  async askToOptinTheDmsNews() {
    const ConfirmationMSG = new Discord.RichEmbed()
      .setAuthor(this.user.username)
      .setColor("#F44336")
      .setDescription("Do you want to opt-in to Direct Messages (DM) updates?")
      .addField(
        "Challenges",
        "We will message you about any challenges that will give out huge prizes."
      )
      .addField(
        "Events",
        "Events range from cryptography, Forensic, and Exploits. (Include Prizes Too)"
      )
      .setFooter(`please confirm this action by reacting ${this.acceptEmoji}`);

    let sentConfMSG = (await this.channel.send(
      ConfirmationMSG
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
        user.id === this.user.id &&
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
        { max: 1, time: 20000 } // 20 seconds
      )
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(this.acceptEmoji) !== null &&
          reactionResults.get(this.acceptEmoji).count - 1 === 1
        ) {
          return true;
        } else {
          return false;
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
      })
      .finally(() => sentConfMSG.delete());
  }

  async createNewUserProfile(opt: boolean) {
    const newUser = new UserMD({
      userID: this.user.id,
      playerStat: {
        opt_in: opt
      },
      ip: uuidv4()
    });
    newUser
      .save()
      .then((data: any) => {
        // new user created success message
        const successfulNewAccountMSG = new Discord.RichEmbed()
          .setColor("#60BE82")
          .setAuthor(`${this.user.tag}`)
          .setTitle("New Profile Created!")
          .setDescription(
            `Welcome, I see that this is your first time. Type ${
              process.env.BOT_PREFIX
            }help FOR HELP and good luck on your adventure. (Discord DM based game)`
          )
          .addField("discordbots.org", "http://bit.ly/HIOdiscordBots")
          .addField(
            "Join The Official Serverr",
            "http://bit.ly/CGBofficialServer"
          )
          .addField(
            "README: DISCLAIMER:",
            "HackerIO is an online educational game, IS JUST A GAME. DONT SHARE IP (you will be foolish to!)"
          )
          .addField("New Players", [
            `0. Your account has been created, Please re-enter a command you want to execute`,
            `1. You execute commands with the following prefix: ${
              process.env.BOT_PREFIX
            }`,
            `2. Execute ${
              process.env.BOT_PREFIX
            }help - this is all the in-game commands`,
            `3. Execute ${
              process.env.BOT_PREFIX
            }stat - this shows information about you! (don't share your Ip cuz you can't change it (until v3.0)!`,
            `4. Execute ${
              process.env.BOT_PREFIX
            }learn - get to know some of the commands that will help you get a better chance in your hacks. (very userful!)`,
            `4. Execute ${
              process.env.BOT_PREFIX
            }hack -u -r - this is your first random user hack, good luck!`,
            "5. your all set to EXPLORE THE ENDLESS HACKING, EVENTS and  BETTING GAMES"
          ])
          .setFooter(
            "For more features and exclusive bonuses become a Donater!: http://bit.ly/CGBdonate"
          );
        this.channel.send(successfulNewAccountMSG);
      })
      .catch((e: any) => {
        // new user created fail message
        const FailedNewUserMSG = new Discord.RichEmbed()
          .setTitle("New User Error!")
          .setColor("#F44336")
          .setAuthor(`${this.user.tag}`)
          .setDescription(
            `There was an error creating ${this.user} account on the server`
          );
        this.channel.send(FailedNewUserMSG);
        // discordChannel.send(e)
      });
  }
}
