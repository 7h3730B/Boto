// TODO: Integrate Guild Settings 
async function getString(guild, string) {
    
    let language = "de_de"; // de_de or en_us
    if (!guild) language = "en_us";
    const json = require("../languages/" + language + ".json");

    return json[string];
}

function getStringSync(guild, string) {
    
    let language = "de_de"; // de_de or en_us
    if (!guild) language = "en_us";
    const json = require("../languages/" + language + ".json");

    return json[string];
}

module.exports.getString = getString;
module.exports.getStringSync = getStringSync;