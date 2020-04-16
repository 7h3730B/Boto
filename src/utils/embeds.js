const {
    MessageEmbed
} = require("discord.js");

const Colors = {
    success: "00C412",
    error: "CE0000",
    warn: "FC07D7",
    buildemb: "FCFC07"
}

module.exports.success = async (client, channel, title, msg, message) => {
    return channel.send(new MessageEmbed()
        .setTitle(title || "")
        .setDescription(msg)
        .setColor(Colors.success)
        .setTimestamp()
        .setFooter((await client.getString(client.guild, "embeds.success.footertext")).replace("${username}", message.author.username), message.author.avatarURL));
}

module.exports.error = async (client, channel, title, msg) => {
    return channel.send(new MessageEmbed()
        .setTitle(title || "")
        .setDescription(msg)
        .setColor(Colors.error)
        .setTimestamp()
        .setFooter(await client.getString(client.guild, "embeds.error.footertext")));
}

module.exports.warn = async (client, channel, title, msg, message) => {
    return channel.send(new MessageEmbed()
        .setTitle(title || "")
        .setDescription(msg)
        .setColor(Colors.warn)
        .setTimestamp()
        .setFooter((await client.getString(client.guild, "embeds.warn.footertext")).replace("${username}", message.author.username), message.author.avatarURL));
}

module.exports.buildemb = async (title, description, color, fields, footer, image, timestamp, thumbnail, message, client) => {
    let embed = new MessageEmbed()
        .setTitle(title || "")
        .setDescription(description || "")
        .setColor(color || Colors.buildemb)
        .setFooter(footer || (await client.getString(client.guild, "embeds.buildemb.footertext")).replace("${username}", message.author.username), message.author.avatarURL)
        .setImage(image || "")
        .setThumbnail(thumbnail || "");

    if (timestamp) embed.setTimestamp();

    if (fields && (typeof fields !== "undefined" || fields !== [])) {
        fields.forEach((field) => {
            embed.addField(field[0], field[1], field[2]);
        });
    }

    return message.channel.send(embed);
}