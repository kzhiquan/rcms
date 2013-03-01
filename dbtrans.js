/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 12-12-11
 * Time: 下午4:05
 * To change this template use File | Settings | File Templates.
 */


var setting = require('./setting.js').dbset;
var _mysql = require('mysql');
var queues = require('mysql-queues');

//an connection to mysql
var mysqltrans = _mysql.createConnection({
    host : setting.host,
    user : setting.user,
    password : setting.password
});


const DEBUT = true;
queues(mysqltrans, DEBUT);


// select database;
mysqltrans.query('use ' + setting.database);


// the module export out an connection.
exports = module.exports = mysqltrans;
