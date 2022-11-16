const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: './logs/warn.log', level: 'warn' }),
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
  ],
});

const loggerE = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({ level: 'error' }), new winston.transports.File({ filename: './logs/error.log', level: 'error' })],
});
module.exports = { logger, loggerE };
