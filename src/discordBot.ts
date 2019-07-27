import * as Discord from 'discord.js';
import { GameCommandsOBJ } from './Commands';
import { UserMD, IUserState } from './Models/userState';



export class DiscordBotRun {
    mainGuildData = {
        id: '566982444822036500',
        channels: {
            claimedPerksLog: {
                channel: '588462707594887185'
            },
            dblVotesLog: {
                channel: '600027239190495236'
            }
        }
    };

    port: number = 5000;
    botClient: Discord.Client;
    dbl: any;
    CURRENTLY_ONLINE: Set<string> =  new Set()
    // Get the leveling up Xp
    static LevelSystemXp: Set<{level:number, xp: number|string}> = new Set([...(function* getXp(){
        var xp = 0
            for (let level = 1; level <= 199; level++)
        {
          xp += Math.floor(level + 3 * Math.pow(2, level / 7.));
          yield {level, xp}
        }
        yield {level: 200, xp: 'MAX'}
    })()
    ])

    constructor() {
        this.botClient = new Discord.Client();
        this.botClient.login(process.env.BOT_AUTHTOKEN);
        this.botClient.on('ready', () => {
            this.botClient.user.setActivity('Hackers | ~>help', { type: "WATCHING" });
            console.log(`${this.botClient.user.username} is online`);
            this.botOnlineListen();
            // console.log(this.LevelSystemXp)
        });
    }


    async botOnlineListen() {
        this.botClient.on('message', receivedMessage => {

            if (!receivedMessage.content.startsWith(process.env.BOT_PREFIX)) return
            // Prevent bot from responding to its own messages and other bots
            if (receivedMessage.author === this.botClient.user || receivedMessage.author.bot) return;

            if (this.getChannelType(receivedMessage) === 'dm') {
                // DM commands
            };

            // Must be online to play
            if (receivedMessage.author.presence.status !== 'online') {
                receivedMessage.author.send('Set your appearance to Online in order to play')
                return
            }
            // check if users info is in the DB else create it
            UserMD.findOne({ userID: receivedMessage.author.id }).then(
                (userData: IUserState) => {
                    if (!userData) {
                        this.createNewUserProfile(
                            receivedMessage.author,
                            receivedMessage.channel
                        )
                        return
                    }
                    if (!userData.online) this.setUserToOnline({ userID: receivedMessage.author.id, status: true })
                    // checks if the user still active every 10 minutes
                    if (!this.CURRENTLY_ONLINE.has(receivedMessage.author.id)) {
                        this.CURRENTLY_ONLINE.add(receivedMessage.author.id)
                        const StatusUpdate = setInterval(() => {
                            if (receivedMessage.author.presence.status !== 'online') {
                                this.setUserToOnline({ userID: receivedMessage.author.id, status: false })
                                this.CURRENTLY_ONLINE.delete(receivedMessage.author.id)
                                clearInterval(StatusUpdate);
                            }
                            this.checkIfUserLeveledUp(userData)
                        }, 
                        600000
                        )
                    }

                    // Parse the text to a command format 
                    let commands = receivedMessage.content
                        .toLowerCase()
                        .substr(process.env.BOT_PREFIX.length)
                        .split(' ');
                    let primaryCmd = commands[0];
                    let argsCmd = commands.slice(1);

                    // try execute the command
                    let gameCommandClass = GameCommandsOBJ[primaryCmd];
                    if (!gameCommandClass) {
                        this.noCommandsFound({ Msg: receivedMessage, triedCmd: primaryCmd });
                    } else if (gameCommandClass.execute !== undefined) {
                        new gameCommandClass.execute(
                            this.botClient,
                            receivedMessage,
                            argsCmd
                        );
                    }
                }).catch(e => console.log(e))
        }
        )
    }
    // Set user to online/offline in DB
    setUserToOnline({ userID, status }: { userID: string; status: boolean; }) {
        UserMD.findOneAndUpdate({ userID }, { $set: { online: status } }).exec().catch(e => console.log(e))
    }
    // tells the user that there is no command with that primary command
    noCommandsFound({ Msg, triedCmd }: { Msg: Discord.Message; triedCmd: string; }) {
        const primaryCmdErrorMSG = new Discord.RichEmbed()
            .setColor('#F44336')
            .setDescription(`${Msg.author}`)
            .addField('Error:', `The command "${triedCmd}" does not exist!`);
        // Msg.channel.send(primaryCmdErrorMSG);
    }
    getChannelType(message: Discord.Message) {
        return message.channel.type
    }
    async checkIfUserLeveledUp(userData: IUserState) {
        await UserMD.findOne({ userID: userData.userID }).then(
            async (userData: IUserState) => {
                const currentLevelData = [...DiscordBotRun.LevelSystemXp].filter(stage => stage.level == userData.level.current) 
                // console.log(currentLevelData)
                if (currentLevelData) {
                    if (userData.level.xp >= currentLevelData[0].xp && (currentLevelData[0].xp)) {
                        const newLevel = ++userData.level.current
                        const newXP = userData.level.xp - <number>currentLevelData[0].xp
                        await UserMD.findOneAndUpdate({ userID: userData.userID }, {
                            level: {
                                xp: newXP,
                                current: newLevel
                            }
                        }).exec()
            
                    }
                }

            })
    }
    async createNewUserProfile(
        userDiscordInfo: Discord.User,
        discordChannel: Discord.TextChannel
            | Discord.DMChannel
            | Discord.GroupDMChannel,
    ) {

        const newUser = new UserMD({
            userID: userDiscordInfo.id
        });
        newUser
            .save()
            .then(data => {
                // new user created success message
                const successfulNewAccountMSG = new Discord.RichEmbed()
                    .setColor('#60BE82')
                    .setAuthor(`${userDiscordInfo.tag}`)
                    .setTitle('New Profile Created!')
                    .setDescription(
                        'I see that this is your first time type ~>help'
                    )
                    // .addField('discordbots.org', '')
                    .addField(
                        'Join The Official Serverr',
                        'http://bit.ly/CGBofficialServer'
                    )
                    .setFooter(
                        'For more features and exclusive bonuses become a Donater!: http://bit.ly/CGBdonate'
                    );
                discordChannel.send(successfulNewAccountMSG);
            })
            .catch(e => {
                // new user created fail message
                const FailedNewUserMSG = new Discord.RichEmbed()
                    .setTitle('New User Error!')
                    .setColor('#F44336')
                    .setAuthor(`${userDiscordInfo.tag}`)
                    .setDescription(
                        `There was an error creating ${userDiscordInfo} account on the server`
                    );
                discordChannel.send(FailedNewUserMSG);
                console.log(e);
            })
    }
}