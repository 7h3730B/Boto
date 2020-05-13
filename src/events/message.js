const {
    prefix,
    owners
} = require("../../config.json");
const {
    Collection
} = require("discord.js");

module.exports = async (client, message) => {

    if (message.author.username == client.user.username || message.author.bot) return; // Check if the bot wrote the message || the author of the message is a bot

    // TODO: Get prefix from database
    if (!message.content.startsWith(prefix)) return; // Checks if the message starts with the Prefix

    const content = message.content.slice(prefix.length);
    const cmdName = content.split(/ +/)[0];

    let cmd = client.cmds.get(cmdName);

    if (!cmd) cmd = await client.cmds.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(cmdName));

    if (!cmd) return; // Couldnt be found

    // Check if command can't be executed in dms && if the channel is a dm
    if (!cmd.info.dm && message.channel.type !== 'text') return message.channel.send(await client.emb.buildemb(message, client, {
        color: client.emb.colors.error,
        description: await client.getString(message.guild, "commandhandler.error.dm"),
    }));

    // Checks if the required Permissionlevel for the Command > than the Permissionlevel of the Author
    let userPerm = await client.permshandler.getPermissionlvl(message.author, message.guild);
    if (cmd.info.permission > userPerm) return message.channel.send(await client.emb.buildemb(message, client, {
        color: client.emb.colors.error,
        description: (await client.getString(message.guild, "commandhandler.error.nopermission")).replace("${cmd}", cmd.info.name).replace("${requiredlevel}", cmd.info.permission).replace("${userlevel}", userPerm)
    }));

    // Checks if the command needs a nsfw channel && the channel isn't a nsfw channel
    if (cmd.info.nsfw && !message.channel.nsfw) return message.channel.send(await client.emb.buildemb(message, client, {
        color: client.emb.colors.error,
        description: (await client.getString(message.guild, "commandhandler.error.notnsfw")).replace("${cmd}", cmd.info.name)
    }));

    // Split all Arguments
    const args = [];
    let str = content.slice(cmdName.length).trim();

    for (let i = 0; 0 < str.length; i++) { // allow spaces when surrounded with " or '
        let arg;
        if (str.startsWith('"') && str.indexOf('"', 1) > 0) {
            arg = str.slice(1, str.indexOf('"', 1));
            str = str.slice(str.indexOf('"', 1) + 1);
        } else if (str.startsWith("'") && str.indexOf("'", 1) > 0) {
            arg = str.slice(1, str.indexOf("'", 1));
            str = str.slice(str.indexOf("'", 1) + 1);
        } else {
            arg = str.split(/\s+/g)[0]; // check for spaces with regex
            str = str.slice(arg.length);
        }
        args.push(arg.trim());
        str = str.trim();
    }

    // Checks if the command needs any arguments && no argument is given
    if (cmd.info.args && !args.length) {
        let desc = await client.getString(message.guild, "commandhandler.error.args");

        if (cmd.info.usage) desc += (await client.getString(message.guild, "commandhandler.error.usage")).replace("${usage}", await client.getString(message.guild, cmd.info.usage)).replace("${prefix}", prefix).replace("${command}", cmdName);

        return message.channel.send(await client.emb.buildemb(message, client, {
            color: client.emb.colors.warn,
            description: desc
        }));
    }

    if (!client.cooldowns.has(cmd.info.name)) client.cooldowns.set(cmd.info.name, new Collection());

    const now = Date.now();
    const timestamps = client.cooldowns.get(cmd.info.name);
    const cooldownAmount = (cmd.info.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id) && !owners.includes(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(await client.emb.buildemb(message, client, {
                color: client.emb.colors.warn,
                description: (await client.getString(message.guild, "commandhandler.warn.cooldown")).replace("${timeleft}", timeLeft.toFixed(1)).replace("${cmdname}", cmd.info.name)
            }));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        cmd.run(client, message, args);
    } catch (e) {
        client.log.error("Failed to execute a Command: " + e);
        message.channel.send(await client.emb.buildemb(message, client, {
            color: client.emb.colors.error,
            title: await client.getString(message.guild, "commandhandler.error.failedtitle"),
            description: await client.getString(message.guild, "commandhandler.error.failed")
        }));
    }
};