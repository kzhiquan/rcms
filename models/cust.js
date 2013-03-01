

var mysql = require('../db');

// Cust class
function Cust(atta){
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
};


Cust.prototype.set = function(atta){
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
    this.staffno = atta.staffno;
    this.departmentno = atta.departmentno;
};


// save an cust.
Cust.prototype.save = function(callback){

    var sqlstr = 'insert into cust(custno, cardname, address, telephone, cablename,' +
        ' cardtype, cardno, stdid, icid, remark, ' +
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
    sqlstr = sqlstr + "'" + this.remark + "',";
    sqlstr = sqlstr + 'NOW(),';
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

Cust.prototype.getSaveSql = function(callback){
    var sqlstr = 'insert into cust(custno, cardname, address, telephone, cablename,' +
        ' cardtype, cardno, stdid, icid,remark,' +
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
    sqlstr = sqlstr + "'" + this.remark + "',";
    sqlstr = sqlstr + 'NOW(),';
    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + "'" + this.departmentno + "',";
    sqlstr = sqlstr + 'NOW())';

    callback(sqlstr);
};


// put an cust
Cust.prototype.put = function(callback){
    var sqlstr = 'update cust ';
    sqlstr += "set cust.cardname = '" + this.cardname + "',";
    sqlstr += "cust.telephone = '" + this.telephone + "',";
    sqlstr += "cust.cablename = '" + this.cablename + "',";
    //sqlstr += "cust.cablecard = '" + this.cablecard + "',";
    sqlstr += "cust.address = '" + this.address + "',";
    sqlstr += "cust.cardtype = '" + this.cardtype + "',";
    sqlstr += "cust.cardno = '" + this.cardno + "',";
    sqlstr += "cust.stdid = '" + this.stdid + "',";
    sqlstr += "cust.icid = '" + this.icid + "',";
    sqlstr += "cust.remark = '" + this.remark + "',";
    sqlstr += "cust.updatedate = NOW() "
    sqlstr += "where cust.custno = '" + this.custno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

Cust.prototype.getUpdateSql = function(callback){
    var sqlstr = 'update cust ';
    sqlstr += "set cust.cardname = '" + this.cardname + "',";
    sqlstr += "cust.telephone = '" + this.telephone + "',";
    sqlstr += "cust.cablename = '" + this.cablename + "',";
    //sqlstr += "cust.cablecard = '" + this.cablecard + "',";
    sqlstr += "cust.address = '" + this.address + "',";
    sqlstr += "cust.cardtype = '" + this.cardtype + "',";
    sqlstr += "cust.cardno = '" + this.cardno + "',";
    sqlstr += "cust.stdid = '" + this.stdid + "',";
    sqlstr += "cust.remark = '" + this.remark + "',";
    sqlstr += "cust.icid = '" + this.icid + "',";
    sqlstr += "cust.updatedate = NOW() "
    sqlstr += "where cust.custno = '" + this.custno + "'";

    callback(sqlstr);
};

//delete an cust
Cust.prototype.delete = function(callback){
    var sqlstr = 'delete from cust where cust.custno = ' + "'" + this.custno + "'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

Cust.prototype.getDeleteSql = function(callback){
    var sqlstr = 'delete from cust where cust.custno = ' + "'" + this.custno + "'";
    callback(sqlstr);
};

// get cust count
Cust.getCount = function(condition, callback){
    var condition = condition || {};

    var where = "where cust.custno like " + "'%" + condition.custno + "%' ";
    where += "and cust.cardname like " + "'%" + condition.cardname + "%' ";
    where += "and cust.telephone like " + "'%" + condition.telephone + "%' ";
    where += "and cust.cablename like " + "'%" + condition.cablename + "%' ";
    //where += "and cust.cablecard like " + "'%" + condition.cablecard + "%' ";
    where += "and cust.address like " + "'%" + condition.address + "%' ";
    where += "and cust.cardtype like " + "'%" + condition.cardtype + "%' ";
    where += "and cust.cardno like " + "'%" + condition.cardno + "%' ";
    where += "and cust.stdid like " + "'%" + condition.stdid + "%' ";
    where += "and cust.remark like " + "'%" + condition.remark + "%' ";
    where += "and cust.icid like " + "'%" + condition.icid + "%' ";

    var sqlstr = 'select count(*) as count from cust ' + where;

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
Cust.getCusts = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};

    var where = "where cust.custno like " + "'%" + condition.custno + "%' ";
    where += "and cust.cardname like " + "'%" + condition.cardname + "%' ";
    where += "and cust.telephone like " + "'%" + condition.telephone + "%' ";
    where += "and cust.cablename like " + "'%" + condition.cablename + "%' ";
    //where += "and cust.cablecard like " + "'%" + condition.cablecard + "%' ";
    where += "and cust.address like " + "'%" + condition.address + "%' ";
    where += "and cust.cardtype like " + "'%" + condition.cardtype + "%' ";
    where += "and cust.cardno like " + "'%" + condition.cardno + "%' ";
    where += "and cust.stdid like " + "'%" + condition.stdid + "%' ";
    where += "and cust.icid like " + "'%" + condition.icid + "%' ";
    where += "and cust.remark like " + "'%" + condition.remark + "%' ";


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

    var sqlstr = 'select * from cust ' + where + ' ' + sort + ' ' + limit;
    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var custs = [];
            for(var i in rows ){
                var cust = new Cust(rows[i]);
                custs.push(cust);
            }
            callback(null, custs);
        }
    });
};


// get cust
Cust.get = function(custno, callback){

    var sqlstr = "select * from cust where cust.custno = " + "'"+ custno + "'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
       if(err){
           callback(err, null);
       }else{
           var cust = new Cust(rows[0]);
           callback(err, cust);
       }
    });
};

// is Cust exist
Cust.isExist = function(custno, callback){
    var sqlstr = 'select count(*) as count from cust where cust.custno = ' + "'"+custno+"'";

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



exports = module.exports = Cust;