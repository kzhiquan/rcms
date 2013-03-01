



var mysql = require('../db');

// staff class
function Staff(atta){
    this.staffno = atta.staffno;
    this.name = atta.name;
    this.password = atta.password;
    this.rank = atta.rank;
    this.status = atta.status;
    this.departmentno = atta.departmentno;
};

// save an staff.
Staff.prototype.save = function(callback){

    var sqlstr = 'insert into staff(staffno, name, password, rank, status, departmentno)values(';

    sqlstr = sqlstr + "'" + this.staffno + "',";
    sqlstr = sqlstr + "'" + this.name + "',";
    sqlstr = sqlstr + "'" + this.password + "',";
    sqlstr = sqlstr + "'" + this.rank + "',";
    sqlstr = sqlstr + "'" + this.status + "',";
    sqlstr = sqlstr + "'" + this.departmentno + "')";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        callback(err, rows);
    });
};

// put an staff
Staff.prototype.put = function(callback){
    var sqlstr = 'update staff ';
    sqlstr += "set staff.name = '" + this.name + "',";
    sqlstr += "staff.password = '" + this.password + "',";
    sqlstr += "staff.rank = '" + this.rank + "',";
    sqlstr += "staff.status = '" + this.status + "',";
    sqlstr += "staff.departmentno = '" + this.departmentno + "'";
    sqlstr += "where staff.staffno = '" + this.staffno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

//delete an staff
Staff.prototype.delete = function(callback){
    var sqlstr = 'delete from staff where staff.staffno = ' + "'" + this.staffno + "'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

// get staff count
Staff.getCount = function(condition, callback){
    var condition = condition || {};

    var where = "where staff.staffno like " + "'%" + condition.staffno + "%' ";
    where += "and staff.name like " + "'%" + condition.name + "%' ";
    where += "and staff.password like " + "'%" + condition.password + "%' ";
    where += "and staff.rank like " + "'%" + condition.rank + "%' ";
    where += "and staff.status like " + "'%" + condition.status + "%' ";
    where += "and staff.departmentno like " + "'%" + condition.departmentno + "%' ";


    var sqlstr = 'select count(*) as count from staff ' + where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            callback(null, rows[0].count);
        }

    });
};

// get staffs
Staff.getStaffs = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};

    var where = "where staff.staffno like " + "'%" + condition.staffno + "%' ";
    where += "and staff.name like " + "'%" + condition.name + "%' ";
    where += "and staff.password like " + "'%" + condition.password + "%' ";
    where += "and staff.rank like " + "'%" + condition.rank + "%' ";
    where += "and staff.status like " + "'%" + condition.status + "%' ";
    where += "and staff.departmentno like " + "'%" + condition.departmentno + "%' ";


    if( options.sortname == undefined ){
        options.sortname = 'staffno';
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

    var sqlstr = 'select * from staff ' + where + ' ' + sort + ' ' + limit;
    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var staffs = [];
            for(var i in rows ){
                var staff = new Staff(rows[i]);
                staffs.push(staff);
            }
            callback(null, staffs);
        }
    });
};

// get staff
Staff.get = function(staffno, callback){
    var sqlstr = 'select * from staff where staff.staffno = ' + "'" + staffno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log('result:');
        console.log('err',err);
        console.log('rows',rows);

        if(err || rows.length == 0){
            callback(err, null);
        }else{
            console.log('an staff get');
            var staff = new Staff(rows[0]);
            callback(null, staff);
        }
    });
};

// is staff exist according to the staffno
Staff.isExist = function(staffno, callback){
    var sqlstr = 'select count(*) as count from staff where staff.staffno = ' + "'"+staffno+"'";

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
};




Staff.getUser = function(staffno, callback){
    var sqlstr = 'SELECT staff.*, department.name as department '+
                'FROM staff, department '+
                'WHERE staff.departmentno = department.departmentno '+
                'AND staff.staffno =' + "'" + staffno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log('err',err);
        console.log('rows',rows);
        if(err || rows.length == 0){
            callback(err, null);
        }else{
            callback(err, rows[0]);
        }
    });
};





exports = module.exports = Staff;