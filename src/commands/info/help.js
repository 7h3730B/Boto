const fs = require("fs");
const {
    prefix
} = require("../../../config.json");

module.exports.info = {
    name: "help",
    description: "cmds.info.help.description",
    usage: "cmds.info.help.usage",
    dm: true,
    permission: 1
}

let fields = [];
let cmdcount = 0;
let categories = [];

module.exports.run = async (client, message, args) => {

    // TODO: Rework
    if (!args[0]) { // Shows all Categories and Commands than no argument is given
        // TODO: add links to embed.
        if (!fields) await this.init();
        message.channel.send(await client.emb.buildemb(message, client, {
            title: await client.getString(message.guild, "cmds.info.help.all.title"),
            description: (await client.getString(message.guild, "cmds.info.help.all.description")).replace("${cmdscount}", cmdcount).replace("${categoriescount}", fields.length),
            fields: fields
        }));
    } else {

        let command = client.cmds.get(args[0].toLowerCase()); // Gets the Command by the name
        if (!command) command = await client.cmds.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(args[0].toLowerCase())); // or by the aliases
        if (!command) {
            let fields = [];

            const cat = categories.find(obj => obj.cat == args[0].toLowerCase());
            if (!cat) return client.emb.buildemb(message, client, {
                title: await client.getString(message.guild, "cmds.info.help.categories.title"),
                color: client.emb.colors.error,
                description: (await client.getString(message.guild, "cmds.info.help.categories.description")).replace("${args[0]}", args[0].toLowerCase()),
                fields: fields
            });
            let cmds = [];

            for (let j = 0; j < cat.cmds.length; j++) {
                cmds.push(
                    "- " + cat.cmds[j].info.name + " ~~ " + await client.getString(message.guild, cat.cmds[j].info.description)
                );
            }

            fields.push({
                name: cat.cat,
                value: cmds,
                inline: false
            });

            return message.channel.send(await client.emb.buildemb(message, client, {
                title: args[0],
                fields: fields
            }));
        } else {
            let fields = [];
            const yes = await client.getString(message.guild, "cmds.info.help.cmds.yes");
            const no = await client.getString(message.guild, "cmds.info.help.cmds.no");

            if (command.info.usage) {
                fields.push({
                    name: await client.getString(message.guild, "cmds.info.help.cmds.usage"),
                    value: prefix + command.info.name + " " + await client.getString(message.guild, command.info.usage),
                    inline: true
                });
            }

            fields.push({
                name: await client.getString(message.guild, "cmds.info.help.cmds.args"),
                value: command.info.args ? yes : no,
                inline: true
            });

            if (command.info.aliases) {
                fields.push({
                    name: await client.getString(message.guild, "cmds.info.help.cmds.aliases"),
                    value: command.info.aliases.join(", "),
                    inline: true
                });
            }

            fields.push({
                name: await client.getString(message.guild, "cmds.info.help.cmds.dm"),
                value: command.info.dm ? yes : no,
                inline: true
            });

            fields.push({
                name: await client.getString(message.guild, "cmds.info.help.cmds.nsfw"),
                value: command.info.nsfw ? yes : no,
                inline: true
            });

            fields.push({
                name: await client.getString(message.guild, "cmds.info.help.cmds.cooldown"),
                value: (command.info.cooldown || "3") + " s",
                inline: true
            });

            return message.channel.send(await client.emb.buildemb(message, client, {
                title: command.info.name + ":",
                description: await client.getString(message.guild, command.info.description),
                fields: fields
            }));
        }
    }
}

module.exports.init = async () => {
    for (const categorie of fs.readdirSync("./src/commands/")) {
        let cmds = [];

        for (const cmd of fs.readdirSync("./src/commands/" + categorie)) {
            if (!cmd.endsWith(".js")) return;
            cmds.push(
                "- " + cmd.split('.')[0]
            );
            cmdcount++;
        }

        fields.push({
            name: categorie,
            value: cmds,
            inline: true
        });
    }
    // Load all categories into an array
    for (const categorie of fs.readdirSync("./src/commands/")) {
        let cmds = [];

        for (const cmd of fs.readdirSync("./src/commands/" + categorie)) {
            if (!cmd.endsWith(".js")) return;
            const cmdreq = require("../" + categorie + "/" + cmd.split(".")[0]);
            cmds.push(cmdreq);
        }

        categories.push({
            cat: categorie,
            cmds: cmds
        });
    }
}