

var setting = require('./setting.js').dbset;

var _mysql = require('mysql');

//an connection to mysql
var mysql = _mysql.createConnection({
    host : setting.host,
    user : setting.user,
    password : setting.password
});


// select database;
mysql.query('use ' + setting.database);



// the module export out an connection.
exports = module.exports = mysql;


