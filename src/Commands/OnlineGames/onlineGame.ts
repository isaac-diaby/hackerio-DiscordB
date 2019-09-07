import * as Discord from "discord.js";
import { DiscordCommand } from "../DiscordCommand";
import { uuidv4 } from "../../Models/userState";

import { UserMD, IUserState } from "../../Models/userState";
import { IGameMetaInfo, IGameMetaData, GameMD } from "../../Models/gameState";
// import { IGameMetaData, IGameMetaInfo, GameMD } from

//@ts-ignore
export abstract class OnlineGames extends DiscordCommand {
  hUser: Discord.GuildMember;
  metaConfig: IGameMetaInfo;
  gameMetaData: IGameMetaData;
  GameData: any;

  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    try {
      this.hUser = message.guild.member(message.author);
    } catch (e) {
      message.channel.send("This A Guild Only Command!");
    }
  }

  /**
   * Confirmation Stage:
   * - Sends out a message to the channel which the initial game invite was sent.
   * - Both players must Accept by reacting with the accept emojie for the game to be registered.
   *
   * validation:
   * - Checks if the player is part of the database
   * - Whether or not the other players are in a game.
   * - Checks if the number of players needed for the game to start is met.
   *
   */
  async GameConfirmationStage() {
    const acceptEmoji = `🔥`,
      rejectEmoji = `❌`;
    //'🔵'; '✔'; ':heavy_check_mark:️'
    //'🔴'; '❌';':x:'

    this.gameMetaData = {
      guildID: this.msg.guild.id,
      gameID: null,
      status: null,
      accepted: false,
      playerIDs: [this.hUser.id],
      players: [this.hUser.user],
      channelID: this.msg.channel.id,
      metaInfo: this.metaConfig
    };
    let currentStatusMSG = new Discord.RichEmbed().setTitle(
      `Playing ${this.metaConfig.title}`
    );
    // .addField('GameID', this.gameMetaData.gameID);

    // the message which the players have to accept
    const ConfirmationMSG = new Discord.RichEmbed()
      .setImage(this.metaConfig.imageUrl)
      .setTitle(`Playing ${this.metaConfig.title}`)
      .setDescription(
        this.metaConfig.description ? this.metaConfig.description : ""
      )
      .setColor("#D3D3D3");

    switch (this.metaConfig.numPlayers) {
      case 1:
        ConfirmationMSG.addField("Player: ", this.hUser);
        break;
    }
    // more than 1
    // write a function that will support more than 1 players games
    if (this.metaConfig.numPlayers > 1) {
      const e = await this.getMentionedPlayers(this.msg);
      // console.log(e);
      if (e === undefined) return;
      const { players, ids } = e;
      this.gameMetaData.playerIDs = this.gameMetaData.playerIDs.concat(ids);
      this.gameMetaData.players = this.gameMetaData.players.concat(players);
    }
    // console.log(this.gameMetaData.playerIDs);
    // checks if the number of players match!
    if (
      this.gameMetaData.playerIDs.length !== this.metaConfig.numPlayers ||
      this.gameMetaData.playerIDs == null
    ) {
      await this.msg.reply(
        `you need to mention ${this.metaConfig.numPlayers -
          1} to players this game`
      );

      return;
    }
    // custume 2 player games
    if (this.gameMetaData.players.length === 2)
      ConfirmationMSG.setAuthor(
        `${this.hUser.user.username} -🆚- ${
          this.gameMetaData.players[1].username
        }`
      )
        .addField("Challenger: ", this.hUser)
        .addField("Challenge: ", this.gameMetaData.players[1]);

    const awitingForString = this.allPlayerTaggedString(
      this.gameMetaData.players,
      `to react in ${acceptEmoji} 6s`
    );

    ConfirmationMSG.setFooter(awitingForString);

    let ConfirmationMSGSent = (await this.msg.channel.send(
      ConfirmationMSG
    )) as Discord.Message;

    // waits for the reactions to be added
    await Promise.all([
      ConfirmationMSGSent.react(acceptEmoji),
      ConfirmationMSGSent.react(rejectEmoji)
    ]);

    //filter function. only players taking part in the game and one the accept and reject emojies are being captured
    const allowedEmo = [acceptEmoji, rejectEmoji];
    //    this.gameMetaData.playerIDs.includes(user.id) && allowedEmo.includes(reaction.emoji.name)

    // listens for all players decision to play or not
    await ConfirmationMSGSent.awaitReactions(
      (reaction: Discord.MessageReaction, user: Discord.GuildMember) =>
        allowedEmo.includes(reaction.emoji.name) &&
        this.gameMetaData.playerIDs.includes(user.id),
      { time: 6000 } // waits for 6ms => 6 seconds
    )
      .then(reactionResults => {
        let filteredUsersAcp;
        let filteredUsersRej;
        if (reactionResults.get(acceptEmoji))
          filteredUsersAcp = reactionResults
            .get(acceptEmoji)
            .users.filter(user =>
              this.gameMetaData.playerIDs.includes(user.id)
            );
        if (reactionResults.get(rejectEmoji))
          filteredUsersRej = reactionResults
            .get(rejectEmoji)
            .users.filter(user =>
              this.gameMetaData.playerIDs.includes(user.id)
            );
        if (
          reactionResults.get(acceptEmoji) === undefined ||
          filteredUsersAcp.size !== this.metaConfig.numPlayers
        ) {
          // not everyone is ready *minus one for the bot
          this.gameMetaData.status = "REJECTED";
          currentStatusMSG
            .setDescription("Not Every One Was Ready!")
            .setColor("#003366")
            .addField("Status", this.gameMetaData.status);

          if (reactionResults.get(rejectEmoji) && filteredUsersRej.size > 0) {
            // console.log(reactionResults.get(rejectEmoji).count);
            // some players rejected the game
            currentStatusMSG
              .setDescription("Someone Rejected!")
              .setColor("#F44336");
          }
        } else {
          // everyone is ready! let the game begin
          this.gameMetaData.status = "ACCEPTED";
          this.gameMetaData.gameID = `${uuidv4()}`;
          this.gameMetaData.accepted = true;
          console.log(`Starting New Game: ${this.gameMetaData.gameID}`);
          currentStatusMSG
            .setDescription("Connection Made")
            .setColor("#2ECC40")
            .addField("Status", this.gameMetaData.status)
            .addField("GameID", this.gameMetaData.gameID)
            .setFooter("Setting up Game Game...");
        }
        return currentStatusMSG; // not needed but oh-well
      })
      .catch(e => {
        console.log("ERROR: listening to players accept/reject reaction");
        console.log(e);
        return null;
      });

    await this.deleteMessageIfCan(ConfirmationMSGSent);

    await this.msg.channel.send(currentStatusMSG);

    return this.gameMetaData.accepted;
  }

  async InitializeGameInDB() {
    const { players, ...metaDataToSend } = this.gameMetaData;

    try {
      const InitializeGameData = new GameMD({
        meta: metaDataToSend
      });
      const { _id } = await InitializeGameData.save();
      // saved game data
      const succesfulInitializeMSG = new Discord.RichEmbed()
        .setTitle("Succesful Initialization")
        .setDescription("Succesfully initialized the game on our servers")
        .addField("GameID", this.gameMetaData.gameID)
        .setFooter("Adding Player(s) To The Lobby")
        .setTimestamp()
        .setColor("#2ECC40");

      await this.msg.channel.send(succesfulInitializeMSG);
      await this.updatePlayersStatusJoinGame(_id);
      return true;
    } catch (e) {
      console.log(e);
      // Failed to save game data
      const failedInitializeMSG = new Discord.RichEmbed()
        .setTitle("Failed Initialization ")
        .setDescription("Failed to initialize the game on our servers")
        .addField("GameID", this.gameMetaData.gameID)
        .addField("Name", e.name ? e.name : "")
        .addField("Message", e.message ? e.message : "")
        .setTimestamp()
        .setFooter(
          "Issue: https://https://github.com/isaac-diaby/hackerio-DiscordB/issues"
        )
        .setColor("#F44336");

      await this.msg.channel.send(failedInitializeMSG);
      return false;
    }
  }

  /**
   * Join the game:
   * - queries the database for userID's that are in the gameMetaData.playerIDs array in the same guildID that the initial game invite message was sent.
   * - updates the users status to being in a game + gameID + last game played date to now!
   */
  async updatePlayersStatusJoinGame(_id: any) {
    // updating each players status to in game
    await UserMD.updateMany(
      {
        userID: this.gameMetaData.playerIDs
      },
      {
        ingame: {
          gameID: _id, //this.gameMetaData.gameID,
          isInGame: true,
          lastGame: Date.now()
        }
      }
    )
      .exec()
      .then(updatedData => {
        // console.log(updatedData);
      })
      .catch(e => {
        console.log("error whilst updating user to lobby!");
        console.log(e);
      });
  }
  /**
   * formats the user game status to default! careful
   * @param userID the user id to format game status
   * @param guildID the guild id that the user is in
   */
  static async updatePlayerStatusLeaveGame(userID: string) {
    // updating each player status to in game
    // @ts-ignore
    await UserMD.findOneAndUpdate(
      {
        userID
      },
      {
        ingame: {
          gameID: null,
          isInGame: false,
          lastGame: Date.now()
        }
      }
    )
      .exec()
      .then((updatedData: any) => {
        // console.log(updatedData);
      })
      .catch((e: any) => {
        console.log("error whilst updating user to lobby!");
        console.log(e);
      });
  }
  /**
   * added crypto's to the player account on the database
   * @param crypto amount to add to the players accoun
   * @param playerID the players id
   * @param guildID the guild that they are in
   */
  async rewardPlayer(
    coinsToAdd: number,
    userID: string,
    won: boolean,
    guildID: string = this.msg.guild.id
  ) {
    try {
      const rewardUpdates = won
        ? {
            $inc: {
              crypto: coinsToAdd,
              "playerStat.wins": 1,
              "playerStat.streak": 1,
              "level.xp": 3 * coinsToAdd
            }
          }
        : {
            "playerStat.streak": 0,
            $inc: {
              crypto: coinsToAdd,
              "playerStat.loses": 1,
              "level.xp": 3 * coinsToAdd
            }
          };

      await UserMD.findOneAndUpdate(
        {
          userID
        },
        rewardUpdates
      ).exec();
      // console.log(E);
      // console.log('looting');
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * This function should be ran at the end of each online game.
   * - Deletes the game data on the database
   * - removes each player from the game + sets their status to not in a game.
   */
  async cleanUpTheGameData() {
    try {
      //@ts-ignore
      await GameMD.deleteOne({ "meta.gameID": this.gameMetaData.gameID });
      this.gameMetaData.playerIDs.forEach(playerID => {
        OnlineGames.updatePlayerStatusLeaveGame(playerID as string);
      });

      const gameClosedeMSG = new Discord.RichEmbed()
        .setTitle("Games Close")
        .setDescription("successfully closed the game on our servers")
        .addField("GameID", this.gameMetaData.gameID)
        .setTimestamp()
        .setColor("#2ECC40");

      this.msg.channel.send(gameClosedeMSG);
    } catch (e) {
      console.log(e);
    }
  }

  allPlayerTaggedString(
    ArrayOfPlayers: Array<Discord.User>,
    endMessage: string
  ) {
    // console.log(ArrayOfPlayers);
    let allPlayersMentionedMsg = "Awaiting for ";
    for (let i = 0; i < ArrayOfPlayers.length - 1; i++) {
      allPlayersMentionedMsg += `${ArrayOfPlayers[i].username}, `;
    }
    allPlayersMentionedMsg += `and ${
      ArrayOfPlayers[ArrayOfPlayers.length - 1].username
    } ${endMessage}`;
    return allPlayersMentionedMsg;
  }

  async getMentionedPlayers(msg: Discord.Message) {
    let playersinfo: {
      players: Discord.User[];
      ids: String[];
    } = {
      players: [],
      ids: []
    };
    // makes sure user mentioned is regestered in the db andplayer is not in a game
    const usersIter = msg.mentions.users.values();
    // msg.mentions.users.forEach(async function(user) {
    for (let i = 0; i < msg.mentions.users.size; i++) {
      let user = usersIter.next();
      // @ts-ignore
      const userData: IUserState = await UserMD.byUserID(
        `${user.value.id}`
      ).exec();

      if (!userData) {
        await msg.reply(`The user ${user.value} you mentioned isnt in the DB`);
      } else if (userData.ingame.isInGame === true) {
        const theyAreAlreadyInAGameMSG = new Discord.RichEmbed()
          .setColor("#F44336")
          .setAuthor(user.value.username)
          .setDescription(
            `player is already in a game, you can't challenge them to a game untill their current game is over`
          );
        await msg.channel.send(theyAreAlreadyInAGameMSG);
      } else {
        playersinfo.players.push(user.value);
        playersinfo.ids.push(msg.guild.member(user.value).id);
      }
    }

    if (playersinfo.ids && playersinfo.ids.length === 0) {
      // checks if player 2 is mentioned
      await msg.reply("Tag another user use: <@user>");
      return;
    }
    // checks if your not vs yourself

    if (playersinfo.ids.includes(msg.author.id)) {
      const noTagSelf = new Discord.RichEmbed()
        .setColor("#F44336")
        .setTitle("Error")
        .setDescription("You cannot tag yourself!");

      await msg.channel.send(noTagSelf);

      return;
    } else {
      // console.log(playersinfo.ids);
      return playersinfo;
    }
  }
  // means that this function needs to be created in each child
  abstract GameLifeCicle(): Promise<void>;
}
