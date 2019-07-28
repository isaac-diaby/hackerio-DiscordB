import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
import { IUserState, UserMD, Ilog } from '../Models/userState';

export class OutCastCommand extends DiscordCommand {
    acceptEmoji = `🔵`
    rejectEmoji = `🔴`

    constructor(
        client: Discord.Client,
        message: Discord.Message,
        cmdArguments: Array<string>
    ) {
        super(client, message, cmdArguments);
        UserMD.findOne({ userID: message.author.id }).then(
            (userData: IUserState) => {

                switch (this.args[0]) {
                    case '-p':
                        if (userData.playerStat.outcast) return this.outcastPay(userData)
                        this.msg.author.send('You are not an out cast! no need to pay out')
                        return
                    default:

                        const Msg = new Discord.RichEmbed()
                            .setColor('#A9A9A9')
                            .setTitle('Outcasted players (OCP)')
                            .setDescription('These players are easy targets!')
                            .addField('Hacking A OCP', ['- When hacking an OCP gives you (the hacker) an advantage of OCP (level*0.072) =  just over 13%+ success rate.',
                                '- You are able to steal more of an OCP\'s money. Only 40% of the OCP is protected against hackers (instead of 60%).'])
                            .addField('Hacking As A OCP', 'Disadvantage of (level*0.072) =  just over 13%- success rate')
                            .setFooter(`To get off the outcast list type ${process.env.BOT_PREFIX}outcast -p`)
                        this.msg.author.send(Msg)
                        return
                }

            })

    }

    async outcastPay(userData: IUserState) {
        const cost: number = userData.level.current * 1000
        if (userData.money < cost) return this.msg.author.send(`You need at least ${cost} crypo's in your account to buy out the Out Cast list🙄`)
        if (!(await this.outcastPayConfirmationStage(cost, userData))) return

        UserMD.findOneAndUpdate({ userID: userData.userID }, {
            'playerStat.outcast': false,
            'level.xp': Math.round(userData.level.xp + cost),
            money: userData.money - cost
        }).then(d => this.msg.author.send('🤗 You are off the Out Cast list, be more careful next time!')).catch(e => console.log(e))

    }

    async outcastPayConfirmationStage(cost: number, userData: IUserState) {
        let Msg = new Discord.RichEmbed()
            .setTitle('Paying Out Of Out Cast List')
            .setDescription('Are you sure you want to continue with this action?')
            .setColor('#F44336')
            .addField('Cost', cost, true)
            .addField('Crypo\'s After Transaction', userData.money - cost, true)
            .addBlankField()
            .addField('Description', [
                'After this you will final be able to win more! and loose less when being hacked. i think its worth it!'
            ])
            .setFooter('please read the conditions before selecting')

        let sentConfMSG = (await this.msg.author.send(
            Msg
        )) as Discord.Message;
        // waits for the reactions to be added
        await Promise.all([
            sentConfMSG.react(this.acceptEmoji),
            sentConfMSG.react(this.rejectEmoji),
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
                    return
                } else {
                    return true
                }
            }
            ).finally(() => sentConfMSG.delete());
    }

}