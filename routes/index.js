
/*
 * GET home page.
 */

var csv = require('csv');
var fs = require('fs');


var log = require('../setting').log;
var mysqltrans = require('../dbtrans');

var Cust = require('../models/cust');
var Reduce = require('../models/reduce');
var Custhis = require('../models/custhis');
var Stat = require('../models/stat');
var Staff = require('../models/staff');
var Department = require('../models/department');
var Error = require('../models/error');
var Flexigrid = require('../models/flexigrid.js');


exports = module.exports = function( app ){

    /************************ path ************************/
    app.get('/', function(req, res){
        console.log('path home');
        indexView(req, res);
    });

    app.get('/reduce', function(req, res){
        console.log('reduce path');
        res.locals.path = req.path;
        indexView(req, res);
    });

    app.get('/business/:id', function(req, res){
        console.log('info path');
        res.locals.path = '/business';
        console.log(req.path);
        console.log(req.params);

        Cust.get(req.params['id'], function(err, cust){
            res.locals.cust = cust;
            indexView(req, res);
        });
    });


    app.get('/stat', checkLogin);
    app.get('/stat', checkManageStaff );
    app.get('/stat', function(req, res){
        console.log('stat path');
        res.locals.path = req.path;

        Department.getParentDepartments(function(err, departments){
            if(err){
                console.log('err',err);
                console.log('departments',departments);
            }else{
                res.locals.departments = departments;
                indexView(req, res);
            }
        });
    });

    app.get('/manage/staff', checkLogin);
    app.get('/manage/staff', checkSuperStaff );
    app.get('/manage/staff', function(req, res){
        console.log('manage path');
        res.locals.path = req.path;

        Department.getParentDepartments(function(err, departments){
            if(err){
                console.log('err',err);
                console.log('departments',departments);
            }else{
                res.locals.departments = departments;
                indexView(req, res);
            }
        });
    });

    app.get('/manage/department', checkLogin);
    app.get('/manage/department', checkSuperStaff );
    app.get('/manage/department', function(req, res){
        console.log('manage path');
        res.locals.path = req.path;

        Department.getParentDepartments(function(err, departments){
            if(err){
                console.log('err',err);
                console.log('departments',departments);
            }else{
                res.locals.departments = departments;
                indexView(req, res);
            }
        });

    });



    /**************** login control *****************************/
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res){
        res.render('login');
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res){
        console.log('login post');
        console.log(req.query);
        console.log(req.body);

        Staff.getUser(req.body.staffno, function(err, staff){
            console.log('staff:',staff);

            if(!staff){
                console.log('工号不存在');
                req.flash('error','工号不存在');
                return res.redirect('/login');
            }

            if( staff.password != req.body.password ){
                console.log('密码错误');
                req.flash('error', '密码错误');
                return res.redirect('/login');
            }

            console.log('登入成功');
            req.session.staff = staff;
            req.flash('success', '登入成功');
            res.redirect('/');
        });
    });


    app.get('/login', checkLogin);
    app.get('/logout', function(req, res){
        req.session.staff = null;
        req.flash('success', '登出成功');
        res.redirect('/login');
    });




    /******************* custs ***************************/
    app.post('/custs', function(req, res){
        console.log('post cust');
        console.log(req.body);

        Cust.isExist(req.body.custno, function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           } else if( count > 0 ){
               res.send(Error.EC_DB_EXIST_FAILED);
           }else{

               var cust = new Cust(req.body);
               cust.staffno = res.locals.staff.staffno;
               cust.departmentno = res.locals.staff.departmentno;

               cust.getSaveSql(function(sqlstr){
                   var trans = mysqltrans.startTransaction();

                   trans.query(sqlstr, function(err, info){
                       if(err){
                           console.log('trans err', err, info);
                           trans.rollback();
                           res.send(Error.EC_DB_INSERTTRANS_FAILED);
                       }else{
                           cust.regdate = new Date();
                           var custhis = new Custhis(cust);
                           custhis.opertype = '登记';

                           custhis.getSaveSql(function(sqlstr){
                                trans.query(sqlstr, function(err, info){
                                   if(err){
                                       console.log('trans err', err, info);
                                       trans.rollback();
                                       res.send(Error.EC_DB_INSERTTRANS_FAILED);
                                   } else{
                                       console.log('success', info);
                                       trans.commit();
                                       res.send({id:cust.custno});
                                   }
                                });
                           });
                       }
                   });

                   trans.execute();
               });
           }
        });

    });

    // update cust
    app.put('/custs/:id', function(req, res){
        console.log('put cust');
        console.log(req.body);
        console.log(req.query);

        Cust.isExist(req.body.custno, function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           } else if(count <= 0 ){
               res.send(Error.EC_DB_UNEXIST_FAILED);
           }else{
               Cust.get(req.body.custno, function(err, cust){
                  if(err){
                      console.log(err);
                      res.send(Error.EC_DB_QUERY_FAILED);
                  }else{
                      cust.set(req.body);
                      cust.staffno = res.locals.staff.staffno;
                      cust.departmentno = res.locals.staff.departmentno;

                      cust.getUpdateSql(function(sqlstr){
                          var trans = mysqltrans.startTransaction();

                          trans.query(sqlstr, function(err, info){
                              if(err){
                                  console.log(err, info);
                                  trans.rollback();
                                  res.send(Error.EC_DB_UPDATETRANS_FAILED);
                              }else{
                                  console.log('cust:', cust);
                                  var custhis = new Custhis(cust);
                                  custhis.opertype = '修改';

                                  custhis.getSaveSql(function(sqlstr){
                                      trans.query(sqlstr, function(err, info){
                                          if(err){
                                              console.log(err, info);
                                              trans.rollback();
                                              res.send(Error.EC_DB_UPDATETRANS_FAILED);
                                          }else{
                                              console.log('success', info);
                                              trans.commit();
                                              res.send({id:cust.custno});
                                          }
                                      });
                                  });
                              }
                          });

                          trans.execute();
                      });
                  }
               });
           }
        });
    });

    // delete cust
    app.delete('/custs/:id', function(req, res){
        console.log('delete cust');
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        Cust.isExist(req.params['id'], function(err, count){
            if(err){
                res.send(Error.EC_DB_QUERY_FAILED);
            }else if( count <= 0 ){
                res.send(Error.EC_DB_UNEXIST_FAILED);
            }else{
                Cust.get(req.params['id'], function(err, cust){
                    if(err){
                        console.log(err);
                        res.send(Error.EC_DB_QUERY_FAILED);
                    }else{
                        console.log('cust:', cust);
                        cust.getDeleteSql(function(sqlstr){
                            var trans = mysqltrans.startTransaction();

                            trans.query(sqlstr, function(err, info){
                                if(err){
                                    console.log(err, info);
                                    trans.rollback();
                                    res.send(Error.EC_DB_DELETETRANS_FAILED);
                                }else{
                                    var custhis = new Custhis(cust);
                                    custhis.opertype = '删除';

                                    custhis.getSaveSql(function(sqlstr){
                                        trans.query(sqlstr, function(err, info){
                                            if(err){
                                                console.log(err, info);
                                                trans.rollback();
                                                res.send(Error.EC_DB_DELETETRANS_FAILED);
                                            }else{
                                                console.log('success ', info);
                                                trans.commit();
                                                res.send({id:'empty'});
                                            }
                                        }) ;
                                    });
                                }
                            });

                            trans.execute();
                        });
                    }
                });
            }
        });


    });

    //query for cust flexigrid.
    app.get('/custs', function(req, res){
        console.log('get custs');
        console.log(req.query);

        var flexigrid = new Flexigrid();
        flexigrid.setPage(req.query.page);

        var condition = JSON.parse(req.query.query);
        Cust.getCount( condition, function(err,count){
            if(err){
                console.log(err);
            }else{
                flexigrid.setTotal(count);

                var opts = {
                    page : req.query.page,
                    rp : req.query.rp,
                    sortname : req.query.sortname,
                    sortorder: req.query.sortorder,
                    conditions : condition,
                    qtype : req.query.qtype
                }

                Cust.getCusts(opts, function(err, custs){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(custs);
                        flexigrid.setCustRows(custs);
                        res.json(flexigrid);
                    }
                });
            }
        });
    });


    /****************** reduces **************************/
    //query for reduces flexigrid
    app.get('/reduces', function(req, res){
        console.log('get reduces:');
        console.log(req.query);
        console.log(req.query.query);

        var flexigrid = new Flexigrid();
        flexigrid.setPage(req.query.page);

        var condition = JSON.parse(req.query.query);
        condition.staffno = res.locals.staff.staffno;
        condition.departmentno = res.locals.staff.departmentno;
        Reduce.getCount( condition, function(err,count){
            if(err){
                console.log(err);
            }else{
                flexigrid.setTotal(count);

                var opts = {
                    page : req.query.page,
                    rp : req.query.rp,
                    sortname : req.query.sortname,
                    sortorder: req.query.sortorder,
                    conditions : condition,
                    qtype : req.query.qtype
                }

                Reduce.getReduces(opts, function(err, reduces){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(reduces);
                        flexigrid.setReduceRows(reduces);
                        res.json(flexigrid);
                    }
                });
            }
        });
    });

    //save for reduce
    app.post('/reduces', function(req, res){
        console.log('post reduce');
        console.log(req.body);

        var reduce = new Reduce(req.body);
        reduce.staffno = res.locals.staff.staffno;
        reduce.departmentno = res.locals.staff.departmentno;
        reduce.status = 'sign';

        reduce.save(function(err, info){
            if(err){
                console.log('reduce save error', err, info);
                res.send(Error.EC_DB_INSERT_FAILED);
            }else{
                console.log('reduce save success');
                res.send({ id:info.insertId });
            }
        });
    });

    //update reduce
    app.put('/reduces/:id', function(req, res){
        console.log('put reduce');
        console.log('body:', req.body);
        console.log('query:', req.query);

        Reduce.isExist(req.body.reduceid, function(err, count){
            if(err){
                res.send(Error.EC_DB_QUERY_FAILED);
            }else if(count <= 0 ){
                res.send(Error.EC_DB_UNEXIST_FAILED);
            }else{
                Reduce.get(req.body.reduceid, function(err, reduce){
                   if(err){
                       res.send(Error.EC_DB_QUERY_FAILED);
                   }else{
                       reduce.set(req.body);
                       reduce.staffno = res.locals.staff.staffno;
                       reduce.departmentno = res.locals.staff.departmentno;
                       reduce.status = 'modify';

                       reduce.put(function(err, info){
                            if(err){
                                res.send(Error.EC_DB_UPDATE_FAILED);
                            }else{
                                console.log(info);
                                res.send({id:reduce.reduceid});
                            }
                       });
                   }
                });
            }
        });
    });

    //delete reduce
    app.delete('/reduces/:id', function(req, res){
        console.log('delete reduce');
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        Reduce.isExist(req.params['id'], function(err, count){
            if(err){
                res.send(Error.EC_DB_QUERY_FAILED);
            }else if( count <= 0 ){
                res.send(Error.EC_DB_UNEXIST_FAILED);
            }else{
                Reduce.get(req.params['id'], function(err, reduce){
                    if(err){
                        res.send(Error.EC_DB_QUERY_FAILED);
                    }else{
                        //reduce.set(req.body);
                        reduce.staffno = res.locals.staff.staffno;
                        reduce.departmentno = res.locals.staff.departmentno;
                        //reduce.status = 'delete';

                        reduce.delete(function(err, info){
                            if(err){
                                res.send(Error.EC_DB_UPDATE_FAILED);
                            }else{
                                console.log(info);
                                res.send({id:reduce.reduceid});
                            }
                        });
                    }
                });
            }
        });
    });


    /*************** custshis ***************************/
    app.get('/custshis', function(req, res){
        console.log('get custshis');
        console.log(req.query);

        var flexigrid = new Flexigrid();
        flexigrid.setPage(req.query.page);

        var condition = JSON.parse(req.query.query);
        Stat.getCount( condition, function(err,info){
            if(err){
                console.log(err);
            }else{
                flexigrid.setTotal(info.count);
                flexigrid.totaljoinmount = info.totaljoinmount;
                flexigrid.totalenjoymount = info.totalenjoymount;
                flexigrid.totallatemount = info.totallatemount;
                flexigrid.totalcustcount = info.totalcustcount;

                var opts = {
                    page : req.query.page,
                    rp : req.query.rp,
                    sortname : req.query.sortname,
                    sortorder: req.query.sortorder,
                    conditions : condition,
                    qtype : req.query.qtype
                }

                Stat.getCusts(opts, function(err, stats){
                    if(err){
                        console.log(err);
                    }else{
                        flexigrid.setStatRows(stats);
                        res.json(flexigrid);
                    }
                });
            }
        });
    });

    app.post('/export', function(req, res){
       console.log('export path');
       console.log('req.body',req.body);
       console.log('req.query', req.query);

       Stat.export(req.body, function(err, rows){
          if(err){
              res.send(Error.EC_DB_EXPORT_DATA);
          }else{

              //first send header.
              res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
              res.setHeader('Content-Type', 'application/force-download');
              res.writeHead(200, {
                  'Content-Type': 'text/csv'
              });

              //csv().from('"0001","2","3","4","5"').to(res);

              var header = {
                  regdate: '开户日期',
                  cardname:'证件姓名',
                  cardtype:'证件类型',
                  cardno:'证件号码',
                  custno:'有线证号',
                  cablename:'有线户名',
                  telephone:'联系电话',
                  address:'申请地址',
                  icid:'IC卡号',
                  stbid:'机顶盒号',
                  remark:'用户备注',

                  reducestartdate:'开始日期',
                  reduceenddate: '截至日期',
                  joinreducemount:'入网减免',
                  joinreducetype:'减免方式',
                  enjoyreducemount:'收视减免',
                  enjoyreducetype:'减免方式',
                  latereducemount:'滞纳金减免',
                  staffno:'营业员',
                  departmentno:'营业网点',
                  reduceregdate:'减免日期'
              };
              rows.unshift(header);

              csv()
              .from.array(rows)
              .to(res,{
                    columns:['regdate', 'cardname', 'cardtype', 'cardno', 'custno', 'cablename','telephone',
                          'address', 'icid', 'stbid', 'remark', 'reducestartdate', 'reduceenddate',
                          'joinreducemount', 'joinreducetype', 'enjoyreducemount', 'enjoyreducetype', 'latereducemount', 'staffno', 'departmentno', 'reduceregdate']
              })
              .transform(function(data){
                    if(data.regdate instanceof Date){
                        data.regdate = data.regdate.getFullYear() + '-'+(data.regdate.getMonth()+1) + '-'+data.regdate.getDate()+ ' '+ data.regdate.toLocaleTimeString();
                    }
                    if(data.reducestartdate instanceof  Date){
                        data.reducestartdate = data.reducestartdate.getFullYear() + '-'+(data.reducestartdate.getMonth()+1) + '-'+data.reducestartdate.getDate()+ ' '+ data.reducestartdate.toLocaleTimeString();
                    }

                    if(data.reduceenddate instanceof  Date){
                        data.reduceenddate = data.reduceenddate.getFullYear() + '-'+(data.reduceenddate.getMonth()+1) + '-'+data.reduceenddate.getDate()+ ' '+ data.reduceenddate.toLocaleTimeString();
                    }

                    if(data.reduceregdate instanceof  Date){
                        data.reduceregdate = data.reduceregdate.getFullYear() + '-'+(data.reduceregdate.getMonth()+1) + '-'+data.reduceregdate.getDate()+ ' '+ data.reduceregdate.toLocaleTimeString();
                    }
                    return data;
              });
          }
       });
    });



    /******************* staffs **************************/
    app.post('/staffs', function(req, res){
        console.log('post staffs');
        console.log(req.body);

        Staff.isExist(req.body.staffno, function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           }else if( count > 0 ){
               res.send(Error.EC_DB_EXIST_FAILED);
           }else{
               var staff = new Staff(req.body);
               staff.save(function(err, result){
                   if(err){
                       console.log(err);
                       res.send(Error.EC_DB_INSERT_FAILED);
                   }else{
                       //res.send({id:result.insertId});
                       res.send({id:staff.staffno});
                   }
               });
           }
        });
    });

    // update staff
    app.put('/staffs/:id', function(req, res){
        console.log('put staff');
        console.log(req.body);
        console.log(req.query);


        Staff.isExist(req.body.staffno, function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           } else if( count < 0 ){
               res.send(Error.EC_DB_UNEXIST_FAILED);
           }else{
               var staff = new Staff(req.body);

               staff.put(function(err, result){
                   if(err){
                       res.send(Error.EC_DB_UPDATE_FAILED);
                   }else{
                       res.send({id:staff.staffno});
                   }
               });
           }
        });
    });

    // delete staff
    app.delete('/staffs/:id', function(req, res){
        console.log('delete staff');
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);

        if(req.params['id'] == req.session.staff.staffno){
            return res.send(Error.EC_DELETE_SESSION);
        }

        Staff.isExist(req.params['id'], function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           } else if( count < 0 ){
               res.send(Error.EC_DB_UNEXIST_FAILED);
           }else{
               var staff = new Staff({
                   staffno: req.params['id']
               });

               staff.delete(function(err, result){
                   if(err){
                       res.send(Error.EC_DB_DELETE_FAILED);
                   }else{
                       res.send({id:'empty'});
                   }
               });
           }
        });

    });

    //query for cust flexigrid.
    app.get('/staffs', function(req, res){
        console.log('get staffs');
        console.log(req.query);

        var flexigrid = new Flexigrid();
        flexigrid.setPage(req.query.page);

        var condition = JSON.parse(req.query.query);
        Staff.getCount( condition, function(err,count){
            if(err){
                console.log(err);
            }else{
                flexigrid.setTotal(count);

                var opts = {
                    page : req.query.page,
                    rp : req.query.rp,
                    sortname : req.query.sortname,
                    sortorder: req.query.sortorder,
                    conditions : condition,
                    qtype : req.query.qtype
                }

                Staff.getStaffs(opts, function(err, staffs){
                    if(err){
                        console.log(err);
                    }else{
                        flexigrid.setStaffRows(staffs);
                        res.json(flexigrid);
                    }
                });
            }
        });
    });



    /******************* departments **************************/
    app.post('/departments', function(req, res){
        console.log('post departments');
        console.log(req.body);

        Department.isExist(req.body.departmentno, function(err, count){
            if(err){
                res.send(Error.EC_DB_QUERY_FAILED);
            }else if(count > 0 ){
                res.send(Error.EC_DB_EXIST_FAILED);
            }else{
                var department = new Department(req.body);
                department.save(function(err, result){
                    if(err){
                        console.log(err);
                        res.send(Error.EC_DB_INSERT_FAILED);
                    }else{
                        //res.send({id:result.insertId});
                        res.send({id:department.departmentno});
                    }
                });
            }
        });
    });

    // update department
    app.put('/departments/:id', function(req, res){
        console.log('put department');
        console.log(req.body);
        console.log(req.query);


        Department.isExist(req.body.departmentno, function(err, count){
            if(err){
                res.send(Error.EC_DB_QUERY_FAILED);
            }else if(count <= 0 ){
                res.send(Error.EC_DB_UNEXIST_FAILED);
            }else{
                var department = new Department(req.body);

                department.put(function(err, result){
                    if(err){
                        res.send(Error.EC_DB_UPDATE_FAILED);
                    }else{
                        res.send({id:department.departmentno});
                    }
                });
            }
        });

    });

    // delete department
    app.delete('/departments/:id', function(req, res){
        console.log('delete department');
        console.log(req.body);
        console.log(req.query);
        console.log(req.params);


        Department.isExist(req.params['id'], function(err, count){
           if(err){
               res.send(Error.EC_DB_QUERY_FAILED);
           }else if(count <= 0){
               res.send(Error.EC_DB_UNEXIST_FAILED);
           }else{
               var department = new Department({
                   departmentno: req.params['id']
               });

               department.delete(function(err, result){
                   if(err){
                       res.send(Error.EC_DB_DELETE_FAILED);
                   }else{
                       res.send({id:'empty'});
                   }
               });
           }
        });

    });

    //query for department flexigrid.
    app.get('/departments', function(req, res){
        console.log('get departments');
        console.log(req.query);

        var flexigrid = new Flexigrid();
        flexigrid.setPage(req.query.page);

        var condition = JSON.parse(req.query.query);
        Department.getCount( condition, function(err,count){
            if(err){
                console.log(err);
            }else{
                flexigrid.setTotal(count);

                var opts = {
                    page : req.query.page,
                    rp : req.query.rp,
                    sortname : req.query.sortname,
                    sortorder: req.query.sortorder,
                    conditions : condition,
                    qtype : req.query.qtype
                }

                Department.getDepartments(opts, function(err, departments){
                    if(err){
                        console.log(err);
                    }else{
                        flexigrid.setDepartmentRows(departments);
                        res.json(flexigrid);
                    }
                });
            }
        });
    });
};



/* chech the staff has login in */
function checkLogin(req,res,next){
    if(!req.session.staff){
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
};


/* check the staff not login in */
function checkNotLogin(req,res,next){
    if(req.session.staff){
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
};


function checkManageStaff(req, res, next){
    console.log('checkManageStaff:',req.session.staff.rank);
    if(req.session.staff.rank.indexOf('管理员') == -1 ){
        req.flash('error', '权限不够');
        return res.redirect('/');
    }
    next();
};


function checkSuperStaff(req, res, next){
    console.log('checkSuperStaff:', req.session.staff.rank);
    if(req.session.staff.rank.indexOf('超级') == -1 ){
        req.flash('error', '权限不够');
        return res.redirect('/');
    }
    next();
};


/* the point road to get in */
function indexView(req, res){
    console.log('start index render');

    if(!req.session.staff){
        console.log('has no session staff');
        req.flash('error', '未登入');
        return res.redirect('/login');
    }


    res.render('index');
};

