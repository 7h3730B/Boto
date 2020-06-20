module.exports = async (client) => {

    // TODO: Channel logging
    client.log.info("---------------Ready---------------");
    client.log.info("Logged in with: " + client.user.username);
    client.log.info("Currently on: " + client.guilds.cache.size + " Server");
    client.log.info("-----------------------------------");
};