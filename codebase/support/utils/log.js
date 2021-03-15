const winston = require('winston');
const moment = require('moment');
const now = moment().format('YYYY-MM-DD_HH-mm-ss');
const { combine, timestamp, label, prettyPrint, printf, colorize } = winston.format;

const logLevels = {
    levels: {
        ERROR: 0,
        WARN: 1,
        FIXTURE: 2,
        TEST: 3,
        step: 4,
        method: 5
    },
    colors: {
        ERROR: 'red',
        WARN: 'magenta',
        FIXTURE: 'cyan',
        TEST: 'blue',
        step: 'yellow',
        method: 'gray'
    }
};

winston.addColors(logLevels.colors);

class CustomLogger {}

CustomLogger.myFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const colorized = combine(
    colorize({all: true}),
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    CustomLogger.myFormat
);

const monochrome = combine(
    // colorize({all: true}),
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    CustomLogger.myFormat
);

CustomLogger.logger = winston.createLogger({
    levels: logLevels.levels,
    // level: 'method',
    transports: [
        new winston.transports.File({
            filename: `reports/logs/winston-basic_${process.env.npm_config_thread}_${now}.log`,
            level: 'method',
            format: monochrome
        }),
        new winston.transports.Console({
            level: 'method',
            format: process.env.npm_config_monochrome === 'true' ? monochrome : colorized
        })
    ]
});

exports.CustomLogger = CustomLogger;
