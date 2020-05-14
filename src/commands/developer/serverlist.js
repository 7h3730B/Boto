module.exports.info = {
    name: "serverlist",
    description: "cmds.developer.serverlist.description",
    dm: true,
    permission: 10,
}

const compare = (a, b) => {
    if (a.position > b.position) return -1;
    if (a.position < b.position) return 1;
    return 0;
}

module.exports.run = async (client, message, args) => {
    return message.channel.send(await client.emb.buildemb(message, client, {
        color: client.emb.colors.success,
        title: client.guilds.cache.size.toString(),
        description: client.guilds.cache.sort(compare).map(server => `\`${server.name}\``).join("\n")
    })); 
}