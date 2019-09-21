import { HelpCommand } from "./guide/HelpCommand";
import { UserStatsCommand } from "./account/getUserStat";
import { BanksCommand } from "./guide/banksCommand";
import { HackCommand } from "./hacking/hackCommand";
import { LogCommand } from "./account/logCommand";
import { LearnCommand } from "./guide/learnHackCommands";
import { OutCastCommand } from "./account/outcastCommand";
import { EliteCommand } from "./account/eliteCommand";
import { Connect4 } from "./OnlineGames/connect4Game";
import { LeaveGameCommand } from "./account/leaveCommand";
import { DeleteCommand } from "./account/deleteCommand";
import { SuggestCommand } from "./admin/suggestCommand";
import { AdministratorCommand } from "./admin/adminCommand";
import { OptCommand } from "./account/opt-inCommand";
import { DailyRewardCommand } from "./daily/dailyRewardCommand";

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
  daily: {
    execute: DailyRewardCommand,
    description: "Daily reward"
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
