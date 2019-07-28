
import { HelpCommand } from "./HelpCommand";
import { UserStatsCommand } from "./getUserStat";
import { BanksCommand } from "./banksCommand";
import { HackCommand } from "./hackCommand";
import { LogCommand } from "./logCommand";
import { learnCommand } from "./learnHackCommands";
import { OutCastCommand } from "./outcastCommand";

export interface CommandObj {
    execute: any;
    description: string;
    args?: Array<string>;
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
        execute: learnCommand,
        description: 'Read and Learn to become a better hacker. 😁 Did you think it was was going to be easy?',
        args: ['<page> = valid age number']
    },
    'banks': {
        execute: BanksCommand,
        description: 'Shows you the banks that you are able to interact with.',
        args: ['<mode> = ls | bank name']
    },
    'outcast': {
        execute: OutCastCommand,
        description: 'out cast players (OCP) disadvantages and how to get off the list ',
        args: ['<mode> = (-p = pay to get off the list)']
    },
}
