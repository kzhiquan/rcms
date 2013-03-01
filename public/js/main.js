/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 12-11-30
 * Time: 下午2:02
 * To change this template use File | Settings | File Templates.
 */


//main
(function($){


})(jQuery);


// custs flexigrid.
(function($){
    //model
    var Cust = Backbone.Model.extend({
        //defaults attributes
        defaults : function(){
            return {
                custno:null,
                cardname:null,
                telephone:null,
                cablename:null,
                //cablecard:null,
                address:null,
                cardtype:null,
                cardno:null,
                stdid:null,
                icid:null,
                remark: null
            };
        },

        // constructor
        initialize: function(atts){
            this.set(atts);
        },

        urlRoot : '/custs',

        // validate
        validate : function(atts){
            if(!atts.custno){
                return '客户编号不能为空';
            }

            if(!atts.cardname){
                return '客户姓名不能为空';
            }
        },

        error:function(model, res){
            console.log('err');
            console.log(model);
            console.log(res);
            if(res.responseText){
                res = res.responseText;
            }
            alert(res);
        },

        success : function(model, res){
            console.log('success');
            console.log('model:',model);
            cust.set(model);
            console.log(cust.attributes);
            alert('操作成功');
        }

    });

    // an cust
    var cust = new Cust();


    //collection
    var Custs = Backbone.Collection.extend({
        model:Cust
    });


    //view
    var CustView = Backbone.View.extend({
        el: $('#cust'),

        events : {
            "click #query": "reduceQuery",
            "click #sign" : "reduceSign",
            "click #modify" : "reduceModify",
            "click #delete" : "reduceDelete"
        },

        initialize : function(){
            var opts = {
                dataType: 'json',
                method:'POST',
                colModel : [
                    {display: '登记日期', name : 'regdate', width : 120, sortable : true, align: 'left'},
                    {display: '证件姓名', name : 'cardname', width : 60, sortable : true, align: 'left'},
                    {display: '证件类别', name : 'cardtype', width : 60, sortable : true, align: 'left'},
                    {display: '证件号码', name : 'cardno', width : 60, sortable : true, align: 'left'},
                    {display: '有线证号', name : 'custno', width : 60, sortable : true, align: 'left'},
                    {display: '有线户名', name : 'cablename', width : 60, sortable : true, align: 'left'},
                    {display: '联系电话', name : 'telephone', width : 60, sortable : true, align: 'left'},
                    //{display: '有线证号', name : 'cablecard', width : 60, sortable : true, align: 'left'},
                    {display: '申请地址', name : 'address', width : 60, sortable : true, align: 'left'},
                    {display: '机顶盒号', name : 'stdid', width : 60, sortable : true, align: 'left'},
                    {display: 'IC 卡 号', name : 'icid', width : 60, sortable : true, align: 'left'},
                    {display: '用户备注', name : 'remark', width : 60, sortable : true, align: 'left'},
                    {display: '更新日期', name : 'updatedate', width : 60, sortable : true, align: 'left'}
                ],
                pagestat: '显示 {from} 到 {to}，总共 {total} 条',
                sortname: "custno",
                sortorder: "asc",
                usepager: true,
                title: '用户信息',
                useRp: true,
                rp: 15,
                showTableToggleBtn: true,
                height: 180
            };

            $(".reduce #custTable").flexigrid(opts);
            $(".reduce #custTable").dblclick(this.flexigirdItemDBClick);
        },

        flexigirdItemDBClick:function(){
            console.log("flexigrid row dbclick event start!");

            //读取表格所选行数据
            var data = new Array();
            var rowsize = $(".hDivBox table thead tr").children("th").length;
            $('.trSelected td', $("#custTable")).each(
                function(i) {
                    var item = new String($(this).children('div').text());
                    item = item.Trim();
                    data[i]= item;
                    //console.log(i);
                    //console.log($(".hDivBox table thead tr").children("th").length);
                });
            //alert(data);
            //console.log(data.length);
            //console.log(data);
            var rowCount = data.length/rowsize;
            //console.log("rowCount:");
            //console.log(rowCount);
            if(rowCount > 1 || rowCount < 1){
                alert("请选中一行");
                return;
            }

            console.log(data);
            custview.setUICust(data);
            console.log("flexigrid row dbclick evnet end!");
        },

        // get cust info from ui.
        getUICust : function(){
          return {
              custno: $('#custno').val(),
              cardname:$('#cardname').val(),
              telephone: $('#telephone').val(),
              cablename:$('#cablename').val(),
              //cablecard:$('#cablecard').val(),
              address:$('#address').val(),
              cardtype:$('#cardtype').val(),
              cardno:$('#cardno').val(),
              stdid:$('#stdid').val(),
              icid:$('#icid').val(),
              remark:$('#remark').val()
          };
        },

        // set cust info to ui
        clearUICust :function(){
            $('#custno').val('');
            $('#cardname').val('');
            $('#telephone').val('');
            $('#cablename').val('');
            //$('#cablecard').val(');
            $('#address').val('');
            $('#cardtype').val('');
            $('#cardno').val('');
            $('#stdid').val('');
            $('#icid').val('');
            $('#remark').val('');
        },

        // set cust info to ui
        setUICust :function(uicust){
            $('#cardname').val(uicust[1]);
            $('#cardtype').val(uicust[2]);
            $('#cardno').val(uicust[3]);

            $('#custno').val(uicust[4]);
            $('#cablename').val(uicust[5]);
            $('#telephone').val(uicust[6]);

            //$('#cablecard').val(uicust[4]);
            $('#address').val(uicust[7]);

            $('#stdid').val(uicust[8]);
            $('#icid').val(uicust[9]);
            $('#remark').val(uicust[10]);
        },

        reduceQuery : function(){
            console.log('reduceQuery start');
            var opts = this.getUICust();

            var flexOpts = {
                query:JSON.stringify(opts),
                url:'/custs',
                method:'GET'
            };

            $('#custTable').flexOptions(flexOpts);
            $('#custTable').flexReload();

            console.log('reduceQuery end');
        },

        //create
        reduceSign : function(){
            console.log('reduceSign start');

            var self = this;

            //clear the cust.
            cust.clear({
                silent:true
            });
            console.log('clear after:',cust);

            // opts
            var opts = this.getUICust();
            console.log('opts:', opts);

            // save the cust to the server.
            cust.save(opts, {
                success: function(model, res){
                    cust.success(model.res);
                    self.clearUICust();
                },
                error:cust.error
            });

            console.log('reduceSign end');
        },

        //update
        reduceModify : function(){
            console.log('reduceModify start');

            var self = this;
            // opts
            var opts = this.getUICust();

            //change id
            cust.id = opts.custno;
            // save the cust to the server.

            cust.save(opts, {
                error: cust.error,
                success: function(model, res){
                    cust.success(model.res);
                    self.clearUICust();
                }
            });

            console.log('after modify:', cust);

            console.log('reduceModify end');
        },

        reduceDelete : function(){
            console.log('reduceDelete start');

            var self = this;

            console.log('before delete cust:', cust);
            var opts = this.getUICust();
            cust.id = opts.custno;

            console.log('before delete cust2:', cust);
            cust.destroy({
                success: function(model, res){
                    cust.success(model.res);
                    self.clearUICust();
                },
                error: cust.error
            });

            console.log('reduceDelete end');
        }
    });


    // instance CustView
    var custview = new CustView;

})(jQuery);


