const {
    MessageEmbed
} = require("discord.js");

const Colors = {
    success: "00C412",
    error: "CE0000",
    warn: "FC07D7",
    buildemb: "FCFC07"
}

const buildemb = async (message, client, {
        opts
    }) => new MessageEmbed()
    .setTitle(opts.title)
    .setAuthor(opts.author.name, opts.author.url)
    .setDescription(opts.description || '')
    .setThumbnail(opts.thumbnail)
    .setColor(opts.color)
    .attachFiles(opts.files || [])
    .addFields(opts.fields || [])
    .setImage(opts.image || '')
    .setURL(opts.url)
    .setTimestamp()
    .setFooter(opts.footer || (await client.getString(client.guild, "embeds.buildemb.footertext")).replace("${username}", message.author.username), message.author.avatarURL);

module.exports = {
    buildemb: buildemb,
    colors: Colors
}