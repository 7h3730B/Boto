const { owners } = require("../../config.json");

// TODO: make this function
async function changePermissionlvl(user, newlvl) {
    return null;
}

async function getPermissionlvl(user, guild) {
    if (owners.includes(user.id)) return 10;
    if (guild) if (user = guild.ownerID) return 9;
    if (false) return 8; // Could be used for things
    if (false) return 7; // Could be used for things
    if (false) return 6; // Could be used for things
    if (false) return 5; // Could be used for things
    if (false) return 4; // Could be used for things
    if (false) return 3; // Could be used for things like Admins
    if (false) return 2; // Could be used for things like Mods
    // TODO: Database request checks if banned from the bot completly or just on a guild
    if (true) return 1; // TODO: Can use the bot normaly
    if (false) return 0; // TODO: Can't use the bot
}

module.exports = {
    changePermissionlvl: changePermissionlvl,
    getPermissionlvl: getPermissionlvl
}