





var mysql = require('../db');

// Cust class
function Stat(atta){
    this.regdate = atta.regdate;
    this.cardname = atta.cardname;
    this.cardtype = atta.cardtype;
    this.cardno = atta.cardno;
    this.custno = atta.custno;
    this.cablename = atta.cablename;
    this.telephone = atta.telephone;
    this.address = atta.address;
    this.icid = atta.icid;
    this.stdid = atta.stdid;
    this.remark = atta.remark;


    this.reducestartdate = atta.reducestartdate;
    this.reduceenddate = atta.reduceenddate;
    this.joinreducemount = atta.joinreducemount;
    this.joinreducetype = atta.joinreducetype;
    this.enjoyreducemount = atta.enjoyreducemount;
    this.enjoyreducetype = atta.enjoyreducetype;

    this.latereducemount = atta.latereducemount;

    this.staffno = atta.staffno;
    this.departmentno = atta.departmentno;
    this.reduceregdate = atta.reduceregdate;
};


// get cust count
Stat.getCount = function(condition, callback){
    var condition = condition || {};

    var where = ' where';
    where += ' cust.custno = reduce.custno ';
    where += ' and reduce.staffno = staff.staffno ';
    where += ' and reduce.departmentno = department.departmentno ';
    where +=' and cust.custno like' + "'%" + condition.custno + "%'";
    where +=' and cust.cardname like' + "'%" + condition.cardname + "%'";
    where +=' and cust.cardtype like' + "'%" + condition.cardtype + "%'";

    if(condition.startdate){
        where +=' and reduce.regdate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and reduce.regdate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and reduce.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and reduce.departmentno like ' + "'%" + condition.departmentno + "%'";
    where +=' and reduce.status <> ' + "'delete'";

    var sqlstr = 'select count(*) as count, SUM(reduce.joinreducemount) AS totaljoinmount,'+
                'SUM(reduce.enjoyreducemount) AS totalenjoymount,' +
                'SUM(reduce.latereducemount) AS totallatemount, ' +
                'COUNT(DISTINCT cust.custid) AS totalcustcount from cust, reduce, staff, department ' + where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            //callback(null, rows[0].count);
            callback(null, rows[0]);
        }
    });
};

// get custs
Stat.getCusts = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};
    var where = ' where';
    where += ' cust.custno = reduce.custno ';
    where += ' and reduce.staffno = staff.staffno ';
    where += ' and reduce.departmentno = department.departmentno ';
    where +=' and cust.custno like' + "'%" + condition.custno + "%'";
    where +=' and cust.cardname like' + "'%" + condition.cardname + "%'";
    where +=' and cust.cardtype like' + "'%" + condition.cardtype + "%'";

    if(condition.startdate){
        where +=' and reduce.regdate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and reduce.regdate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and reduce.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and reduce.departmentno like ' + "'%" + condition.departmentno + "%'";
    where +=' and reduce.status <> ' + "'delete'";

    if( options.sortname == undefined ){
        options.sortname = 'custno';
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

    var sqlstr = 'SELECT cust.regdate, cust.cardname, cust.cardtype, cust.cardno, cust.custno,'+
                    'cust.cablename, cust.telephone, cust.address, cust.icid, cust.stdid, cust.remark,'+
                    'reduce.reducestartdate, reduce.reduceenddate, reduce.joinreducemount,'+
                    'reduce.joinreducetype, reduce.enjoyreducemount, reduce.enjoyreducetype,'+
                    'reduce.latereducemount,' +
                    'staff.name AS staffno, department.name AS departmentno, reduce.regdate AS reduceregdate ' +
                    'from cust,reduce,staff, department '+ where + ' ' + sort + ' ' + limit;

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var stats = [];
            for(var i in rows ){
                var stat = new Stat(rows[i]);
                stats.push(stat);
            }
            callback(null, stats);
        }
    });
};


//export data
Stat.export = function(condition, callback){
    var condition = condition || {};

    var where = ' where';
    where += ' cust.custno = reduce.custno ';
    where += ' and reduce.staffno = staff.staffno ';
    where += ' and reduce.departmentno = department.departmentno ';
    where +=' and cust.custno like' + "'%" + condition.custno + "%'";
    where +=' and cust.cardname like' + "'%" + condition.cardname + "%'";
    where +=' and cust.cardtype like' + "'%" + condition.cardtype + "%'";

    if(condition.startdate){
        where +=' and reduce.regdate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and reduce.regdate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and reduce.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and reduce.departmentno like ' + "'%" + condition.departmentno + "%'";
    where +=' and reduce.status <> ' + "'delete'";

    var sqlstr = 'SELECT cust.regdate, cust.cardname, cust.cardtype, cust.cardno, cust.custno,'+
        'cust.cablename, cust.telephone, cust.address, cust.icid, cust.stdid, cust.remark,'+
        'reduce.reducestartdate, reduce.reduceenddate, reduce.joinreducemount,'+
        'reduce.joinreducetype, reduce.enjoyreducemount, reduce.enjoyreducetype,'+
        'reduce.latereducemount, ' +
        'staff.name AS staffno, department.name AS departmentno, reduce.regdate AS reduceregdate ' +
        'from cust,reduce,staff, department '+ where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log('err',err);
        //console.log('rows', rows);
        if(err){
            callback(err, null);
        }else{
            callback(null, rows);
        }
    });
};





exports = module.exports = Stat;