import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
import { GameCommandsOBJ } from '.';
import { IUserState, UserMD, Ilog } from '../Models/userState';

export class LogCommand extends DiscordCommand {

  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);

    // const helpMessage = new Discord.RichEmbed()
    // .setColor('#D3D3D3')
    // .setTitle('My Log');

    UserMD.findOne({ userID: message.author.id }).then(
      async (userData: IUserState) => {
        switch (this.args[0]) {
          case '-d':
            this.deleteLog(userData.log, userData.userID)
            break;
          case '-o':
            this.openLog(userData.log)
            break;
          default:
            this.myLogBrief(userData.log)
            break;
        }
      })

    // .then((messageSent: Discord.Message) => messageSent.delete(60000));
  }
async openLog(userDataLog: [Ilog]) {
    let selectedLog: string;
    if (this.args[1] !== undefined) selectedLog = this.args[1]
    if (userDataLog[parseInt(selectedLog, 10)] == undefined) return await this.msg.author.send('😶 Could not find a log with that id')
    const Msg = new Discord.RichEmbed()
    .setTitle('My Logs')
    .addField('TYPE', userDataLog[parseInt(selectedLog, 10)].type, true)
    .addField('DESCRIPTION', userDataLog[parseInt(selectedLog, 10)].des, true)
    .addBlankField(true)
    .addField('CASH CHANGE', userDataLog[parseInt(selectedLog, 10)].cashDif ? userDataLog[parseInt(selectedLog, 10)].cashDif: '', true)
    .setFooter(userDataLog[parseInt(selectedLog, 10)].time)
    this.msg.author.send(Msg)
  }
async deleteLog(userDataLog: [Ilog], userID: string) {
  let selectedLog: string;
  if (this.args[1] !== undefined) selectedLog = this.args[1]
  if (userDataLog[parseInt(selectedLog, 10)] == undefined) return await this.msg.author.send('😶 Could not find a log with that id')
  await UserMD.findOneAndUpdate({userID}, {
    '$pull': { log: userDataLog[parseInt(selectedLog, 10)]}
  }).then(s =>
    this.msg.author.send('👀 Deleted Log id: ' + selectedLog)
  )
}
  myLogBrief(userDataLog: [Ilog]) {
    const Msg = new Discord.RichEmbed()
      .setTitle('My Logs')
    let logIndex = 0
    userDataLog.forEach(log => {
      Msg
        .addField(`${logIndex}. TYPE`, log.type, true)
        .addField('DESCRIPTION', log.des.substr(0, 17), true)
        .addField('TIME', log.time.toString().substr(0, 25), true)
      ++logIndex
    });
    this.msg.author.send(Msg)
  }

}