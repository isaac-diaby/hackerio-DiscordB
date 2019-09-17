import { HelpCommand } from "./HelpCommand";
import { UserStatsCommand } from "./getUserStat";
import { BanksCommand } from "./banksCommand";
import { HackCommand } from "./hackCommand";
import { LogCommand } from "./logCommand";
import { LearnCommand } from "./learnHackCommands";
import { OutCastCommand } from "./outcastCommand";
import { EliteCommand } from "./eliteCommand";
import { Connect4 } from "./OnlineGames/connect4Game";
import { LeaveGameCommand } from "./leaveCommand";
import { DeleteCommand } from "./deleteCommand";
import { SuggestCommand } from "./suggestCommand";
import { AdministratorCommand } from "./adminCommand";
import { OptCommand } from "./opt-inCommand";

export interface CommandObj {
  execute: any;
  description: string;
  args?: Array<string>;
  eg?: Array<string>;
}

export const GameCommandsOBJ: { [key: string]: CommandObj } = {
  help: {
    execute: HelpCommand,
    description: "Prints out help.",
    args: ["[Command] = command"]
  },
  suggest: {
    execute: SuggestCommand,
    description: "Suggest new updates/improvements or report bugs",
    args: ["<Mode> = update or bug", "<suggestion = Your message >"]
  },
  stat: {
    execute: UserStatsCommand,
    description: "Displays the user's statistics."
  },
  log: {
    execute: LogCommand,
    description: "Displays the user's log",
    args: [
      "[Mode = -b]",
      "-b = brief of all logs",
      "-d = delete a log (all)",
      "-o = open full log"
    ]
  },
  opt: {
    execute: OptCommand,
    description: "Join or exit the news updates and events"
  },
  hack: {
    execute: HackCommand,
    description: "This is where all the hacking magic happens! 🎇",
    args: [
      "<Mode>",
      "-b = Target a bank = city | nation | government | pentagon | illuminati",
      "-u <method = ip>",
      "ip = A valid ip to hack ",
      "-r = Hack a random ip "
    ]
  },
  learn: {
    execute: LearnCommand,
    description:
      "Read and Learn to become a better hacker. 😁 Did you think it was was going to be easy?",
    args: [
      "[Page = 0 or command]",
      "number = Valid page number",
      "command = Script command to look up"
    ]
  },
  banks: {
    execute: BanksCommand,
    description: "Shows you the banks that you are able to interact with.",
    args: ["[Mode = ls]", "ls = List all availble banks"]
  },
  outcast: {
    execute: OutCastCommand,
    description:
      "Out cast players (OCP) disadvantages and how to get off the list ",
    args: ["[Mode]", "-p = Pay to get off the list"]
  },
  elite: {
    execute: EliteCommand,
    description: "Elite players (EP) advantages and how to get in the list⭐",
    args: ["[Mode]", "-j = Join the elite"]
  },
  connect4: {
    execute: Connect4,
    description: "Play Connect 4 with a friend",
    args: [
      "<@Mention>",
      "tag a player to play against",
      "[Channel = guild]",
      "guild | dm"
    ]
  },
  "!leave": {
    execute: LeaveGameCommand,
    description:
      "WARNING: R]0emoves yourself from the current game that you are in",
    args: ["[Mode = game]", "game = Leave the game that your currently in"]
  },
  "!delete": {
    execute: DeleteCommand,
    description: "WARNING: This Command Forever Deletes!",
    args: ["<Mode>", "account = Delete your account"]
  },
  "!admin": {
    execute: AdministratorCommand,
    description: "Administrators only"
  }
};
