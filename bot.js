import fs from "fs";
import path from "node:path";
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import getBuyCost from "./endpoints/SalePriceHistory.js";

dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content:
        "There was an error while executing this command!. Please cross-check address/slug and try again",
      ephemeral: true,
    });
  }
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  
  // Call the getBuyCost function here or wherever you need to use it
  const buyCost = await getBuyCost();
  console.log(JSON.stringify(buyCost));
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);