const { createLogger, transports } = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, metadata, json, errors } = format;
const pkginfo = require('./package.json');

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: pkginfo.name }),
    errors({ stack: true }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    metadata(),
    json()
  ),
  transports: [ new transports.Console() ]
});

exports.logger = logger;