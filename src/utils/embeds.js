const {
    MessageEmbed
} = require("discord.js");

const Colors = {
    success: "00C412",
    error: "CE0000",
    warn: "7a373b",
    buildemb: "FCFC07"
}

const buildemb = async (message, client, opts) => new MessageEmbed()
    .setTitle(opts.title || '')
    .setAuthor(opts.authorName || message.guild.me.nickname || client.user.username, opts.authorUrl || client.user.avatarURL({
        format: 'png',
        dynamic: true,
        size: 512
    }))
    .setDescription(opts.description || '')
    .setThumbnail(opts.thumbnail)
    .setColor(opts.color || Colors.buildemb)
    .attachFiles(opts.files || [])
    .addFields(opts.fields || [])
    .setImage(opts.image || '')
    .setURL(opts.url)
    .setTimestamp()
    .setFooter(opts.footerText || (await client.getString(message.guild, "embeds.buildemb.footertext")).replace("${username}", message.author.username), opts.footerUrl || message.author.avatarURL);

module.exports = {
    buildemb: buildemb,
    colors: Colors
}