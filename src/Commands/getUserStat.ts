import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";
import { IUserState, UserMD } from "../Models/userState";
import { DiscordBotRun } from "../discordBot";

export class UserStatsCommand extends DiscordCommand {
  userData: IUserState;
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);

    UserMD.findOne({ userID: message.author.id })
      .then((userData: IUserState) => {
        let Msg = new Discord.RichEmbed();
        if (userData) {
          const currentLevelData = [...DiscordBotRun.LevelSystemXp].filter(
            stage => stage.level === userData.level.current
          );
          Msg.setColor("#60BE82")
            .setAuthor(`My IP: ${userData.ip}  (Dont share this with anyone!)`)
            .setTitle("User statistics")
            .addField("Level", `${userData.level.current}`, true)
            .addField(
              "Xp",
              `${userData.level.xp}/${currentLevelData[0].xp} ${
                userData.level.xp >= currentLevelData[0].xp
                  ? `run ${process.env.BOT_PREFIX}levelup`
                  : ""
              }`,
              true
            )
            .addField("Crypto", `${userData.crypto}`)
            .addField("Elite", `${userData.playerStat.elite}`, true);
          // add a field that allows Elite users see when thier status expires
          if (userData.playerStat.elite)
            Msg.addField(
              "Elite Expiry Date",
              userData.playerStat.eliteExpireDate.toString().substr(0, 25),
              true
            )
              .addField("Outcast", `${userData.playerStat.outcast}`, true)
              .addField(
                `Logs`,
                userData.log.length > 0
                  ? `${userData.log.length} in Log`
                  : "EMPTY",
                true
              )

              .addField(
                `Last Hacked`,
                userData.inHack.lastHack != null
                  ? userData.inHack.lastHack.toString().substr(0, 25)
                  : null,
                true
              )
              .setFooter(
                `Joined ${userData.playerStat.joinedDate
                  .toString()
                  .substr(0, 25)}`
              );
        }
        this.sendMsgViaDm(Msg);
      })
      .catch(e => {
        console.log(e);
        let Msg = new Discord.RichEmbed()
          .setColor("#F44336")
          .setDescription("No user Found in DB");
        this.sendMsgViaDm(Msg);
      });
  }
}
