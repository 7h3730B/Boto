module.exports.info = {
    name: "ping",
    description: "cmds.developer.ping.description",
    dm: true,
    permission: 10,
}

module.exports.run = async (client, message, args) => {
    return message.channel.send(await client.emb.buildemb(message, client, {
        color: client.emb.colors.success,
        description: `Pong: ${Math.round(client.ws.ping)}ms`
    }));
}