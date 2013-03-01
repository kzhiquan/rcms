/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 12-12-6
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */



var mysql = require('../db');

// department class
function Department(atta){
    this.departmentno = atta.departmentno;
    this.name = atta.name;
    this.parentno = atta.parentno;
};

// save an department.
Department.prototype.save = function(callback){

    var sqlstr = 'insert into department(departmentno, name, parentno)values(';

    if(!this.parentno){
        this.parentno = 0;
    }

    sqlstr = sqlstr + "'" + this.departmentno + "',";
    sqlstr = sqlstr + "'" + this.name + "',";
    sqlstr = sqlstr + "'" + this.parentno + "')";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        callback(err, rows);
    });
};


// put an department
Department.prototype.put = function(callback){
    var sqlstr = 'update department ';
    sqlstr += "set department.name = '" + this.name + "',";
    sqlstr += "department.parentno = '" + this.parentno + "' ";
    sqlstr += "where department.departmentno = '" + this.departmentno + "'";

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};

//delete an department
Department.prototype.delete = function(callback){
    var sqlstr = 'delete from department where department.departmentno = ' + "'" + this.departmentno + "'";

    console.log(sqlstr);

    mysql.query(sqlstr, function(err, result){
        console.log(err);
        console.log(result);
        callback(err, result);
    });
};


// get department count
Department.getCount = function(condition, callback){
    var condition = condition || {};

    var where = "where department.departmentno like " + "'%" + condition.departmentno + "%' ";
    where += "and department.name like " + "'%" + condition.name + "%' ";
    where += "and department.parentno like " + "'%" + condition.parentno + "%' ";


    var sqlstr = 'select count(*) as count from department ' + where;

    console.log(sqlstr);
    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err, null);
        }else{
            callback(null, rows[0].count);
        }

    });
};

// get departments
Department.getDepartments = function(options, callback){
    var options  = options || {};

    var condition = options.conditions || {};

    var where = "where department.departmentno like " + "'%" + condition.departmentno + "%' ";
    where += "and department.name like " + "'%" + condition.name + "%' ";
    where += "and department.parentno like " + "'%" + condition.parentno + "%' ";


    if( options.sortname == undefined ){
        options.sortname = 'departmentno';
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

    /*var sqlstr = 'select department.*, b.name as parentno from department, department b ' + where +
        ' and department.parentno = b.departmentno ' +
        ' ' + sort + ' ' + limit;*/
    var sqlstr = 'select * from department ' + where  + ' ' + sort + ' ' + limit;
    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        if(err){
            callback(err);
        }
        else{
            var departments = [];
            for(var i in rows ){
                var department = new Department(rows[i]);
                departments.push(department);
            }
            callback(null, departments);
        }
    });
};


// get parent departments
Department.getParentDepartments = function(callback){
    var sqlstr = 'select * from department ';
    console.log(sqlstr);

    mysql.query(sqlstr, function(err, rows){
        console.log(err);
        console.log(rows);
        if(err){
            callback(err);
        }
        else{
            var departments = [];
            for(var i in rows ){
                var department = new Department(rows[i]);
                departments.push(department);
            }
            callback(null, departments);
        }
    });
};

// is the department exist
Department.isExist = function(departmentno, callback){
    var sqlstr = 'select count(*) as count from department where department.departmentno = ' + "'"+departmentno+"'";

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





exports = module.exports = Department;
