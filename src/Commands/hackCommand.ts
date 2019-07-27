import * as Discord from 'discord.js';
import { DiscordCommand } from './DiscordCommand';
import { GameCommandsOBJ } from '.';
import { IUserState, UserMD, Ilog } from '../Models/userState';
import { BanksCommand, IbankMeta } from './banksCommand';

export interface Ieffects {
    winChanceAlt: number
}
export interface IhackingScripts {
    primaryCmd: string,
    description: string,
}
export class HackCommand extends DiscordCommand {

    // https://null-byte.wonderhowto.com/how-to/hack-like-pro-ultimate-command-cheat-sheet-for-metasploits-meterpreter-0149146/
    // https://null-byte.wonderhowto.com/how-to/hack-like-pro-ultimate-list-hacking-scripts-for-metasploits-meterpreter-0149339/
    static HACKER_SCRIPTS: Array<IhackingScripts[]> = [[
        { primaryCmd: 'background', description: 'moves the current session to the background' },
        { primaryCmd: 'bgkill', description: 'kills a background meterpreter script' },
        { primaryCmd: 'bglist', description: 'provides a list of all running background scripts' },
        { primaryCmd: 'bgrun', description: 'runs a script as a background thread' },
        { primaryCmd: 'channel', description: 'displays active channels' },
        { primaryCmd: 'close', description: 'closes a channel' },
        { primaryCmd: 'exit', description: 'terminates a meterpreter session' },
        { primaryCmd: 'exploit', description: 'executes the meterpreter script designated after it' },
        { primaryCmd: 'help', description: 'help menu' },
        { primaryCmd: 'interact', description: 'interacts with a channel' },
        { primaryCmd: 'irb', description: 'go into Ruby scripting mode' },
        { primaryCmd: 'migrate', description: 'moves the active process to a designated PID' },
        { primaryCmd: 'quit', description: 'terminates the meterpreter session' },
        { primaryCmd: 'read', description: 'reads the data from a channel' },
        { primaryCmd: 'use', description: 'loads a meterpreter extension' },
        { primaryCmd: 'write', description: 'writes data to a channel' },
        { primaryCmd: 'cat', description: 'read and output to stdout the contents of a file' },
        { primaryCmd: 'cd', description: 'change directory on the victim' },
        { primaryCmd: 'del', description: 'delete a file on the victim' },
        { primaryCmd: 'download', description: 'download a file from the victim system to the attacker system' },
        { primaryCmd: 'edit', description: 'edit a file with vim' },
        { primaryCmd: 'getlwd', description: 'print the local directory' },
        { primaryCmd: 'getwd', description: 'print working directory' },
        { primaryCmd: 'lcd', description: 'change local directory' },
        { primaryCmd: 'lpwd', description: 'print local directory' },
        { primaryCmd: 'ls', description: 'list files in current directory' },
        { primaryCmd: 'mkdir', description: 'make a directory on the victim system' },
        { primaryCmd: 'pwd', description: 'print working directory' },
        { primaryCmd: 'rm', description: 'delete (remove) a file' },
        { primaryCmd: 'rmdir', description: 'remove directory on the victim system' },
        { primaryCmd: 'upload', description: 'upload a file from the attacker system to the victim' },
        { primaryCmd: 'route', description: 'view or modify the victim routing table' },
        { primaryCmd: 'execute', description: 'executes a command' },
        { primaryCmd: 'getpid', description: 'gets the current process ID (PID)' },
        { primaryCmd: 'getuid', description: 'get the user that the server is running as' },
        { primaryCmd: 'kill', description: 'terminate the process designated by the PID' },
        { primaryCmd: 'ps', description: 'list running processes' },
        { primaryCmd: 'reboot', description: 'reboots the victim computer' },
        { primaryCmd: 'reg', description: 'interact with the victim\'s registry' },
        { primaryCmd: 'shell', description: 'opens a command shell on the victim machine' },
        { primaryCmd: 'shutdown', description: 'shuts down the victim\'s computer' },
        { primaryCmd: 'screenshot', description: 'grabs a screenshot of the meterpreter desktop' },

    ],
    [

        { primaryCmd: 'portfwd', description: 'forwards a port on the victim system to a remote service' },
        { primaryCmd: 'clearev', description: 'clears the event logs on the victim\'s computer' },
        { primaryCmd: 'drop_token', description: 'drops a stolen token' },
        { primaryCmd: 'ipconfig', description: 'displays network interfaces with key information including IP address, etc.' },
        { primaryCmd: 'getprivs', description: 'gets as many privileges as possible' },
        { primaryCmd: 'sysinfo', description: 'gets the details about the victim computer such as OS and name' },
        { primaryCmd: 'keyscan_dump', description: 'dumps the contents of the software keylogger' },
        { primaryCmd: 'keyscan_start', description: 'starts the software keylogger when associated with a process such as Word or browser' },
        { primaryCmd: 'keyscan_stop', description: 'stops the software keylogger' },
    ],
    [
        { primaryCmd: 'rev2self', description: 'calls RevertToSelf() on the victim machine' },
        { primaryCmd: 'steal_token', description: 'attempts to steal the token of a specified (PID) process' },
        { primaryCmd: 'enumdesktops', description: 'lists all accessible desktops' },
        { primaryCmd: 'getdesktop', description: 'get the current meterpreter desktop' },
        { primaryCmd: 'idletime', description: 'checks to see how long since the victim system has been idle' },
        { primaryCmd: 'set_desktop', description: 'changes the meterpreter desktop' },
        { primaryCmd: 'uictl', description: 'enables control of some of the user interface components' },
        { primaryCmd: 'getsystem', description: 'uses 15 built-in methods to gain sysadmin privileges' },
        { primaryCmd: 'hashdump', description: 'grabs the hashes in the password (SAM) file' },
        { primaryCmd: 'timestomp', description: 'manipulates the modify, access, and create attributes of a file' },
        { primaryCmd: 'arp_scanner.rb', description: 'Script for performing an ARP\'s Scan Discovery.' },
        { primaryCmd: 'autoroute.rb', description: 'Meterpreter session without having to background the current session.' },
        { primaryCmd: 'checkvm.rb', description: 'Script for detecting if target host is a virtual machine.' },
        { primaryCmd: 'credcollect.rb', description: 'Script to harvest credentials found on the host and store them in the database.' },
        { primaryCmd: 'domain_list_gen.rb', description: 'Script for extracting domain admin account list for use.' },
        { primaryCmd: 'dumplinks.rb', description: 'Dumplinks parses .lnk files from a user\'s recent documents folder and Microsoft Office\'s Recent documents folder, if present. The .lnk files contain time stamps, file locations, including share names, volume serial #s and more. This info may help you target additional systems.' },
        { primaryCmd: 'duplicate.rb', description: 'Uses a meterpreter session to spawn a new meterpreter session in a different process. A new process allows the session to take "risky" actions that might get the process killed by A/V, giving a meterpreter session to another controller, or start a keylogger on another process.' },
        { primaryCmd: 'enum_chrome.rb', description: 'Script to extract data from a chrome installation.' },
        { primaryCmd: 'enum_firefox.rb', description: 'Script for extracting data from Firefox. enum_logged_on_users.rb - Script for enumerating current logged users and users that have logged in to the system.' },
        { primaryCmd: 'enum_powershell_env.rb', description: 'Enumerates PowerShell and WSH configurations.' },
        { primaryCmd: 'enum_putty.rb', description: 'Enumerates Putty connections.' },
        { primaryCmd: 'enum_shares.rb', description: 'Script for Enumerating shares offered and history of mounted shares.' },
        { primaryCmd: 'enum_vmware.rb', description: 'Enumerates VMware configurations for VMware products.' },
        { primaryCmd: 'event_manager.rb', description: 'Show information about Event Logs on the target system and their configuration.' },
        { primaryCmd: 'file_collector.rb', description: 'Script for searching and downloading files that match a specific pattern.' },
        { primaryCmd: 'get_application_list.rb', description: 'Script for extracting a list of installed applications and their version.' },
        { primaryCmd: 'getcountermeasure.rb', description: 'Script for detecting AV, HIPS, Third Party Firewalls, DEP Configuration and Windows Firewall configuration. Provides also the option to kill the processes of detected products and disable the built-in firewall.' },
        { primaryCmd: 'get_env.rb', description: 'Script for extracting a list of all System and User environment variables.' },
        { primaryCmd: 'getfilezillacreds.rb', description: 'Script for extracting servers and credentials from Filezilla.' },
        { primaryCmd: 'getgui.rb', description: 'Script to enable Windows RDP.' },
        { primaryCmd: 'get_local_subnets.rb', description: 'Get a list of local subnets based on the host\'s routes.' },
        { primaryCmd: 'get_pidgen_creds.rb', description: 'Script for extracting configured services with username and passwords.' },
        { primaryCmd: 'gettelnet.rb', description: 'Checks to see whether telnet is installed.' },
        { primaryCmd: 'get_valid_community.rb', description: 'Gets a valid community string from SNMP.' },
        { primaryCmd: 'getvncpw.rb', description: 'Gets the VNC password.' },
        { primaryCmd: 'hashdump.rb', description: 'Grabs password hashes from the SAM.' },
        { primaryCmd: 'hostedit.rb', description: 'Script for adding entries in to the Windows Hosts file.' },
        { primaryCmd: 'keylogrecorder.rb', description: 'Script for running keylogger and saving all the keystrokes.' },
        { primaryCmd: 'killav.rb', description: 'Terminates nearly every antivirus software on victim.' },
        { primaryCmd: 'metsvc.rb', description: 'Delete one meterpreter service and start another.' },
        { primaryCmd: 'migrate -', description: 'the meterpreter service to another process.' },
        { primaryCmd: 'multicommand.rb', description: 'Script for running multiple commands on Windows 2003, Windows Vistaand Windows XP and Windows 2008 targets.' },
        { primaryCmd: 'multi_console_command.rb', description: 'Script for running multiple console commands on a meterpreter session.' },
        { primaryCmd: 'multi_meter_inject.rb', description: 'Script for injecting a reverce tcp Meterpreter Payload into memory of multiple PIDs, if none is provided a notepad process will be created and a Meterpreter Payload will be injected in to each.' },
        { primaryCmd: 'multiscript.rb', description: 'Script for running multiple scripts on a Meterpreter session.' },
        { primaryCmd: 'netenum.rb', description: 'Script for ping sweeps on Windows 2003, Windows Vista, Windows 2008 and Windows XP targets using native Windows commands.' },
        { primaryCmd: 'packetrecorder.rb', description: 'Script for capturing packets in to a PCAP file.' },
        { primaryCmd: 'panda2007pavsrv51.rb', description: 'This module exploits a privilege escalation vulnerability in Panda Antivirus 2007. Due to insecure permission issues, a local attacker can gain elevated privileges.' },
        { primaryCmd: 'persistence.rb', description: 'Script for creating a persistent backdoor on a target host.' },
        { primaryCmd: 'pml_driver_config.rb', description: 'Exploits a privilege escalation vulnerability in Hewlett-Packard\'s PML Driver HPZ12. Due to an insecure SERVICE_CHANGE_CONFIG DACL permission, a local attacker can gain elevated privileges.' },
        { primaryCmd: 'powerdump.rb', description: 'Meterpreter script for utilizing purely PowerShell to extract username and password hashes through registry keys. This script requires you to be running as system in order to work properly. This has currently been tested on Server 2008 and Windows 7, which installs PowerShell by default.' },
        { primaryCmd: 'prefetchtool.rb', description: 'Script for extracting information from windows prefetch folder.' },
        { primaryCmd: 'process_memdump.rb', description: 'Script is based on the paper Neurosurgery With Meterpreter.' },
        { primaryCmd: 'remotewinenum.rb', description: 'This script will enumerate windows hosts in the target environment given a username and password or using the credential under which Meterpeter is running using WMI wmic windows native tool.' },
        { primaryCmd: 'scheduleme.rb', description: 'Script for automating the most common scheduling tasks during a pentest. This script works with Windows XP, Windows 2003, Windows Vista and Windows 2008.' },
        { primaryCmd: 'schelevator.rb', description: 'Exploit for Windows Vista/7/2008 Task Scheduler 2.0 Privilege Escalation. This script exploits the Task Scheduler 2.0 XML 0day exploited by Stuxnet.' },
        { primaryCmd: 'schtasksabuse.rb', description: 'Meterpreter script for abusing the scheduler service in Windows by scheduling and running a list of command against one or more targets. Using schtasks command to run them as system. This script works with Windows XP, Windows 2003, Windows Vista and Windows 2008.' },
        { primaryCmd: 'scraper.rb', description: 'The goal of this script is to obtain system information from a victim through an existing Meterpreter session.' },
        { primaryCmd: 'screenspy.rb', description: 'This script will open an interactive view of remote hosts. You will need Firefox installed on your machine.' },
        { primaryCmd: 'screen_unlock.rb', description: 'Script to unlock a windows screen. Needs system privileges to run and known signatures for the target system.' },
        { primaryCmd: 'screen_dwld.rb', description: 'Script that recursively search and download files matching a given pattern.' },
        { primaryCmd: 'service_manager.rb', description: 'Script for managing Windows services.' },
        { primaryCmd: 'service_permissions_escalate.rb', description: 'script attempts to create a service, then searches through a list of existing services to look for insecure file or configuration permissions that will let it replace the executable with a payload. It will then attempt to restart the replaced service to run the payload. If that fails, the next time the service is started (such as on reboot) the attacker will gain elevated privileges.' },
        { primaryCmd: 'sound_recorder.rb', description: 'Script for recording in intervals the sound capture by a target host microphone.' },
        { primaryCmd: 'srt_webdrive_priv.rb', description: 'Exploits a privilege escalation vulnerability in South River Technologies WebDrive.' },
        { primaryCmd: 'uploadexec.rb', description: 'Script to upload executable file to host.' },
        { primaryCmd: 'virtualbox_sysenter_dos -', description: 'to DoS Virtual Box.' },
        { primaryCmd: 'virusscan_bypass.rb', description: 'Script that kills Mcafee VirusScan Enterprise v8.7.0i+ processes.' },
        { primaryCmd: 'vnc.rb', description: 'Meterpreter script for obtaining a quick VNC session.' },
        { primaryCmd: 'webcam.rb', description: 'Script to enable and capture images from the host webcam.' },
        { primaryCmd: 'win32-sshclient.rb', description: 'Script to deploy & run the "plink" commandline ssh-client. Supports only MS-Windows-2k/XP/Vista Hosts.' },
        { primaryCmd: 'win32-sshserver.rb', description: 'Script to deploy and run OpenSSH on the target machine.' },
        { primaryCmd: 'winbf.rb', description: 'Function for checking the password policy of current system. This policy may resemble the policy of other servers in the target environment.' },
        { primaryCmd: 'winenum.rb', description: 'Enumerates Windows system including environment variables, network interfaces, routing, user accounts, etc' },
        { primaryCmd: 'wmic.rb', description: 'Script for running WMIC commands on Windows 2003, Windows Vista and Windows XP and Windows 2008 targets.' },
    ]]
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
                    case '-b':
                        this.hackBankInit(userData)
                        break;
                    case '-u':
                        this.hackUserInit(userData)
                        break;
                    default:
                        message.author.send('hack (-b | -u)')
                        break;
                }
            })

    }
    hackUserInit(userData: IUserState) {
        throw new Error("Method not implemented.");
    }
    async hackBankInit(userData: IUserState) {
        let selectedBankName: string
        if (this.args[1]) selectedBankName = this.args[1]
        const availableBanksOnly: IbankMeta[] = BanksCommand.BANKS_META.filter(bank => bank.minPlayerLevel <= userData.level.current)
        // console.log(availableBanksOnly)
        while ((['quit', ...(availableBanksOnly.length > 0) ? availableBanksOnly.map(banks => banks.name) : ''].includes(selectedBankName) == false)) {
            if (availableBanksOnly.length == 0) {
                selectedBankName = 'quit'
            } else {
                let Msg = new Discord.RichEmbed()
                    .setTitle('Please Select A Bank Via Name')
                    .addField('Bank Names', [...availableBanksOnly.map(banks => banks.name)], true)
                    .addField('Required Level', [...availableBanksOnly.map(banks => banks.minPlayerLevel)], true)
                    .addField('Required Money', [...availableBanksOnly.map(banks => banks.hackPrice)], true)
                    .setFooter(' type quit to stop')
                const userMessage: Discord.Message = await this.msg.author.send(Msg) as Discord.Message
                await userMessage.channel.awaitMessages((m: Discord.Message) => ['quit', ...availableBanksOnly.map(banks => banks.name)].includes(m.content) || m.author.id == this.msg.author.id,
                    { max: 1, time: 15000 }
                ).then(c => selectedBankName = c.first().content)
                    .catch(e => console.log(e))
            }
        }
        if (selectedBankName === 'quit') {
            if (availableBanksOnly.length == 0) await this.msg.author.send("You need to be at least level 5 to interact with Banks")
            return
        }
        // user Selected a bank
        const selectedBank: IbankMeta[] = BanksCommand.BANKS_META.filter(bank => bank.name == selectedBankName)
        if (await this.hackBankConfirmationStage(selectedBank[0], userData)) this.hackBank(selectedBank[0], userData)
    }
    /**
     * 
     * @param userID 
     * @param isInHack 
     * @param hackID 
     */
    async UpdateUserHackingStatus(userID: string, isInHack: boolean, hackID: string = null) {
        await UserMD.findOneAndUpdate({ userID }, {
            inHack: {
                hackID,
                isInHack,
                lastHack: Date.now(),
            },
        }).exec()
    }
    async hackBank(bankDetails: IbankMeta, userData: IUserState) {
        await this.UpdateUserHackingStatus(userData.userID, true)
        // standard maths to find out how link you are to win 
        let myWinChance
        if (userData.level.current > bankDetails.bankLevel) {
            myWinChance = (100 - Math.round((bankDetails.bankLevel / userData.level.current / 0.02)))
        } else {
            myWinChance = Math.round((userData.level.current / bankDetails.bankLevel / 0.02))
        }
        // new win rate with users buffs/ debuffs
        const listedEffected = this.effectsOnUser(userData)
        myWinChance += listedEffected.winChanceAlt
        //Dont Round the final!
        const commandExecutionBonus = await this.hackTypingPercentage(bankDetails.bankLevel, userData.level.current)
        myWinChance = myWinChance * commandExecutionBonus

        const won = this.didIwinLuckDraw(myWinChance)
        await this.hackBankResults(won, commandExecutionBonus, listedEffected, bankDetails, userData)
    }
    /**
     * 
     * @param won if the player won the hack
     * @param CEB commands executed % for extra money
     * @param listedEffected boosts the profit
     * @param bankDetails 
     * @param userData 
     */
    async hackBankResults(won: boolean, CEB: number, listedEffected: Ieffects, bankDetails: IbankMeta, userData: IUserState) {
        const bankOffering = Math.round(bankDetails.hackPrice * CEB + (bankDetails.hackPrice * (listedEffected.winChanceAlt / 100)))
        let myFinalMoney: number
        let myFinalXp: number
        if (won) {
            myFinalMoney = userData.money + bankOffering
            myFinalXp += bankOffering
        } else {
            myFinalMoney = userData.money - bankOffering
            myFinalXp +=  Math.round(bankOffering/2)
        }
        const Msg = new Discord.RichEmbed()
            .setAuthor(`Hacking ${bankDetails.name} Bank`)
            .setTitle(`You ${(won) ? 'Successfully Won' : 'Unfortunately Lost'} The Hack!`)
            .setColor(`${(won) ? '#60BE82' : '#F44336'} `)
            .addField('Stake', bankOffering)
            .addField('My Account Funds', myFinalMoney)
        await this.UpdateUserHackingStatus(userData.userID, false)
        await this.AfterHackProfit(
            userData.userID,
            myFinalMoney,
            myFinalXp,
            {
                type: won ? 'TOOK': 'LOST',
                time: Date.now(),
                des: `You ${(won) ? 'Successfully Won' : 'Unfortunately Lost'} The Hack!`,
                cashDif: bankOffering
            })
        await this.msg.author.send(Msg)
    }
