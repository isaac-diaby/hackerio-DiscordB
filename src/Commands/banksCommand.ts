import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
import { GameCommandsOBJ } from '.';
import { IUserState, UserMD } from '../Models/userState';

export interface IbankMeta {
    name: string, bankLevel: number, minPlayerLevel: number, hackPrice: number
}
export class BanksCommand extends DiscordCommand {
    static BANKS_META: Array<IbankMeta> = [
        { name: 'city', bankLevel: 10, minPlayerLevel: 5, hackPrice: 10000 },
        { name: 'nation', bankLevel: 26, minPlayerLevel: 13, hackPrice: 25000 },
        { name: 'government', bankLevel: 67, minPlayerLevel: 33, hackPrice: 80000 },
        { name: 'pentagon', bankLevel: 164, minPlayerLevel: 82, hackPrice: 250000 },
        { name: 'illuminati', bankLevel: 400, minPlayerLevel: 200, hackPrice: 750000 },
    ]
    constructor(
        client: Discord.Client,
        message: Discord.Message,
        cmdArguments: Array<string>
    ) {
        super(client, message, cmdArguments);
        UserMD.findOne({ userID: message.author.id }).then(
            (userData: IUserState) => {
                switch (this.args[0]) {
                    case 'ls':
                        this.listAvailableBanks(userData)
                        break;
                    default:
                        this.listAvailableBanks(userData)
                        break;
                }


            })

    }
    listAvailableBanks(userData: IUserState) {
        let Msg = new Discord.RichEmbed()
        if (userData.level.current < 5) {
            Msg
                .setDescription('You need to be at least level 5 to interact with banks')
                .setColor('#F44336')
        } else {
            Msg
                .setColor('#60BE82')
        }
        Msg
            .setTitle('Hacking Banks Are Very Rewarding, However, Also Comes With A Risk and a Cost.')
            .addField('Bank Names', [...BanksCommand.BANKS_META.map(banks => banks.name)], true)
            .addField('Required Level', [...BanksCommand.BANKS_META.map(banks => banks.minPlayerLevel)], true)
            .addField('Required Money', [...BanksCommand.BANKS_META.map(banks => banks.hackPrice)], true)
            .addBlankField()
            .addField('How To Hack A Bank?', 'hack -b <Optional Bank (Name | Number)>')
            .setFooter('Remember to hack a bank you need to be around the same level as the bank. You also need enough money to cover your lose.')
        this.msg.author.send(Msg)
    }
}