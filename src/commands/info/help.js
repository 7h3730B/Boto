const fs = require("fs");

module.exports.info = {
    name: "help",
    description: "cmds.info.help.description",
    usage: "cmds.info.help.description",
    dm: true,
    args: false,
    cooldown: 5,
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
                cmds.push(cmd.split('.')[0]);
                cmdscount += 1;
            }

            fields.push([
                categorie,
                "- " + cmds + "\n",
                true
            ]);
            categoriescount += 1;
        }
        return client.embeds.buildemb(await client.getString(message.guild, "cmds.info.help.all.title"), (await client.getString(message.guild, "cmds.info.help.all.description")).replace("${cmdscount}", cmdscount).replace("${categoriescount}", categoriescount), "", fields, "", "", true, "", message, client);
    } else {
        return;
    }
}