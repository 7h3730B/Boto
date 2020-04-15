const {
    Client,
    Collection
} = require("discord.js");
const fs = require("fs");
const {
    join
} = require("path");
const Logger = require("./src/utils/logger");
const config = require("./config");

const client = new Client({
    disabledEvents: ["TYPING_START"]
});

client.log = new Logger();
client.commands = new Collection();

// Load Commands
client.log.info("---------Loading Commands----------");
for (const folders of fs.readdirSync(join(__dirname, "src/commands"))) {
    client.log.debug("--- Loading category: " + folders + " ---");
    for (const files of fs.readdirSync(join(__dirname, "src/commands/" + folders))) {
        client.log.debug("- Loading " + files);
    }
    client.log.debug("--- Finished category: " + folders + " ---");
}
client.log.info("---------Finished Commands---------\n");

// Load Events
client.log.info("----------Loading Events-----------");
for (const files of fs.readdirSync(join(__dirname, "src/events"))) {
    client.log.debug("--- Registering event: " + files + " ---");
    const event = require(join(__dirname, "src/events/" + files));
    client.on(files.split('.')[0], event.bind(null, client));
}
client.log.info("----------Finished Events----------\n");

client.on('info', e => client.log.info(e));
client.on('debug', e => client.log.debugDiscord(e));
client.on('warn', e => client.log.warn(e));
client.on('error', e => client.log.error(e));
process.on('uncaughtException', error => client.log.error(error));

client.login(config.token);