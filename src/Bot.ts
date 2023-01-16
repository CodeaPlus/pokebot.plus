import { Client } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

require("dotenv").config();

const token = "MTA2MzU4ODMzNzg5NTYxNjYyMg.G_L_-A.dYHgHWAfQV3V7cgq06pveDQVLyWzGyduXbdFe4";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(token);