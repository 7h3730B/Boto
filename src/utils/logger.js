const winston = require("winston");
const {
    debug,
    debugDiscord
} = require("../../config.json");

const myCustomLevels = {
    levels: {
        zero: 0,
        error: 2,
        warn: 3,
        info: 4,
        debug: 5,
        debugDiscord: 6
    },
    colors: {
        zero: 'white',
        error: 'red',
        warn: 'magenta',
        info: 'green',
        debug: 'blue',
        debugDiscord: 'yellow'
    }
};

class Log {
    constructor() {
        this._logger = winston.createLogger({
            levels: myCustomLevels.levels,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                    level: 'debug' // TODO: Only shows my Debug messages in Console TODO: What I need
                }),
                new winston.transports.File({
                    filename: 'logs/' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.log',
                    level: 'debugDiscord' // TODO: all messages including Discord.js in File TODO: What I need
                }),
            ],
            format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
        });
        winston.addColors(myCustomLevels.colors);
    }

    async info(message) {
        this._logger.log('info', message);
    }

    async debugDiscord(message) {
        if (debugDiscord) this._logger.log('debugDiscord', message);
    }

    async debug(message) {
        if (debug) this._logger.log('debug', message);
    }

    async warn(message) {
        this._logger.log('warn', message);
    }

    async error(message) {
        this._logger.log('error', message);
    }
}

module.exports = Log;