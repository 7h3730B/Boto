module.exports = async (client, message) => {

    // TODO: CommandHandler and predefiened embeds
    console.log(client.getString(message.guild, "commandhandler.error.nopermission").replace("${cmd}", "help").replace("${requiredlevel}", "3").replace("${userlevel}", "2"));
    
};