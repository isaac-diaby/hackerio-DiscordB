import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { IUserState, UserMD, Ilog } from "../../Models/userState";
import { BanksCommand, IbankMeta } from "../guide/banksCommand";
import { TypeOfHacks } from "./typeOfHacks";

export interface Ieffects {
  winChanceAlt: number;
}
export class HackCommand extends DiscordCommand {
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
        switch (this.args[0]) {
          case "-b" || "-bank":
            await this.hackBankInit(userData);
            break;
          case "-u" || "-user":
            await this.hackUserInit(userData);
            break;
          case "-t":
            await this.hackTypingPercentage(1, 1);
            break;
          default:
            await message.channel.send("hack (-b | -u)");
            break;
        }
      }
    );
  }
  async hackUserInit(userData: IUserState) {
    let selectedIp: string;
    if (this.args[1]) selectedIp = this.args[1];
    // gets a random user to hack
    if (selectedIp === "-r" || selectedIp === "random") {
      const randomUser = await this.getRandomOfflineUserData();
      if (randomUser == null)
        return this.msg.channel.send(
          new Discord.MessageEmbed()
            .setColor("#F44336")
            .setTitle("Couldn't Find A Random Player.")
            .addField(
              "Solution: Get More people to Register",
              "http://bit.ly/HIOinvite"
            )
        );
      selectedIp = randomUser.ip;
    }

    const enemyData = await this.doUserCheckViaIp(selectedIp);

    if (enemyData == null) {
      await this.msg.channel.send(
        `Could not find user offline with an ip of ${selectedIp}. Please enter a valid ip or random. \n${
          process.env.BOT_PREFIX
        }hack -u <ip = ip | (-r | random)> `
      );
      return;
    }
    if (await this.hackUserConfirmationStage(enemyData, userData))
      this.hackUser(enemyData, userData);
  }
  async hackUser(enemyData: IUserState, userData: IUserState) {
    await this.UpdateUserHackingStatus(userData.userID, true);
    // standard maths to find out how link you are to win
    let myWinChance;
    if (userData.level.current >= enemyData.level.current) {
      myWinChance =
        100 -
        Math.round(enemyData.level.current / userData.level.current / 0.02);
    } else {
      myWinChance = Math.round(
        userData.level.current / enemyData.level.current / 0.02
      );
    }
    // new win rate with users buffs/ debuffs
    const myListedEffected = this.effectsOnUser(userData);
    const EnemylistedEffected = this.effectsOnUser(enemyData);
    myWinChance +=
      myListedEffected.winChanceAlt - EnemylistedEffected.winChanceAlt;
    //Dont Round the final!
    const commandExecutionBonus = await this.hackTypingPercentage(
      enemyData.level.current,
      userData.level.current
    );
    myWinChance *= commandExecutionBonus;

    const won = this.didIwinLuckDraw(myWinChance);
    await this.hackUserResults(
      won,
      commandExecutionBonus,
      myListedEffected,
      enemyData,
      userData
    );
  }
  async hackUserResults(
    won: boolean,
    CEB: number,
    listedEffected: Ieffects,
    enemyData: IUserState,
    userData: IUserState
  ) {
    const Msg = new Discord.MessageEmbed();
    let myFinalMoney: number = userData.crypto;
    let myFinalXp: number = userData.level.xp;
    let enemyFinalMoney: number = enemyData.crypto;
    let enemylogMsg: Ilog = {
      type: !won ? "DEFENDED" : "HACKED",
      time: Date.now(),
      des: `You ${
        !won ? "Successfully Won" : "Unfortunately Lost"
      } The Defence! ${
        !won ? "Atackers IP: " + userData.ip : "Someone hacked you"
      } `,
      cashDif: 0
    };
    let XpGained;

    let ememyOffering;
    if (enemyData.playerStat.outcast) {
      ememyOffering = Math.round(
        (enemyData.crypto * 0.6) / this.getRandomPercentage(145, 200)
      );
    } else if (enemyData.playerStat.elite) {
      ememyOffering = Math.round(
        (enemyData.crypto * 0.2) / this.getRandomPercentage(165, 220)
      );
    } else {
      ememyOffering = Math.round(
        (enemyData.crypto * 0.4) / this.getRandomPercentage(150, 200)
      );
    }
    if (won) {
      myFinalMoney += ememyOffering;
      enemyFinalMoney -= ememyOffering;
      myFinalXp += ememyOffering;
      enemylogMsg.cashDif = ememyOffering;

      // TODO add custume messages to enemy logs here
    } else {
      XpGained = Math.round(
        ememyOffering * (userData.level.current / enemyData.level.current) * 0.1
      );
      myFinalXp += XpGained;
    }
    Msg.setAuthor(`Hacking ${enemyData.ip}`)
      .setTitle(
        `You ${won ? "Successfully Won" : "Unfortunately Lost"} The Hack!`
      )
      .setColor(`${won ? "#60BE82" : "#F44336"} `)
      .addField("Stake", `${won ? ememyOffering : 0}`)
      .addField("Xp Gained", `${won ? ememyOffering : XpGained}`)
      .addField("My Account Crypto", myFinalMoney);
    await this.UpdateUserHackingStatus(userData.userID, false); // TODO: make and delete the hacking meta in db
    await this.AfterHackProfit(
      userData.userID,
      myFinalMoney,
      myFinalXp,
      {
        type: won ? "TOOK" : "LOST",
        time: Date.now(),
        des: `You ${won ? "Successfully Won" : "Unfortunately Lost"} The Hack!`,
        cashDif: won ? ememyOffering : 0
      },
      false
    );
    await this.AfterHackProfit(
      enemyData.userID,
      enemyFinalMoney,
      enemyData.level.xp,
      enemylogMsg,
      false
    );
    await this.msg.channel.send(Msg);
  }

  async hackUserConfirmationStage(enemyData: IUserState, userData: IUserState) {
    let difficulty;
    if (enemyData.level.current > 133) {
      difficulty = "144 - 200";
    } else if (enemyData.level.current > 66) {
      difficulty = "67 - 133";
    } else {
      difficulty = "0 - 66";
    }
    const roughMoneyEstimate = Math.floor(enemyData.crypto / 1000) * 1000;
    let Msg = new Discord.MessageEmbed()
      .setTitle(`Hacking ${enemyData.ip}`)
      .setDescription("Are you sure you want to continue with this action?")
      .setColor("#F44336")
      .addField("Recommended Level", difficulty, true)
      .addField("My Level", userData.level.current, true)
      .addField(
        "Enemy Money Estimate",
        enemyData.level.current - userData.level.current < 9
          ? `~${roughMoneyEstimate}`
          : "N/A"
      )
      .addField(
        "Enemy Is Outcast",
        userData.playerStat.elite
          ? enemyData.playerStat.outcast
          : "N/A - Become Elite To See This"
      )
      .addField("\u200b", "\u200b")
      .addField("Note Risk", [
        "If you fail your hack the enemy player will have your ip in their logs,they can attemp to hack you back!"
      ])
      .setFooter("please read the conditions before selecting.");

    let sentConfMSG = (await this.sendMsgViaDm(
      Msg,
      this.msg.author,
      false
    )) as Discord.Message;
    await this.msg.reply("Confirmation message is sent to you via DM.");
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
    return await sentConfMSG
      .awaitReactions(
        filter,
        { max: 1, time: 60000 } // waits for 6ms => 6 seconds
      )
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(this.acceptEmoji) == null ||
          reactionResults.get(this.acceptEmoji).count - 1 !== 1
        ) {
          return;
        } else {
          return true;
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
        return false;
      })
      .finally(() => sentConfMSG.delete());
  }
  /**
   * Get a Random Ip that is offline
   */
  async getRandomOfflineUserData() {
    const c = await UserMD.findOne({ online: false }).countDocuments();
    const random = Math.floor(Math.random() * c);
    // console.log(random)
    return await UserMD.findOne({ online: false }).skip(random); // .then(u => console.log(u))
  }
  async doUserCheckViaIp(ip: string) {
    return await UserMD.findOne({ ip, online: false });
  }

  async hackBankInit(userData: IUserState) {
    let selectedBankName: string;
    if (this.args[1]) selectedBankName = this.args[1];
    const availableBanksOnly: IbankMeta[] = BanksCommand.BANKS_META.filter(
      bank => bank.minPlayerLevel <= userData.level.current
    );
    // console.log(availableBanksOnly)
    while (
      [
        "quit",
        ...(availableBanksOnly.length > 0
          ? availableBanksOnly.map(banks => banks.name)
          : "")
      ].includes(selectedBankName) === false
    ) {
      if (availableBanksOnly.length === 0) {
        selectedBankName = "quit";
      } else {
        let Msg = new Discord.MessageEmbed()
          .setTitle("Please Select A Bank Via Name")
          .addField(
            "Bank Names",
            [...availableBanksOnly.map(banks => banks.name)],
            true
          )
          .addField(
            "Required Level",
            [...availableBanksOnly.map(banks => banks.minPlayerLevel)],
            true
          )
          .addField(
            "Required Money",
            [...availableBanksOnly.map(banks => banks.hackPrice)],
            true
          )
          .setFooter(" type quit to stop");
        const userMessage: Discord.Message = (await this.msg.channel.send(
          Msg
        )) as Discord.Message;
        await userMessage.channel
          .awaitMessages(
            (m: Discord.Message) =>
              ["quit", ...availableBanksOnly.map(banks => banks.name)].includes(
                m.content
              ) || m.author.id === this.msg.author.id,
            { max: 1, time: 15000 }
          )
          .then(c => (selectedBankName = c.first().content))
          .catch(e => console.log(e));
      }
    }
    if (selectedBankName === "quit") {
      if (availableBanksOnly.length === 0)
        await this.msg.channel.send(
          "You need to be at least level 5 to interact with Banks"
        );
      return;
    }
    // user Selected a bank
    const selectedBank: IbankMeta[] = BanksCommand.BANKS_META.filter(
      bank => bank.name === selectedBankName
    );
    if (await this.hackBankConfirmationStage(selectedBank[0], userData))
      this.hackBank(selectedBank[0], userData);
  }

  async hackBank(bankDetails: IbankMeta, userData: IUserState) {
    await this.UpdateUserHackingStatus(userData.userID, true);
    // standard maths to find out how link you are to win
    let myWinChance;
    if (userData.level.current > bankDetails.bankLevel) {
      myWinChance =
        100 - Math.round(bankDetails.bankLevel / userData.level.current / 0.02);
    } else {
      myWinChance = Math.round(
        userData.level.current / bankDetails.bankLevel / 0.02
      );
    }
    // new win rate with users buffs/ debuffs
    const listedEffected = this.effectsOnUser(userData);
    myWinChance += listedEffected.winChanceAlt;
    //Dont Round the final!
    const commandExecutionBonus = await this.hackTypingPercentage(
      bankDetails.bankLevel,
      userData.level.current
    );
    myWinChance = myWinChance * commandExecutionBonus;

    const won = this.didIwinLuckDraw(myWinChance);
    await this.hackBankResults(
      won,
      commandExecutionBonus,
      listedEffected,
      bankDetails,
      userData
    );
  }

  /**
   * Conformation stage of hacking a bank. make it clear how much the player is risking by hacking this bank
   */
  async hackBankConfirmationStage(
    bankDetails: IbankMeta,
    userData: IUserState
  ) {
    // let continueToHack = false

    if (userData.crypto < bankDetails.hackPrice) {
      await this.msg.channel.send(
        `You need to at least have ${
          bankDetails.hackPrice
        } crypto's in your account`
      );
      return;
    }
    let Msg = new Discord.MessageEmbed()
      .setTitle(`Hacking ${bankDetails.name} Bank`)
      .setDescription("Are you sure you want to continue with this action?")
      .setColor("#F44336")
      .addField("Required Level", bankDetails.minPlayerLevel, true)
      .addField("My Level", userData.level.current, true)
      .addField("Required Money To Cover Your loses", bankDetails.hackPrice * 2)
      .addField("\u200b", "\u200b")
      .addField("Note Risk", [
        "You need to have at least half the required crypto!",
        "If you fail your hack the bank, you will be fined (90 - 100%)",
        "If you dont have enough crypto to pay the fine your IP will be marked as outcast!"
      ])
      .setFooter("please read the conditions before selecting");
    let sentConfMSG = (await this.sendMsgViaDm(
      Msg,
      this.msg.author,
      false
    )) as Discord.Message;
    await this.msg.reply("Confirmation message is sent to you via DM.");
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

    return await sentConfMSG
      .awaitReactions(
        filter,
        { max: 1, time: 60000 } // waits for 6ms => 6 seconds
      )
      .then(reactionResults => {
        // console.log(reactionResults.get(acceptEmoji));
        if (
          reactionResults.get(this.acceptEmoji) == null ||
          reactionResults.get(this.acceptEmoji).count - 1 !== 1
        ) {
          return;
        } else {
          return true;
        }
      })
      .catch((e: any) => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
        return false;
      })
      .finally(() => sentConfMSG.delete());
  }
  /**
   *
   * @param won if the player won the hack
   * @param CEB commands executed % for extra crypto
   * @param listedEffected boosts the profit
   * @param bankDetails
   * @param userData
   */
  async hackBankResults(
    won: boolean,
    CEB: number,
    listedEffected: Ieffects,
    bankDetails: IbankMeta,
    userData: IUserState
  ) {
    const bankOffering = Math.round(
      bankDetails.hackPrice * CEB +
        bankDetails.hackPrice * (listedEffected.winChanceAlt / 100)
    );
    let myFinalMoney: number = userData.crypto;
    let myFinalXp: number = userData.level.xp;
    if (won) {
      myFinalMoney += bankOffering;
      myFinalXp += bankOffering;
    } else {
      myFinalMoney -= bankOffering;
      myFinalXp += Math.round(bankOffering / 2);
    }

    const Msg = new Discord.MessageEmbed()
      .setAuthor(`Hacking ${bankDetails.name} Bank`)
      .setTitle(
        `You ${won ? "Successfully Won" : "Unfortunately Lost"} The Hack!`
      )
      .setColor(`${won ? "#60BE82" : "#F44336"} `)
      .addField("Stake", bankOffering)
      .addField("My Account Funds", myFinalMoney);
    await this.UpdateUserHackingStatus(userData.userID, false);
    await this.AfterHackProfit(
      userData.userID,
      myFinalMoney,
      myFinalXp,
      {
        type: won ? "TOOK" : "LOST",
        time: Date.now(),
        des: `You ${
          won ? "Successfully Won" : "Unfortunately Lost"
        } The Hack against: ${bankDetails.name} Bank `,
        cashDif: bankOffering
      },
      !won
    );
    await this.msg.channel.send(Msg);
  }

  /**
   * Isaac M Diaby
   * @param enemyLevel
   * @param myLevel
   */
  async hackTypingPercentage(enemyLevel: number, myLevel: number) {
    const additionalRounds =
      enemyLevel > myLevel && enemyLevel - myLevel > 9
        ? Math.ceil((enemyLevel - myLevel) * 0.1)
        : 0;
    const rounds = 5 + additionalRounds;
    let difficulty;
    if (enemyLevel > 133) {
      difficulty = 3;
    } else if (enemyLevel > 66) {
      difficulty = 2;
    } else {
      difficulty = 1;
    }
    let CorrentAnswers = 0;
    let questionMsg: Discord.Message = (await this.msg.channel.send(
      "Starting Hacking Session"
    )) as Discord.Message;
    for (let i = 1; i <= rounds; i++) {
      // TODO: add different type of hack
      const Msg = new Discord.MessageEmbed()
        .setColor("#551A8B")
        .setTitle(`Commands left ${i}/${rounds}`)
        .addField("Correct", CorrentAnswers);
      const hackingTypes = await new TypeOfHacks(
        Msg,
        questionMsg,
        this.msg.author,
        difficulty
      );
      CorrentAnswers += (await hackingTypes.randomHackType()) ? 1 : 0;
    }
    const percentage = Math.round((CorrentAnswers / rounds) * 100) / 100;
    questionMsg.delete({ timeout: 60000 });
    return 0.1 + percentage;
  }
  /**
   *  Decides if the player won the hack or not
   * @param WinChance
   */
  didIwinLuckDraw(WinChance: number) {
    const winningPercentage = Math.floor(Math.random() * 100);
    // console.log(winningPercentage, WinChance);
    return winningPercentage <= WinChance;
  }
  /**
   *
   * @param userID
   * @param crypto
   * @param log
   */
  async AfterHackProfit(
    userID: string,
    crypto: number,
    myFinalXp: number,
    log: Ilog,
    isOutcast: boolean
  ) {
    await UserMD.findOneAndUpdate(
      { userID },
      {
        "playerStat.outcast": isOutcast,
        "level.xp": myFinalXp,
        crypto,
        $push: { log }
      }
    )
      .exec()
      .catch(e => console.log(e));
  }

  /**
   *  the penalties or buffs that need to be applies to the user's hacks
   * @param userData
   */
  effectsOnUser(userData: IUserState): Ieffects {
    let effectsAlt: Ieffects = { winChanceAlt: 0 };
    if (userData.playerStat.elite)
      effectsAlt.winChanceAlt = Math.abs(
        Math.ceil(userData.level.current * 0.075)
      );
    if (userData.playerStat.outcast)
      effectsAlt.winChanceAlt -= Math.abs(
        Math.ceil(userData.level.current * 0.075)
      );
    // console.log(effectsAlt)
    return effectsAlt;
  }
  getRandomPercentage(min: number, max: number) {
    return (Math.floor(Math.random() * (max - min + 1)) + min) / 100;
  }
  /**
   *
   * @param userID
   * @param isInHack
   * @param hackID
   */
  async UpdateUserHackingStatus(
    userID: string,
    isInHack: boolean,
    hackID: string = null
  ) {
    await UserMD.findOneAndUpdate(
      { userID },
      {
        inHack: {
          hackID,
          isInHack,
          lastHack: new Date()
        }
      }
    ).exec();
  }
}