/**
 * 
 * @param userID 
 * @param money 
 * @param log 
 */
    async AfterHackProfit(userID: string, money: number,myFinalXp:number, log: Ilog) {

        await UserMD.findOneAndUpdate({ userID }, {
            'level.xp': myFinalXp,
            money,
            $push: { log }
        }).exec()
    }

    /**
     * 
     * @param enemyLevel 
     * @param myLevel 
     */
    async hackTypingPercentage(enemyLevel: number, myLevel: number) {
        const additionalRounds = ((enemyLevel > myLevel) && (enemyLevel - myLevel) > 9) ? Math.ceil((enemyLevel - myLevel) * 0.1) : 0
        const rounds = 5 + additionalRounds
        let difficulty;
        if (enemyLevel > 133) {
            difficulty = 3
        } else if (enemyLevel > 66) {
            difficulty = 2
        } else {
            difficulty = 1
        }
        let CorrentAnswers = 0
        let questionMsg: Discord.Message = await this.msg.author.send('Starting Hacking Session') as Discord.Message
        for (let i = 1; i <= rounds; i++) {
            const randomDifficulty = Math.floor(Math.random() * difficulty)
            const randomQuestionIndex = Math.floor(Math.random() * HackCommand.HACKER_SCRIPTS[randomDifficulty].length)
            const Msg = new Discord.RichEmbed()
                .setColor('#551A8B')
                .setTitle(`Commands left ${i}/${rounds}`)
                .setDescription('Type the command that does the following.')
                .addField('Correct', CorrentAnswers)
                .addField('What Command Does this:', HackCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex].description)
                .setFooter('If You dont know the answer just send an guest to skip')
            await questionMsg.edit(Msg)
            await questionMsg.channel.awaitMessages(
                (m: Discord.Message) => m.author.id == this.msg.author.id, //m.content == HackCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex].primaryCmd && 
                { max: 1, time: 20000 }
            ).then(c => CorrentAnswers += (c.first().content == HackCommand.HACKER_SCRIPTS[randomDifficulty][randomQuestionIndex].primaryCmd) ? 1 : 0)
                .catch(c => { })
        }
        const percentage = Math.round((CorrentAnswers / rounds) * 100) / 100
        questionMsg.delete(60000)
        return (0.1 + percentage)
    }
    didIwinLuckDraw(WinChance: number) {
        const winningPercentage = Math.floor(Math.random() * 100)
        // console.log(winningPercentage)
        return winningPercentage <= WinChance
    }
    /**
     * Conformation stage of hacking a bank. make it clear how much the player is risking by hacking this bank
     */
    async hackBankConfirmationStage(bankDetails: IbankMeta, userData: IUserState) {
        // let continueToHack = false

        if (userData.money < bankDetails.hackPrice) {
            await this.msg.author.send(`You need to at least have ${bankDetails.hackPrice} crypo's in your account`)
            return
        }
        let Msg = new Discord.RichEmbed()
            .setTitle(`Hacking ${bankDetails.name} Bank`)
            .setDescription('Are you sure you want to continue with this action?')
            .setColor('#F44336')
            .addField('Required Level', bankDetails.minPlayerLevel, true)
            .addField('My Level', userData.level.current, true)
            .addField('Required Money To Cover Your loses', bankDetails.hackPrice * 2)
            .addBlankField()
            .addField('Note Risk', [
                'You need to have at least half the required money!',
                'If you fail your hack the bank, you will be fined (90 - 100%)',
                'If you dont have enough money to pay the fine your IP will be marked as outcast!'])
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
            })
            .catch((e: any) => {
                console.log('ERROR: listening to players accept/reject reaction');
                console.log(e);
                return false
            })
            .finally(() => sentConfMSG.delete());
    }

    /**
     *  the penalties or buffs that need to be applies to the user's hacks
     * @param userData 
     */
    effectsOnUser(userData: IUserState): Ieffects {
        let effectsAlt: Ieffects = { winChanceAlt: 0 }
        if (userData.playerStat.elite) effectsAlt.winChanceAlt = Math.abs(Math.ceil((userData.level.current * 0.075)))
        if (userData.playerStat.outcast) effectsAlt.winChanceAlt -= Math.abs(Math.ceil((userData.level.current * 0.075)))
        // console.log(effectsAlt)
        return effectsAlt

    }
}