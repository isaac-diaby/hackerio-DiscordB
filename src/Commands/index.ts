
import { HelpCommand } from "./HelpCommand";
import { UserStatsCommand } from "./getUserStat";
import { BanksCommand } from "./banksCommand";
import { HackCommand } from "./hackCommand";
import { LogCommand } from "./logCommand";
import { LearnCommand } from "./learnHackCommands";
import { OutCastCommand } from "./outcastCommand";
import { EliteCommand } from "./eliteCommand";

export interface CommandObj {
    execute: any;
    description: string;
    args?: Array<string>;
    eg?: Array<string>;
}

export const GameCommandsOBJ: { [key: string]: CommandObj } = {
    'help': {
        execute: HelpCommand,
        description: 'Prints out help.',
        args: ['<command> = command']
    },
    'stat': {
        execute: UserStatsCommand,
        description: 'Displays the user\'s statistics.'
    },
    'log': {
        execute: LogCommand,
        description: 'Displays the user\'s log',
        args: ['<mode> = (-b = brief) | ( -d = delete) | ( -o = open )']
    },
    'hack': {
        execute: HackCommand,
        description: 'This is where all the hacking magic happens! 🎇',
        args: ['mode = -b | -u', '-b <bank> = city | nation | government | pentagon | illuminati', '-u <ip> = ip | ( -r = random ) ']
    },
    'learn': {
        execute: LearnCommand,
        description: 'Read and Learn to become a better hacker. 😁 Did you think it was was going to be easy?',
        args: ['<page | command> = valid page number or a script command']
    },
    'banks': {
        execute: BanksCommand,
        description: 'Shows you the banks that you are able to interact with.',
        args: ['<mode> = ls | bank name']
    },
    'outcast': {
        execute: OutCastCommand,
        description: 'Out cast players (OCP) disadvantages and how to get off the list ',
        args: ['<mode> = (-p = pay to get off the list)']
    },
    'elite': {
        execute: EliteCommand,
        description: 'Elite players (EP) advantages and how to get in the list⭐',
        args: ['<mode> = (-j = steps to get become an elite)']
    },
}