// reduce flexigrid.
(function($){
    //model
    var Reduce = Backbone.Model.extend({
        //defaults attributes
        defaults : function(){
            return {
                reduceid:null,
                custno:null,
                reducestartdate:null,
                reduceenddate:null,
                joinreducemount:null,
                joinreducetype:null,
                enjoyreducemount:null,
                enjoyreducetype:null,
                latereducemount:null,
                regdate:null,
                staffno:null,
                departmentno:null,
                updatedate:null
            };
        },

        // constructor
        initialize: function(atts){
            this.set(atts);
        },

        urlRoot : '/reduces',

        // validate
        validate : function(atts){
        },

        error:function(model, res){
            console.log('err');
            console.log(model);
            console.log(res);
            if(res.responseText){
                res = res.responseText;
            }
            alert(res);
        },

        success : function(model, res){
            console.log('success');
            console.log('model:',model);
            reduce.set(model);
            console.log(reduce.attributes);
            alert('操作成功');
        }

    });

    // an cust
    var reduce = new Reduce();

    //collection
    var Reduces = Backbone.Collection.extend({
        model:Reduce
    });

    //view
    var ReduceView = Backbone.View.extend({
        el: $('#reduce'),

        events : {
            "click #query": "reduceQuery",
            "click #sign" : "reduceSign",
            "click #modify" : "reduceModify",
            "click #delete" : "reduceDelete"
        },

        initialize : function(){

            var query = this.getUIReduce();
            var custno = (location.pathname).substr(10);
            console.log(custno);
            query.custno = custno;

            var opts = {
                dataType: 'json',
                method:'GET',
                url:'/reduces',
                query:JSON.stringify(query),
                colModel : [
                    {display: '操作日期', name : 'updatedate', width : 120, sortable : true, align: 'left'},
                    {display: '开始日期', name : 'reducestartdate', width : 120, sortable : true, align: 'left'},
                    {display: '截至日期', name : 'reduceenddate', width : 120, sortable : true, align: 'left'},
                    {display: '入网费减免', name : 'joinreducemount', width : 60, sortable : true, align: 'left'},
                    {display: '减免方式', name : 'joinreducetype', width : 60, sortable : true, align: 'left'},
                    {display: '收视费减免', name : 'enjoyreducemount', width : 60, sortable : true, align: 'left'},
                    {display: '减免方式', name : 'enjoyreducetype', width : 60, sortable : true, align: 'left'},
                    {display: '滞纳金减免', name : 'latereducemount', width : 60, sortable : true, align: 'left'},
                    {display: '操作员', name : 'staffno', width : 100, sortable : true, align: 'left'},
                    {display: '营业厅', name : 'departmentno', width : 100, sortable : true, align: 'left'},
                    {display: '标识', name : 'reduceid', width : 60, sortable : true, align: 'left'}
                ],
                pagestat: '显示 {from} 到 {to}，总共 {total} 条',
                sortname: "reducestartdate",
                sortorder: "asc",
                usepager: true,
                title: '减免信息',
                useRp: true,
                rp: 15,
                showTableToggleBtn: true,
                height: 180
            };

            $(".business #reduceTable").flexigrid(opts);
            $(".business #reduceTable").dblclick(this.flexigirdItemDBClick);

        },

        flexigirdItemDBClick:function(){
            console.log("flexigrid row dbclick event start!");

            //读取表格所选行数据
            var data = new Array();
            var rowsize = $(".hDivBox table thead tr").children("th").length;
            $('.trSelected td', $("#reduceTable")).each(
                function(i) {
                    var item = new String($(this).children('div').text());
                    item = item.Trim();
                    data[i]= item;
                    //console.log(i);
                    //console.log($(".hDivBox table thead tr").children("th").length);
                });
            //alert(data);
            //console.log(data.length);
            //console.log(data);
            var rowCount = data.length/rowsize;
            //console.log("rowCount:");
            //console.log(rowCount);
            if(rowCount > 1 || rowCount < 1){
                alert("请选中一行");
                return;
            }

            console.log(data);
            reduceview.setUIReduce(data);
            reduce.reduceid = data[10];

            console.log("flexigrid row dbclick evnet end!");
        },

        // get cust info from ui.
        getUIReduce : function(){
            return {
                reducestartdate: $('#reducestartdate').val(),
                reduceenddate:$('#reduceenddate').val(),
                joinreducemount: $('#joinreducemount').val(),
                joinreducetype:$('#joinreducetype').val(),
                enjoyreducemount:$('#enjoyreducemount').val(),
                enjoyreducetype:$('#enjoyreducetype').val(),
                latereducemount:$('#latereducemount').val()
            };
        },

        // clear cust info ui.
        clearUIReduce : function(){
            $('#reducestartdate').val('');
            $('#reduceenddate').val('');
            $('#joinreducemount').val('');
            $('#joinreducetype').val('');
            $('#enjoyreducemount').val('');
            $('#enjoyreducetype').val('');
            $('#latereducemount').val('');
        },

        // set cust info to ui
        setUIReduce :function(uireduce){
            $('#reducestartdate').val(uireduce[1]);
            $('#reduceenddate').val(uireduce[2]);
            $('#joinreducemount').val(uireduce[3]);
            $('#joinreducetype').val(uireduce[4]);
            $('#enjoyreducemount').val(uireduce[5]);
            $('#enjoyreducetype').val(uireduce[6]);
            $('#latereducemount').val(uireduce[7]);
        },

        reduceQuery : function(){
            console.log('reduceQuery start');
            var opts = this.getUIReduce();
            var custno = (location.pathname).substr(10);
            console.log(custno);
            opts.custno = custno;

            var flexOpts = {
                query:JSON.stringify(opts),
                url:'/reduces',
                method:'GET'
            };

            $('#reduceTable').flexOptions(flexOpts);
            $('#reduceTable').flexReload();

            console.log('reduceQuery end');
        },

        //create
        reduceSign : function(){
            console.log('reduceSign start');

            var self = this;

            //clear the cust.
            reduce.clear({
                silent:true
            });
            console.log('clear after:',reduce);

            // opts
            var opts = this.getUIReduce();
            if(!opts.enjoyreducemount){
                opts.enjoyreducemount = 0;
            }

            if(!opts.joinreducemount){
                opts.joinreducemount = 0;
            }

            if(!opts.latereducemount){
                opts.latereducemount = 0;
            }

            var custno = (location.pathname).substr(10);
            console.log(custno);
            opts.custno = custno;
            reduce.id = null; // it send the post

            console.log('opts:', opts);

            // save the cust to the server.
            reduce.save(opts, {
                success: function(model, res){
                    reduce.success(model.res);
                    self.clearUIReduce();
                },
                error:reduce.error
            });

            console.log('reduceSign end');
        },

        //update
        reduceModify : function(){
            console.log('reduceModify start', reduce);
            var self = this;
            // opts
            var opts = this.getUIReduce();
            var custno = (location.pathname).substr(10);
            console.log(custno);
            opts.custno = custno;
            opts.reduceid = reduce.reduceid;
            reduce.id = reduce.reduceid; //if the id is not null, will trigger update event.


            //change id
            //reduce.id = opts.reduceid;
            // save the cust to the server.
            reduce.save(opts, {
                error: reduce.error,
                success: function(model, res){
                    reduce.success(model.res);
                    self.clearUIReduce();
                }
            });

            console.log('after modify:', reduce);

            console.log('reduceModify end');
        },

        reduceDelete : function(){
            console.log('reduceDelete start');
            var self = this;

            console.log('before delete reduce:', reduce);
            var opts = this.getUIReduce();
            var custno = (location.pathname).substr(10);
            console.log(custno);
            opts.custno = custno;
            opts.reduceid = reduce.reduceid;
            reduce.id = reduce.reduceid;

            console.log('before delete reduce2:', reduce);
            reduce.destroy({
                success: function(model, res){
                    reduce.success(model.res);
                    self.clearUIReduce();
                },
                error: reduce.error
            });

            console.log('reduceDelete end');
        }
    });

    // instance CustView
    var reduceview = new ReduceView;

})(jQuery);


