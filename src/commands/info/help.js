const fs = require("fs");
const {
    prefix
} = require("../../../config.json");

module.exports.info = {
    name: "help",
    description: "cmds.info.help.description",
    usage: "cmds.info.help.usage",
    dm: true,
    args: false,
    nsfw: false,
    permission: 1,
    cooldown: 1,
}

module.exports.run = async (client, message, args) => {

    if (!args[0]) { // Shows all Categories and Commands than no argument is given
        let fields = [];
        let cmdscount = 0;
        let categoriescount = 0;

        for (const categorie of fs.readdirSync("./src/commands/")) {
            let cmds = [];

            for (const cmd of fs.readdirSync("./src/commands/" + categorie)) {
                if (!cmd.endsWith(".js")) return;
                cmds.push(
                    "- " + cmd.split('.')[0]
                );
                cmdscount += 1;
            }

            fields.push([
                categorie,
                cmds,
                true
            ]);
            categoriescount += 1;
        }
        return client.embeds.buildemb(await client.getString(message.guild, "cmds.info.help.all.title"), (await client.getString(message.guild, "cmds.info.help.all.description")).replace("${cmdscount}", cmdscount).replace("${categoriescount}", categoriescount), "", fields, "", "", true, "", message, client);
    } else {

        let command = client.commands.get(args[0].toLowerCase()); // Gets the Command by the name
        if (!command) command = await client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(args[0].toLowerCase())); // or by the aliases
        if (!command) {
            let categories = [];
            let fields = [];

            // Load all categories into an array
            for (const categorie of fs.readdirSync("./src/commands/")) {
                categories.push(categorie);
            }

            if (categories.includes(args[0].toLowerCase())) {
                let cmds = [];

                for (const cmd of fs.readdirSync("./src/commands/" + args[0].toLowerCase())) {
                    if (!cmd.endsWith(".js")) return;
                    const cmdreq = require("../" + args[0].toLowerCase() + "/" + cmd.split(".")[0]);
                    cmds.push(
                        "- " + cmd + " - " + await client.getString(message.guild, cmdreq.info.description)
                    );
                }

                fields.push([
                    args[0].toLowerCase(),
                    cmds,
                    true
                ]);

                return client.embeds.buildemb("", "", "", fields, "", "", true, "", message, client);

            } else {
                return client.embeds.error(client, await client.getString(message.guild, "cmds.info.help.categories.title"), (await client.getString(message.guild, "cmds.info.help.categories.description")).replace("${args[0]}", args[0].toLowerCase()), message);
            }

        } else {
            let fields = [];

            if (command.info.usage) {
                fields.push([
                    await client.getString(message.guild, "cmds.info.help.cmds.usage"),
                    prefix + command.info.name + " " + await client.getString(message.guild, command.info.usage),
                    false
                ]);
            }

            let hasArgs = "";
            if (command.info.args) hasArgs = await client.getString(message.guild, "cmds.info.help.cmds.yes");
            else hasArgs = await client.getString(message.guild, "cmds.info.help.cmds.no");

            fields.push([
                await client.getString(message.guild, "cmds.info.help.cmds.args"),
                hasArgs,
                false
            ]);

            if (command.info.aliases) {
                fields.push([
                    await client.getString(message.guild, "cmds.info.help.cmds.aliases"),
                    command.info.aliases.join(", "),
                    false
                ]);
            }

            let isDM = "";
            if (command.info.dm) isDM = await client.getString(message.guild, "cmds.info.help.cmds.yes");
            else isDM = await client.getString(message.guild, "cmds.info.help.cmds.no");

            fields.push([
                await client.getString(message.guild, "cmds.info.help.cmds.dm"),
                isDM,
                false
            ]);

            if (command.info.nsfw) {
                fields.push([
                    await client.getString(message.guild, "cmds.info.help.cmds.nsfw"),
                    await client.getString(message.guild, "cmds.info.help.cmds.yes"),
                    true
                ]);
            }

            fields.push([
                await client.getString(message.guild, "cmds.info.help.cmds.cooldown"),
                command.info.cooldown.toString() + " Sekunden",
                false
            ]);
            return client.embeds.buildemb(command.info.name + ":", await client.getString(message.guild, command.info.description), "", fields, "", "", true, "", message, client);
        }
        return;
    }
}