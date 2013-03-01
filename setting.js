
// configure file
//dbset
var  dbsetting = {
    host : 'localhost',
    user  : 'root',
    password : 'kzhiquan',
    database : 'RCMS'
};


/* configre log */
var log4js = require('log4js');


log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'rcms.log', category: 'rcms' }
    ],
    replaceConsole: true
});

var logger = log4js.getLogger('rcms');


//setting.
exports = module.exports = {
    dbset:dbsetting,
    log:logger
};