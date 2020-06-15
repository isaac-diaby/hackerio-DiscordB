require('dotenv').config()
import { Database } from "./Database";
import { DiscordBotRun } from "./discordBot";
import { ServerRun } from "./server";

new Database();
new DiscordBotRun();

new ServerRun();
// ©Isaac Diaby 2019