// TODO: Integrate Guild Settings 
async function getString(guild, string) {
    
    const language = "de_de"; // de_de or en_us
    const json = require("../languages/" + language + ".json");

    return json[string];
}

module.exports.getString = getString;