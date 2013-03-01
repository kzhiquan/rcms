/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 13-1-9
 * Time: 上午10:38
 * To change this template use File | Settings | File Templates.
 */




var mysql = require('../db');

// Reduce class
function Reduce(atta){
    this.custno = atta.custno;
    this.reduceid = atta.reduceid;
    this.reducestartdate = atta.reducestartdate;
    this.reduceenddate = atta.reduceenddate;
    this.joinreducemount = atta.joinreducemount;
    this.joinreducetype = atta.joinreducetype;
    this.enjoyreducemount = atta.enjoyreducemount;
    this.enjoyreducetype = atta.enjoyreducetype;
    this.latereducemount = atta.latereducemount;
    this.staffno = atta.staffno;
    this.departmentno = atta.departmentno;
    this.regdate = atta.regdate;
    this.updatedate = atta.updatedate;
    this.status = atta.status;
};


Reduce.prototype.set = function(atta){
    //this.custno = atta.custno;
    //this.reduceid = atta.reduceid;
    this.reducestartdate = atta.reducestartdate;
    this.reduceenddate = atta.reduceenddate;
    this.joinreducemount = atta.joinreducemount;
    this.joinreducetype = atta.joinreducetype;
    this.enjoyreducemount = atta.enjoyreducemount;
    this.enjoyreducetype = atta.enjoyreducetype;
    this.latereducemount = atta.latereducemount;
    this.staffno = atta.staffno;
    this.departmentno = atta.departmentno;
    this.regdate = atta.regdate;
    this.updatedate = atta.updatedate;
    this.status = atta.status;
};


// save an cust.
Reduce.prototype.save = function(callback){

    console.log(this);
    var sqlstr = 'insert into reduce(custno, reducestartdate, reduceenddate, joinreducemount, joinreducetype,' +
        'enjoyreducemount, enjoyreducetype, latereducemount, staffno, departmentno, regdate,' +
        'updatedate, status)values(';

    sqlstr = sqlstr + "'" + this.custno + "',";
    sqlstr = sqlstr + "'" + this.reducestartdate + "',";
    sqlstr = sqlstr + "'" + this.reduceenddate + "',";
    sqlstr = sqlstr + "'" + this.joinreducemount + "',";
    sqlstr = sqlstr + "'" + this.joinreducetype + "',";
    sqlstr = sqlstr + "'" + this.enjoyreducemount + "',";
    sqlstr = sqlstr + "'" + this.enjoyreducetype + "',";
    sqlstr = sqlstr + "'" + this.latereducemount + "',";
    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + this.departmentno + ",";
    sqlstr = sqlstr + 'NOW(),';
    sqlstr = sqlstr + 'NOW(),';
    sqlstr = sqlstr + "'" + this.status + "')";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        callback(err, rows);
    });
};


Reduce.prototype.getSaveSql = function(callback){
    var sqlstr = 'insert into reduce(custno, reducestartdate, reduceenddate, joinreducemount, joinreducetype,' +
        'enjoyreducemount, enjoyreducetype,' +
        'regdate, staffno, departmentno, updatedate)values(';

    sqlstr = sqlstr + "'" + this.custno + "',";
    sqlstr = sqlstr + "'" + this.cardname + "',";
    sqlstr = sqlstr + "'" + this.address + "',";
    sqlstr = sqlstr + "'" + this.telephone + "',";
    sqlstr = sqlstr + "'" + this.cablename + "',";
    sqlstr = sqlstr + "'" + this.cablecard + "',";
    sqlstr = sqlstr + "'" + this.cardtype + "',";
    sqlstr = sqlstr + "'" + this.cardno + "',";
    sqlstr = sqlstr + 'NOW(),';
    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + "'" + this.departmentno + "',";
    sqlstr = sqlstr + 'NOW())';

    callback(sqlstr);
};