// stats flexigrid.
(function($){
    //model
    var Stat = Backbone.Model.extend({
        //defaults attributes
        defaults : function(){
            return {
                statedate:null,
                enddate:null,
                custno:null,
                name:null,
                staffno:null,
                cardtype:null,
                departmentno:null
            };
        },

        // constructor
        initialize: function(atts){
            this.set(atts);
        },

        urlRoot : '/custshis',

        // validate
        validate : function(atts){
        },

        error:function(model, res){
            console.log('err');
            console.log(model);
            console.log(res);
            if(res.responseText){
                res = res.responseText;
            }
            alert(res);
        }

    });

    // an stat
    var stat = new Stat();

    //collection
    var Stats = Backbone.Collection.extend({
        model:Stat
    });

    //view
    var StatView = Backbone.View.extend({
        el: $('#stat'),

        events : {
            "click #query": "statQuery"
            //"click #export" : "statExport"
        },

        initialize : function(){
            var opts = {
                dataType: 'json',
                method:'POST',
                colModel : [
                    {display: '开户日期', name : 'regdate', width : 60, sortable : true, align: 'left'},
                    {display: '证件姓名', name : 'cardname', width : 60, sortable : true, align: 'left'},
                    {display: '证件类别', name : 'cardtype', width : 60, sortable : true, align: 'left'},
                    {display: '证件号码', name : 'cardno', width : 60, sortable : true, align: 'left'},
                    {display: '有线证号', name : 'custno', width : 60, sortable : true, align: 'left'},
                    {display: '有线户名', name : 'cablename', width : 60, sortable : true, align: 'left'},
                    {display: '联系电话', name : 'telephone', width : 60, sortable : true, align: 'left'},
                    {display: '申请地址', name : 'address', width : 60, sortable : true, align: 'left'},
                    {display: 'IC卡号', name : 'icid', width : 60, sortable : true, align: 'left'},
                    {display: '机顶盒号', name : 'stdid', width : 60, sortable : true, align: 'left'},
                    {display: '用户备注', name : 'remark', width : 60, sortable : true, align: 'left'},

                    {display: '开始日期', name : 'reducestartdate', width : 120, sortable : true, align: 'left'},
                    {display: '截至日期', name : 'reduceenddate', width : 120, sortable : true, align: 'left'},
                    {display: '入网费减免', name : 'joinreducemount', width : 60, sortable : true, align: 'left'},
                    {display: '减免方式', name : 'joinreducetype', width : 60, sortable : true, align: 'left'},
                    {display: '收视费减免', name : 'enjoyreducemount', width : 60, sortable : true, align: 'left'},
                    {display: '减免方式', name : 'enjoyreducetype', width : 60, sortable : true, align: 'left'},
                    {display: '滞纳金减免', name : 'latereducemount', width : 60, sortable : true, align: 'left'},
                    {display: '操作员', name : 'staffno', width : 100, sortable : true, align: 'left'},
                    {display: '营业厅', name : 'departmentno', width : 100, sortable : true, align: 'left'},
                    {display: '减免日期', name : 'reduceregdate', width : 100, sortable : true, align: 'left'},
                ],
                pagestat: '显示 {from} 到 {to}，总共 {total} 条',
                sortname: "custno",
                sortorder: "asc",
                usepager: true,
                title: '减免信息',
                useRp: true,
                rp: 15,
                showTableToggleBtn: true,
                height: 180,
                preProcess : function(data){
                    console.log('preProcess start');

                    //console.log(data);

                    $('#totaljoinmount').text(data.totaljoinmount);
                    $('#totalenjoymount').text(data.totalenjoymount);
                    $('#totallatemount').text(data.totallatemount);
                    $('#totalcustcount').text(data.totalcustcount);

                    console.log('preProcess end');
                    return data;
                }
            };

            $("#statTable").flexigrid(opts);
        },

        // get stat info from ui.
        getUIStat : function(){
            return {
                startdate: $('#startdate').val(),
                enddate:$('#enddate').val(),
                custno:$('#custno').val(),
                cardname: $('#cardname').val(),
                cardtype:$('#cardtype').val(),
                staffno:$('#staffno').val(),
                departmentno:$('#departmentno').val()
            };
        },

        statQuery : function(){
            console.log('statQuery start');
            var opts = this.getUIStat();

            var flexOpts = {
                query:JSON.stringify(opts),
                url:'/custshis',
                method:'GET'
            };

            $('#statTable').flexOptions(flexOpts);
            $('#statTable').flexReload();

            console.log('statQuery end');
        }

        /*statExport : function(){
            console.log('statExport start');

            var opts = this.getUIStat();

            // get the data csv
            $.ajax({
                url:'export',
                type:'post',
                data:opts
            });

            console.log('statExport end');
        }*/
    });

    // instance StatView
    var statview = new StatView;

})(jQuery);



