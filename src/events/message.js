const {
    prefix
} = require("../../config.json");
const {
    Collection
} = require("discord.js");

module.exports = async (client, message) => {

    if (message.author.username == client.user.username || message.author.bot) return; // Check if the bot wrote the message || the author of the message is a bot

    // TODO: Get prefix from database
    if (!message.content.startsWith(prefix)) return; // Checks if the message starts with the Prefix

    const args = [];
    let str = message.content.trim();

    while (str.length) { // allow spaces when surrounded with " or ' and to have as many spaces between arguments
        let arg;
        if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
            arg = str.slice(1, str.indexOf('"', 1));
            str.slice(str.indexOf('"', 1) + 1);
        } else if (str.startsWith("'") && str.indexOf("'", 1) > 0) {
            arg = str.slice(1, str.indexOf("'", 1));
            str.slice(str.indexOf("'", 1) + 1);
        } else {
            arg = str.split(/\s+/g)[0]; // check for spaces with regex
            str = str.slice(arg.length);
        }
        args.push(arg.trim());
        str = str.trim();
    }

    console.log(args);

    // const commandName = args.shift().toLowerCase();

    // let command = client.commands.get(commandName); // Gets the Command by the name

    // if (!command) command = await client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName)); // or by the aliases

    // if (!command) return;

    // if (!command.info.dm && message.channel.type !== 'text') {
    //     return client.embeds.error(client, "", await client.getString(message.guild, "commandhandler.error.dm"), message);
    // }

    // if (command.info.permission > await client.permshandl.getPermissionlvl(message.author, message.guild)) {
    //     return client.embeds.error(client, "", (await client.getString(message.guild, "commandhandler.error.nopermission")).replace("${cmd}", command.info.name).replace("${requiredlevel}", command.info.permission).replace("${userlevel}", await client.permshandl.getPermissionlvl(message.author, message.guild)), message);
    // }

    // if (command.info.args && !args.length) {
    //     let desc = await client.getString(message.guild, "commandhandler.error.args");

    //     if (command.info.usage) desc += (await client.getString(message.guild, "commandhandler.error.usage")).replace("${usage}", await client.getString(message.guild, command.info.usage)).replace("${prefix}", prefix).replace("${command}", commandName);

    //     return client.embeds.error(client, "", desc, message);
    // }

    // if (command.info.nsfw && !message.channel.nsfw) {
    //     return client.embeds.error(client, "", (await client.getString(message.guild, "commandhandler.error.notnsfw")).replace("${cmd}", command.info.name), message)
    // }

    // if (!client.cooldowns.has(command.info.name)) {
    //     client.cooldowns.set(command.info.name, new Collection());
    // }
    // F
    // const now = Date.now();
    // const timestamps = client.cooldowns.get(command.info.name);
    // const cooldownAmount = (command.info.cooldown || 3) * 1000;

    // if (timestamps.has(message.author.id)) {
    //     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    //     if (now < expirationTime) {
    //         const timeLeft = (expirationTime - now) / 1000;
    //         return client.embeds.warn(client, "", (await client.getString(message.guild, "commandhandler.warn.cooldown")).replace("${timeleft}", timeLeft.toFixed(1)).replace("${cmdname}", command.info.name), message)
    //     }
    // }

    // timestamps.set(message.author.id, now);
    // setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // try {
    //     command.run(client, message, args);
    // } catch (e) {
    //     client.log.error("Failed to execute a Command: " + e);
    //     client.embeds.error(client, await client.getString(message.guild, "commandhandler.error.failedtitle"), await client.getString(message.guild, "commandhandler.error.failed"), message);
    // }
};