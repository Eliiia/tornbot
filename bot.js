const fs = require("fs");
const path = require("path");   
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const { config } = require("dotenv");

const checks = require("./checks.js");

// Dotenv config
config();

// Client setup
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

// Login
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready as ${readyClient.user.tag}!`);
});

// Command registration
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) { // loop through folders
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) { // loop through files file
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("info" in command && "cmd" in command)
            client.commands.set(command.info.name, command);
        else
            console.log(`WARNING The command at ${filePath} is missing data`);
    }
}

// Command handling
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command file matching ${interaction.commandName} was found!`);
        return;
    }

    try {
        await command.cmd(interaction)
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred)
            await interaction.followUp({ content: "There was an error executing this command!", ephemeral: true });
        else
            await interaction.reply({ content: "There was an error executing this command!", ephemeral: true })
    }
})

checks.start();

// Login
client.login(process.env.DISCORD_TOKEN);