// staff flexigrid.
(function($){
    //model
    var Staff = Backbone.Model.extend({
        //defaults attributes
        defaults : function(){
            return {
                staffno:null,
                name:null,
                password:null,
                departmentno:null,
                rank:null,
                status:null
            };
        },

        // constructor
        initialize: function(atts){
            this.set(atts);
        },

        urlRoot : '/staffs',

        // validate
        validate : function(atts){
            if(!atts.staffno){
                return '员工编号不能为空';
            }

            if(!atts.name){
                return '员工姓名不能为空';
            }

            if(!atts.password){
                return '密码不能为空';
            }

            if(!atts.rank){
                return '等级不能为空';
            }

            if(!atts.status){
                return '状态不能为空';
            }

            if(!atts.departmentno){
                return '部门不能为空';
            }

        },

        error:function(model, res){
            console.log('err');
            console.log(model);
            console.log(res);
            if(res.responseText){
                res = res.responseText;
            }
            alert(res);
        },

        success: function(model, res){
            console.log('success');
            console.log('model:',model);
            staff.set(model);
            console.log(staff.attributes);
            alert('操作成功');
        }

    });

    // an cust
    var staff = new Staff();

    //collection
    var Staffs = Backbone.Collection.extend({
        model:staff
    });

    //view
    var StaffView = Backbone.View.extend({
        el: $('#staff'),

        events : {
            "click #query": "staffQuery",
            "click #sign" : "staffSign",
            "click #modify" : "staffModify",
            "click #delete" : "staffDelete"
        },

        initialize : function(){
            var opts = {
                dataType: 'json',
                method:'POST',
                colModel : [
                    {display: '员工编号', name : 'staffno', width : 60, sortable : true, align: 'center'},
                    {display: '员工姓名', name : 'name', width : 60, sortable : true, align: 'center'},
                    {display: '员工密码', name : 'password', width : 60, sortable : true, align: 'center'},
                    {display: '操作等级', name : 'rank', width : 60, sortable : true, align: 'center'},
                    {display: '当前状态', name : 'status', width : 60, sortable : true, align: 'center'},
                    {display: '所在部门编号', name : 'departmentno', width : 60, sortable : true, align: 'center'}
                ],
                pagestat: '显示 {from} 到 {to}，总共 {total} 条',
                sortname: "staffno",
                sortorder: "asc",
                usepager: true,
                title: '员工信息',
                useRp: true,
                rp: 15,
                showTableToggleBtn: true,
                height: 180
            };

            $("#staffTable").flexigrid(opts);
            $("#staffTable").dblclick(this.flexigirdItemDBClick);
        },

        flexigirdItemDBClick:function(){
            console.log("flexigrid row dbclick event start!");

            //读取表格所选行数据
            var data = new Array();
            var rowsize = $(".hDivBox table thead tr").children("th").length;
            $('.trSelected td', $("#staffTable")).each(
                function(i) {
                    var item = new String($(this).children('div').text());
                    item = item.Trim();
                    data[i]= item;
                    //console.log(i);
                    //console.log($(".hDivBox table thead tr").children("th").length);
                });
            //alert(data);
            //console.log(data.length);
            //console.log(data);
            var rowCount = data.length/rowsize;
            //console.log("rowCount:");
            //console.log(rowCount);
            if(rowCount > 1 || rowCount < 1){
                alert("请选中一行");
                return;
            }

            console.log(data);
            staffview.setUIStaff(data);
            console.log("flexigrid row dbclick evnet end!");
        },

        // get cust info from ui.
        getUIStaff : function(){
            return {
                staffno: $('#staffno').val(),
                name:$('#name').val(),
                password: $('#password').val(),
                rank:$('#rank').val(),
                status:$('#status').val(),
                departmentno:$('#departmentno').val()
            };
        },

        // set cust info to ui
        setUIStaff :function(uistaff){
            $('#staffno').val(uistaff[0]);
            $('#name').val(uistaff[1]);
            $('#password').val(uistaff[2]);
            $('#rank').val(uistaff[3]);
            $('#status').val(uistaff[4]);
            $('#departmentno').val(uistaff[5]);
        },

        staffQuery : function(){
            console.log('staffQuery start');
            var opts = this.getUIStaff();

            var flexOpts = {
                query:JSON.stringify(opts),
                url:'/staffs',
                method:'GET'
            };

            $('#staffTable').flexOptions(flexOpts);
            $('#staffTable').flexReload();

            console.log('staffQuery end');
        },

        //create
        staffSign : function(){
            console.log('staffSign start');

            //clear the staff
            staff.clear({
                silent:true
            });

            // opts
            var opts = this.getUIStaff();

            console.log('clear after:',staff);

            // save the cust to the server.
            staff.save(opts, {
                success: staff.success,
                error: staff.error
            });

            console.log('staffSign end');
        },

        //update
        staffModify : function(){
            console.log('staffModify start');
            // opts
            var opts = this.getUIStaff();

            //change id
            staff.id = opts.staffno;
            // save the cust to the server.

            staff.save(opts, {
                success: staff.success,
                error: staff.error
            });

            console.log('after modify:', staff);

            console.log('staffModify end');
        },

        staffDelete : function(){
            console.log('staffDelete start');

            console.log('before delete staff:', staff);
            var opts = this.getUIStaff();
            staff.id = opts.staffno;

            console.log('before delete cust2:', staff);
            staff.destroy({
                success:staff.success,
                error: staff.error
            });

            console.log('staffDelete end');
        }
    });

    // instance CustView
    var staffview = new StaffView;

})(jQuery);


