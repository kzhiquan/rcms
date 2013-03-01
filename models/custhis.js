/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 12-12-7
 * Time: 上午10:50
 * To change this template use File | Settings | File Templates.
 */



var mysql = require('../db');

// Cust class
function Custhis(atta){
    this.custno = atta.custno;
    this.cardname = atta.cardname;
    this.telephone = atta.telephone;
    this.cablename = atta.cablename;
    //this.cablecard = atta.cablecard;
    this.address = atta.address;
    this.cardtype = atta.cardtype;
    this.cardno = atta.cardno;
    this.stdid = atta.stdid;
    this.icid = atta.icid;
    this.remark = atta.remark;
    this.regdate = atta.regdate;
    this.updatedate = atta.updatedate;
    this.staffno = atta.staffno;
    this.departmentno = atta.departmentno;
    this.opertype = atta.opertype;
};



// save an custhis.
Custhis.prototype.save = function(callback){

    var sqlstr = 'insert into custhis(custno, cardname, address, telephone, cablename,' +
        ' cardtype, cardno,' +
        'regdate, staffno, departmentno, updatedate)values(';

    sqlstr = sqlstr + "'" + this.custno + "',";
    sqlstr = sqlstr + "'" + this.cardname + "',";
    sqlstr = sqlstr + "'" + this.address + "',";
    sqlstr = sqlstr + "'" + this.telephone + "',";
    sqlstr = sqlstr + "'" + this.cablename + "',";
    //sqlstr = sqlstr + "'" + this.cablecard + "',";
    sqlstr = sqlstr + "'" + this.cardtype + "',";
    sqlstr = sqlstr + "'" + this.cardno + "',";
    sqlstr = sqlstr + "'" + this.stdid + "',";
    sqlstr = sqlstr + "'" + this.icid + "',";
    sqlstr = sqlstr + "'" + this.regdate.getFullYear() + '-'+(this.regdate.getMonth()+1) + '-'+this.regdate.getDate()+ ' '+ this.regdate.toLocaleTimeString() + "',";
    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + "'" + this.departmentno + "',";
    sqlstr = sqlstr + 'NOW())';

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        callback(err, rows);
    });
};

Custhis.prototype.getSaveSql = function(callback){
    var sqlstr = 'insert into custhis(custno, cardname, address, telephone, cablename,' +
        ' cardtype, cardno, stdid, icid,remark,' +
        'regdate, staffno, departmentno, updatedate, opertype)values(';

    sqlstr = sqlstr + "'" + this.custno + "',";
    sqlstr = sqlstr + "'" + this.cardname + "',";
    sqlstr = sqlstr + "'" + this.address + "',";
    sqlstr = sqlstr + "'" + this.telephone + "',";
    sqlstr = sqlstr + "'" + this.cablename + "',";
    //sqlstr = sqlstr + "'" + this.cablecard + "',";
    sqlstr = sqlstr + "'" + this.cardtype + "',";
    sqlstr = sqlstr + "'" + this.cardno + "',";
    sqlstr = sqlstr + "'" + this.stdid + "',";
    sqlstr = sqlstr + "'" + this.icid + "',";
    sqlstr = sqlstr + "'" + this.remark + "',";
    sqlstr = sqlstr + "'" + this.regdate.getFullYear() + '-'+(this.regdate.getMonth()+1) + '-'+this.regdate.getDate()+ ' '+ this.regdate.toLocaleTimeString() + "',";
    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + "'" + this.departmentno + "',";
    sqlstr = sqlstr + 'NOW(),';
    sqlstr = sqlstr + "'" + this.opertype + "')";

    callback(sqlstr);
}


// put an custhis
Custhis.prototype.put = function(callback){
    var sqlstr = 'update custhis ';
    sqlstr += "set custhis.cardname = '" + this.cardname + "',";
    sqlstr += "custhis.telephone = '" + this.telephone + "',";
    sqlstr += "custhis.cablename = '" + this.cablename + "',";
    //sqlstr += "custhis.cablecard = '" + this.cablecard + "',";
    sqlstr += "custhis.address = '" + this.address + "',";
    sqlstr += "custhis.cardtype = '" + this.cardtype + "',";
    sqlstr += "custhis.cardno = '" + this.cardno + "',";
    sqlstr += "custhis.stdid = '" + this.stdid + "',";
    sqlstr += "custhis.icid = '" + this.icid + "',";
    sqlstr += "custhis.remark = '" + this.remark + "',";

    sqlstr += "where custhis.custno = '" + this.custno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};



//delete an cust
Custhis.prototype.delete = function(callback){
    var sqlstr = 'delete from custhis where custhis.custno = ' + "'" + this.custno + "'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};



// get cust count
Custhis.getCount = function(condition, callback){
    var condition = condition || {};

    var where = ' where';
    where +=' custhis.custno like' + "'%" + condition.custno + "%'";
    where +=' and custhis.name like' + "'%" + condition.name + "%'";

    if(condition.startdate){
        where +=' and custhis.updatedate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and custhis.updatedate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and custhis.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and custhis.departmentno like ' + "'%" + condition.departmentno + "%'";

    var sqlstr = 'select count(*) as count from custhis ' + where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            callback(null, rows[0].count);
        }
    });
};

// get custs
Custhis.getCusts = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};
    var where = ' where custhis.staffno = staff.staffno and custhis.departmentno = department.departmentno ';

    if(condition.custno){
        where +=' and custhis.custno like' + "'%" + condition.custno + "%'";
    }

    if(condition.name){
        where +=' and custhis.cardname like' + "'%" + condition.cardname + "%'";
    }

    if(condition.startdate){
        where +=' and custhis.updatedate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and custhis.updatedate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and custhis.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and custhis.departmentno like ' + "'%" + condition.departmentno + "%'";

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

    var sqlstr = 'select custhis.*, staff.name as staffno, department.name as departmentno ' +
        'from custhis, staff, department '+ where + ' ' + sort + ' ' + limit;

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var custshis = [];
            for(var i in rows ){
                var custhis = new Custhis(rows[i]);
                custshis.push(custhis);
            }
            callback(null, custshis);
        }
    });
};


//export data
Custhis.export = function(condition, callback){
    var condition = condition || {};

    var where = ' where custhis.staffno = staff.staffno and custhis.departmentno = department.departmentno ';

    if(condition.custno){
        where +=' and custhis.custno like' + "'%" + condition.custno + "%'";
    }

    if(condition.name){
        where +=' and custhis.cardname like' + "'%" + condition.cardname + "%'";
    }

    if(condition.startdate){
        where +=' and custhis.updatedate ' + ">=" + "'" + condition.startdate + "'";
    }
    if(condition.enddate){
        where +=' and custhis.updatedate ' + "<=" + "'" + condition.enddate + "'";
    }

    where +=' and custhis.staffno like ' + "'%" + condition.staffno + "%'";
    where +=' and custhis.departmentno like ' + "'%" + condition.departmentno + "%'";

    var sqlstr = 'select custhis.*, staff.name as staffno, department.name as departmentno ' +
        'from custhis, staff, department '+ where;

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





exports = module.exports = Custhis;
