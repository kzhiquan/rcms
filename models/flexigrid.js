

function Flexigrid(){
    this.page = null;
    this.total = null;
    this.rows = null;
};


Flexigrid.prototype.setPage = function(page){
    this.page = page;
};



Flexigrid.prototype.setTotal = function(total){
    this.total = total;
};



Flexigrid.prototype.setStaffRows = function(users){
    this.rows = [];
    for(var i in users){
        var row = {
            id : users[i].id,
            cell : {
                staff_no : users[i].no,
                name : users[i].name,
                rank : users[i].rank,
                password : users[i].password,
                department : users[i].department
            }
        };
        this.rows.push(row);
    }
}



Flexigrid.prototype.setCustRows = function(custs){
    this.rows = [];
    for(var i in custs){
        var row = {
            id : custs[i].custid,
            cell : {
                custno : '<a href=\"business\/' + custs[i].custno + '\">' + custs[i].custno + '</a>',
                cardname : custs[i].cardname,
                address : custs[i].address,
                telephone : custs[i].telephone,
                cablename : custs[i].cablename,
                cablecard : custs[i].cablecard,
                cardtype : custs[i].cardtype,
                cardno : custs[i].cardno,
                stdid : custs[i].stdid,
                icid : custs[i].icid,
                remark : custs[i].remark,
                regdate: custs[i].regdate.getFullYear() + '/'+(custs[i].regdate.getMonth()+1) + '/'+custs[i].regdate.getDate()+ ' '+ custs[i].regdate.toLocaleTimeString(),
                updatedate: custs[i].updatedate.getFullYear() + '/'+ (custs[i].updatedate.getMonth()+1) + '/'+ custs[i].updatedate.getDate()+ ' '+ custs[i].updatedate.toLocaleTimeString(),
                staffno:custs[i].staffno,
                departmentno: custs[i].departmentno,
                opertype: custs[i].opertype
            }
        };
        this.rows.push(row);
    }
};



Flexigrid.prototype.setStatRows = function(stats){
    this.rows = [];
    for(var i in stats){
        var tempregdate = stats[i].regdate.getFullYear() + '/'+(stats[i].regdate.getMonth()+1) + '/'+stats[i].regdate.getDate()+ ' '+ stats[i].regdate.toLocaleTimeString();
        var tempreducestartdate = stats[i].reducestartdate.getFullYear() + '/'+(stats[i].reducestartdate.getMonth()+1) + '/'+stats[i].reducestartdate.getDate()+ ' '+ stats[i].reducestartdate.toLocaleTimeString();
        var tempreduceendate = stats[i].reduceenddate.getFullYear() + '/'+(stats[i].reduceenddate.getMonth()+1) + '/'+stats[i].reduceenddate.getDate()+ ' '+ stats[i].reduceenddate.toLocaleTimeString();
        var tempreduceregdate = stats[i].reduceregdate.getFullYear() + '/'+(stats[i].reduceregdate.getMonth()+1) + '/'+stats[i].reduceregdate.getDate()+ ' '+ stats[i].reduceregdate.toLocaleTimeString();
        var row = {
            id : i,
            cell : {
                regdate : tempregdate,
                cardname : stats[i].cardname,
                cardtype : stats[i].cardtype,
                cardno : stats[i].cardno,
                custno : stats[i].custno,
                cablename : stats[i].cablename,
                telephone : stats[i].telephone,
                address : stats[i].address,
                icid : stats[i].icid,
                stdid : stats[i].stdid,
                remark : stats[i].remark,

                reducestartdate : tempreducestartdate,
                reduceenddate : tempreduceendate,
                joinreducemount : stats[i].joinreducemount,
                joinreducetype : stats[i].joinreducetype,
                enjoyreducemount : stats[i].enjoyreducemount,
                enjoyreducetype : stats[i].enjoyreducetype,

                latereducemount : stats[i].latereducemount,

                staffno : stats[i].staffno,
                departmentno : stats[i].departmentno,
                reduceregdate : tempreduceregdate
            }
        };
        this.rows.push(row);
    }
};



Flexigrid.prototype.setReduceRows = function(reduces){
    this.rows = [];
    for(var i in reduces){
        var row = {
            id : reduces[i].reduceid,
            cell : {
                reduceid:reduces[i].reduceid,
                reducestartdate : reduces[i].reducestartdate.getFullYear() + '-'+(reduces[i].reducestartdate.getMonth()+1) + '-'+reduces[i].reducestartdate.getDate()+ ' '+ reduces[i].reducestartdate.toLocaleTimeString(),
                reduceenddate : reduces[i].reduceenddate.getFullYear() + '-'+ (reduces[i].reduceenddate.getMonth()+1) + '-'+ reduces[i].reduceenddate.getDate()+ ' '+ reduces[i].reduceenddate.toLocaleTimeString(),
                joinreducemount : reduces[i].joinreducemount,
                joinreducetype : reduces[i].joinreducetype,
                enjoyreducemount : reduces[i].enjoyreducemount,
                enjoyreducetype : reduces[i].enjoyreducetype,
                latereducemount : reduces[i].latereducemount,
                regdate: reduces[i].regdate.getFullYear() + '-'+(reduces[i].regdate.getMonth()+1) + '-'+reduces[i].regdate.getDate()+ ' '+ reduces[i].regdate.toLocaleTimeString(),
                updatedate: reduces[i].updatedate.getFullYear() + '-'+ (reduces[i].updatedate.getMonth()+1) + '-'+ reduces[i].updatedate.getDate()+ ' '+ reduces[i].updatedate.toLocaleTimeString(),
                staffno:reduces[i].staffno,
                departmentno: reduces[i].departmentno
            }
        };
        this.rows.push(row);
    }
};



Flexigrid.prototype.setStaffRows = function(staffs){
    this.rows = [];
    for(var i in staffs){
        var row = {
            id : staffs[i].staffid,
            cell : {
                staffno : staffs[i].staffno,
                name : staffs[i].name,
                password : staffs[i].password,
                rank : staffs[i].rank,
                status : staffs[i].status,
                departmentno : staffs[i].departmentno
            }
        };
        this.rows.push(row);
    }
};



Flexigrid.prototype.setDepartmentRows = function(departments){
    this.rows = [];
    for(var i in departments){
        var row = {
            id : departments[i].departmentid,
            cell : {
                departmentno : departments[i].departmentno,
                name : departments[i].name,
                parentno : departments[i].parentno
            }
        };
        this.rows.push(row);
    }
};


exports = module.exports = Flexigrid;