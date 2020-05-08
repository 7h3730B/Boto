const fs = require("fs");
const {
    join
} = require("path");
const {
    getStringSync
} = require("./src/utils/language");

let markdown = "# Commands List\n --- \n";

// get all Commands and Categories
for (const categorie of fs.readdirSync(join(__dirname, "src/commands"))) {
    markdown += "## " + categorie.toUpperCase() + "\n";

    for (const cmd of fs.readdirSync(join(__dirname, "src/commands/" + categorie + "/"))) {
        if (!cmd.endsWith(".js")) return;
        markdown += "- [" + cmd.split('.')[0] + "](#" + cmd.split('.')[0] + ")\n";
    }
}

markdown += "\n# Command Details \n --- \n";

// Load Commands itsself
for (const categorie of fs.readdirSync(join(__dirname, "src/commands"))) {
    markdown += "## " + categorie.toUpperCase();

    for (const cmd of fs.readdirSync(join(__dirname, "src/commands/" + categorie + "/"))) {
        if (!cmd.endsWith(".js")) return;
        const cmdreq = require(join(__dirname, "src/commands/" + categorie + "/" + cmd));
        markdown += `\n\n### ${cmdreq.info.name}\n\n`;
        markdown += `> ${getStringSync("", cmdreq.info.description)}\n\n`;
        markdown += "| | |\n";
        markdown += "|---|---|\n";
        markdown += `| PermissionLevel | ${cmdreq.info.permission} |\n`;
        markdown += `| Categorie | ${categorie} |\n`;
        if (cmdreq.info.cooldown) markdown += `| Cooldown | ${cmdreq.info.cooldown} second(s) |\n`
        if (cmdreq.info.aliases) markdown += `| Aliases | ${cmdreq.info.aliases.join(", ")}\n`;
        if (cmdreq.info.nsfw) markdown += `| NSFW | ${cmdreq.info.nsfw} |\n`;
        if (cmdreq.info.dm) markdown += `| available in DMs | ${cmdreq.info.dm} |\n`;
        if (cmdreq.info.usage) {
            markdown += `\n**Usage:**   `;
            markdown += `\n${cmdreq.info.name + " " + getStringSync("", cmdreq.info.usage).split('<').join('\\<').split('\n').join('<br />' + cmdreq.info.name + ' ')}\n`;
        }
    }
    markdown += "---\n";
}

fs.writeFile(join(__dirname, "/docs/commands.md"), markdown, (err) => {
    if (err) return console.log("FAILED: to create wiki: " + err);
    console.log("successfully created wiki");
});