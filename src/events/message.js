const {
    prefix
} = require("../../config.json");
const {
    Collection
} = require("discord.js");

module.exports = async (client, message) => {

    if (message.author.username == client.user.username) return; // Check if the bot wrote the message

    // TODO: Get prefix from database
    if (!message.content.startsWith(prefix) || message.author.bot) return; // Checks if the message starts with the Prefix or the author is a bot

    const args = message.content.slice(prefix.length).split(/ +/); // usage regex to split by every space
    const commandName = args.shift().toLowerCase();

    let command = client.commands.get(commandName); // Gets the Command by the name

    if (!command) command = await client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName)); // or by the aliases

    if (!command) return;

    if (!command.info.dm && message.channel.type !== 'text') {
        return client.embeds.error(client, message.channel, "", await client.getString(message.guild, "commandhandler.error.dm"));
    }

    if (command.info.permission > await client.permshandl.getPermissionlvl(message.author, message.guild)) {
        return client.embeds.error(client, message.channel, "", (await client.getString(message.guild, "commandhandler.error.nopermission")).replace("${cmd}", command.info.name).replace("${requiredlevel}", command.info.permission).replace("${userlevel}", await client.permshandl.getPermissionlvl(message.author, message.guild)));
    }

    if (command.info.args && !args.length) {
        let desc = await client.getString(message.guild, "commandhandler.error.args");

        if (command.info.usage) desc += (await client.getString(message.guild, "commandhandler.error.usage")).replace("${usage}", await client.getString(message.guild, command.info.usage)).replace("${prefix}", prefix).replace("${command}", commandName);

        return client.embeds.error(client, message.channel, "", desc);
    }

    if (command.info.nsfw && !message.channel.nsfw) {
        return client.embeds.error(client, message.channel, "", (await client.getString(message.guild, "commandhandler.error.notnsfw")).replace("${cmd}", command.info.name))
    }

    if (!client.cooldowns.has(command.info.name)) {
        client.cooldowns.set(command.info.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.info.name);
    const cooldownAmount = (command.info.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return client.embeds.warn(client, message.channel, "", (await client.getString(message.guild, "commandhandler.warn.cooldown")).replace("${timeleft}", timeLeft.toFixed(1)).replace("${cmdname}", command.info.name), message)
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.run(client, message, args);
    } catch (e) {
        client.log.error("Failed to execute a Command: " + e);
        client.embeds.error(client, message.channel, await client.getString(message.guild, "commandhandler.error.failedtitle"), await client.getString(message.guild, "commandhandler.error.failed"));
    }
};