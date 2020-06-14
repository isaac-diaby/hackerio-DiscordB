import { Database } from "./Database";
import { DiscordBotRun } from "./discordBot";
import { ServerRun } from "./server";
// require('dotenv').config()

new Database();
new DiscordBotRun();

new ServerRun();