// department flexigrid.
(function($){
    //model
    var Department = Backbone.Model.extend({
        //defaults attributes
        defaults : function(){
            return {
                departmentno:null,
                name:null,
                parentno:null
            };
        },

        // constructor
        initialize: function(atts){
            this.set(atts);
        },

        urlRoot : '/departments',

        // validate
        validate : function(atts){
            if(!atts.departmentno){
                return '部门编号不能为空';
            }
            if(!atts.name){
                return '部门名称不能为空';
            }
            if(!atts.parentno){
                return '隶属部门不能为空';
            }
        },

        error:function(model, res){
            console.log('err');
            console.log(model);
            console.log(res);
            if(res.responseText){
                res = res.responseText;
            }
            alert(res);
        },

        success:function(model, res){
            console.log('success');
            console.log('model:',model);
            department.set(model);
            console.log(department.attributes);
            alert('操作成功');
        }

    });

    // an department
    var department = new Department();

    //collection
    var Departments = Backbone.Collection.extend({
        model:department
    });

    //view
    var DepartmentView = Backbone.View.extend({
        el: $('#department'),

        events : {
            "click #query": "departmentQuery",
            "click #sign" : "departmentSign",
            "click #modify" : "departmentModify",
            "click #delete" : "departmentDelete"
        },

        initialize : function(){
            var opts = {
                dataType: 'json',
                method:'POST',
                colModel : [
                    {display: '部门编号', name : 'departmentno', width : 60, sortable : true, align: 'center'},
                    {display: '部门名称', name : 'name', width : 60, sortable : true, align: 'center'},
                    {display: '隶属部门编号', name : 'parentno', width : 60, sortable : true, align: 'center'}
                ],
                pagestat: '显示 {from} 到 {to}，总共 {total} 条',
                sortname: "departmentno",
                sortorder: "asc",
                usepager: true,
                title: '部门信息',
                useRp: true,
                rp: 15,
                showTableToggleBtn: true,
                height: 180
            };

            $("#departmentTable").flexigrid(opts);
            $("#departmentTable").dblclick(this.flexigirdItemDBClick);
        },

        flexigirdItemDBClick:function(){
            console.log("flexigrid row dbclick event start!");

            //读取表格所选行数据
            var data = new Array();
            var rowsize = $(".hDivBox table thead tr").children("th").length;
            $('.trSelected td', $("#departmentTable")).each(
                function(i) {
                    var item = new String($(this).children('div').text());
                    item = item.Trim();
                    data[i]= item;
                    //console.log(i);
                    //console.log($(".hDivBox table thead tr").children("th").length);
                });
            //alert(data);
            //console.log(data.length);
            //console.log(data);
            var rowCount = data.length/rowsize;
            //console.log("rowCount:");
            //console.log(rowCount);
            if(rowCount > 1 || rowCount < 1){
                alert("请选中一行");
                return;
            }

            console.log(data);
            departmentview.setUIDepartment(data);
            console.log("flexigrid row dbclick evnet end!");
        },

        // get cust info from ui.
        getUIDepartment : function(){
            return {
                departmentno: $('#departmentno').val(),
                name:$('#name').val(),
                parentno: $('#parentno').val() == null ? 0 : $('#parentno').val()
            };
        },

        // set department info to ui
        setUIDepartment :function(uidepartment){
            $('#departmentno').val(uidepartment[0]);
            $('#name').val(uidepartment[1]);
            $('#parentno').val(uidepartment[2]);
        },

        departmentQuery : function(){
            console.log('staffQuery start');
            var opts = this.getUIDepartment();

            var flexOpts = {
                query:JSON.stringify(opts),
                url:'/departments',
                method:'GET'
            };

            $('#departmentTable').flexOptions(flexOpts);
            $('#departmentTable').flexReload();

            console.log('departmentQuery end');
        },

        //create
        departmentSign : function(){
            console.log('departmentSign start');

            //clear the department
            department.clear({
                silent:true
            });

            // opts
            var opts = this.getUIDepartment();

            console.log('clear after:',department);

            // save the cust to the server.
            department.save(opts, {
                success: department.success,
                error: department.error
            });

            console.log('departmentSign end');
        },

        //update
        departmentModify : function(){
            console.log('departmentModify start');
            // opts
            var opts = this.getUIDepartment();

            //change id
            department.id = opts.departmentno;
            // save the cust to the server.

            department.save(opts, {
                success: department.success,
                error: department.error
            });

            console.log('after modify:', department);

            console.log('departmentModify end');
        },

        departmentDelete : function(){
            console.log('departmentDelete start');

            console.log('before delete department:', department);
            var opts = this.getUIDepartment();
            department.id = opts.departmentno;

            console.log('before delete department2:', department);
            department.destroy({
                success: department.success,
                error: department.error
            });

            console.log('departmentDelete end');
        }
    });

    // instance CustView
    var departmentview = new DepartmentView;

})(jQuery);





/* string object extend */
String.prototype.Trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.LTrim = function(){
    return this.replace(/(^\s*)/g, "");
}

String.prototype.RTrim = function(){
    return this.replace(/(\s*$)/g, "");
}