// put an cust
Reduce.prototype.put = function(callback){
    var sqlstr = 'update reduce ';
    sqlstr += "set reduce.reducestartdate = '" + this.reducestartdate + "',";
    sqlstr += "reduce.reduceenddate = '" + this.reduceenddate + "',";
    sqlstr += "reduce.joinreducemount = '" + this.joinreducemount + "',";
    sqlstr += "reduce.joinreducetype = '" + this.joinreducetype + "',";
    sqlstr += "reduce.enjoyreducemount = '" + this.enjoyreducemount + "',";
    sqlstr += "reduce.latereducemount = '" + this.latereducemount + "',";
    sqlstr += "reduce.enjoyreducetype = '" + this.enjoyreducetype + "',";
    sqlstr += "reduce.staffno = '" + this.staffno + "',";
    sqlstr += "reduce.departmentno = '" + this.departmentno + "',";
    sqlstr += "reduce.status = '" + this.status + "',";
    //sqlstr += "reduce.status = '" + this.status + "',";
    sqlstr += "reduce.updatedate = NOW() "
    sqlstr += "where reduce.reduceid = '" + this.reduceid + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

Reduce.prototype.getUpdateSql = function(callback){
    var sqlstr = 'update reduce ';
    sqlstr += "set reduce.reducestartdate = '" + this.reducestartdate + "',";
    sqlstr += "reduce.reduceenddate = '" + this.reduceenddate + "',";
    sqlstr += "reduce.joinreducemount = '" + this.joinreducemount + "',";
    sqlstr += "reduce.joinreducetype = '" + this.joinreducetype + "',";
    sqlstr += "reduce.enjoyreducemount = '" + this.enjoyreducemount + "',";
    sqlstr += "reduce.enjoyreducetype = '" + this.enjoyreducetype + "',";
    sqlstr += "reduce.status = '" + this.status + "',";
    sqlstr += "reduce.updatedate = NOW() "
    sqlstr += "where reduce.custno = '" + this.custno + "'";

    callback(sqlstr);
};

//delete an cust
Reduce.prototype.delete = function(callback){
    var sqlstr = 'update reduce ';
    sqlstr += "set reduce.status = '" + "delete',";
    sqlstr += "reduce.staffno = '" + this.staffno + "',";
    sqlstr += "reduce.departmentno = '" + this.departmentno + "',";
    sqlstr += "reduce.updatedate = NOW() "
    sqlstr += "where reduce.reduceid = '" + this.reduceid + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

Reduce.prototype.getDeleteSql = function(callback){
    var sqlstr = 'delete from reduce where reduce.custno = ' + "'" + this.custno + "'";
    callback(sqlstr);
};

// get cust count
Reduce.getCount = function(condition, callback){
    var condition = condition || {};

    var where = "where reduce.custno like " + "'" + condition.custno + "' ";
    where +=' and reduce.status <> ' + "'delete'";

    var sqlstr = 'select count(*) as count from reduce ' + where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            callback(null, rows[0].count);
        }
    });
};


// get reduces
Reduce.getReduces = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};

    var where = "where reduce.custno =" + "'" + condition.custno + "' ";
    if(condition.joinreducetype){
        where += "and reduce.joinreducetype like " + "'%" + condition.joinreducetype + "%' ";
    }

    if(condition.enjoyreducetype){
        where += "and reduce.enjoyreducetype like " + "'%" + condition.enjoyreducetype + "%' ";
    }

    where += 'and reduce.staffno = staff.staffno ';
    where +=' and reduce.departmentno = department.departmentno ';
    where +=' and reduce.status <> ' + "'delete'";

    if( options.sortname == undefined ){
        options.sortname = 'reduceid';
    }
    if( options.sortorder == undefined ){
        options.sortorder = 'desc';
    }
    var sort = 'order by ' + options.sortname + ' ' + options.sortorder;

    if( options.page == undefined ){
        options.page = 1;
    }
    if( options.rp == undefined){
        options.rp = 10;
    }
    var start = ( (options.page-1) * options.rp );
    var limit = 'limit ' + start + ',' + options.rp;

    var sqlstr = 'select reduce.*, staff.name as staffno, department.name as departmentno from reduce, staff, department ' + where + ' ' + sort + ' ' + limit;
    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var reduces = [];
            for(var i in rows ){
                var reduce = new Reduce(rows[i]);
                reduces.push(reduce);
            }
            callback(null, reduces);
        }
    });
};



// get reduce
Reduce.get = function(reduceid, callback){

    var sqlstr = "select * from reduce where reduce.reduceid = " + "'"+ reduceid + "'";
    sqlstr +=' and reduce.status <> ' + "'delete'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            console.log(rows);
            var reduce = new Reduce(rows[0]);
            callback(err, reduce);
        }
    });
};



// is Reduce exist
Reduce.isExist = function(reduceid, callback){
    var sqlstr = 'select count(*) as count from reduce where reduce.reduceid = ' + "'"+reduceid+"'";
    sqlstr +=' and reduce.status <> ' + "'delete'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        if(err){
            callback(err, 0);
        }else{
            callback(err, rows[0].count);
        }
    });
}



exports = module.exports = Reduce;