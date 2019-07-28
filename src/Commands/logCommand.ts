import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
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
            this.myLogBrief(userData.log, 1)
            break;
        }
      })

    // .then((messageSent: Discord.Message) => messageSent.delete(60000));
  }
  async openLog(userDataLog: [Ilog]) {
    let selectedLog: string;
    try {
      if (this.args[1] !== undefined) selectedLog = this.args[1]
      const selectedLogData = userDataLog[parseInt(selectedLog, 10)]

      const Msg = new Discord.RichEmbed()
        .setTitle('My Logs')
        .addField('TYPE', selectedLogData.type, true)
        .addField('DESCRIPTION', selectedLogData.des, true)
        .addBlankField(true)
        .addField('CASH CHANGE', selectedLogData.cashDif ? selectedLogData.cashDif : '0', true)
        .setFooter(selectedLogData.time)
      this.msg.author.send(Msg)
    } catch (err) {
      console.log(err)
      await this.msg.author.send('😶 Could not find a log with that id')
    }
  }
  async deleteLog(userDataLog: [Ilog], userID: string) {
    let selectedLog: string;
    if (this.args[1] !== undefined) selectedLog = this.args[1]
    if (selectedLog == 'all') return await UserMD.findOneAndUpdate({ userID }, {
      log: []
    }).then(s =>
      this.msg.author.send('👀 Deleted All Logs')
    );

    if (userDataLog[parseInt(selectedLog, 10)] == undefined) return await this.msg.author.send('😶 Could not find a log with that id')
    await UserMD.findOneAndUpdate({ userID }, {
      '$pull': { log: userDataLog[parseInt(selectedLog, 10)] }
    }).then(s =>
      this.msg.author.send('👀 Deleted Log id: ' + selectedLog)
    )
  }

  myLogBrief(userDataLog: [Ilog], page: number) {
    //@ts-ignore
    if (userDataLog.length == 0) return this.msg.author.send('Your Log Is Empty')
    //@ts-ignore
    this.msg.author.send(this.GetLogPage(page, userDataLog)).then((m: Discord.Message) => {
      m.react('👈').then(mr => {
        m.react('👉')
        const backWordsFilter = (r: Discord.MessageReaction, u: Discord.User) => r.emoji.name === '👈' && u.id === this.msg.author.id
        const forWordsFilter = (r: Discord.MessageReaction, u: Discord.User) => r.emoji.name === '👉' && u.id === this.msg.author.id

        const backWords = m.createReactionCollector(backWordsFilter, { time: 60000 })
        const forWords = m.createReactionCollector(forWordsFilter, { time: 60000 })

        backWords.on('collect', r => {
          if (page === 1) return
          page--
          m.edit(this.GetLogPage(page, userDataLog))
        })
        forWords.on('collect', r => {
          if (page === this.splitMyLogs(userDataLog).length) return
          page++
          m.edit(this.GetLogPage(page, userDataLog))
        })
      })
    })
  }

  splitMyLogs(logs: [Ilog]) {
    const splitBy = 5
    let newSplitArray = []
    for (let i = 0; i < logs.length; i += splitBy) {
      newSplitArray.push(logs.slice(i, i + splitBy))
    }
    return newSplitArray
  }

  GetLogPage(page: number, logs: [Ilog]) {
    const newSplitArrayFull = this.splitMyLogs(logs)
    const newSplitArraySelected = this.splitMyLogs(logs)[page - 1]
    // console.log(newSplitArray)
    const Msg = new Discord.RichEmbed()
      .setTitle('My Logs')
      .setFooter(`Page ${page} of ${newSplitArrayFull.length}`)
    let logIndex = (page - 1 != 0) ? ((page - 1) * 5) : 0
    newSplitArraySelected.forEach(log => {
      Msg
        .addField(`${logIndex}. TYPE`, log.type, true)
        .addField('DESCRIPTION', log.des.substr(0, 17), true)
        .addField('TIME', log.time.toString().substr(0, 25), true)
      ++logIndex
    });
    return Msg
  }

}