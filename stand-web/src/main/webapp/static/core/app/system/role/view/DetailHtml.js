Ext.define("core.system.role.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.system.role.detailhtml",

    //bodyPadding: '0 10 10 0',
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'roleInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">角色基本信息：</div>',
            '<ul>' ,
            '<li style="width:50%" title="{roleName}">角色名称：{roleName}</li>',
            '<li style="width:50%" title="{roleCode}">角色编码：{roleCode}</li>',
            '<li style="width:50%" title="{remark}">角色说明：{remark}</li>',
            '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
            '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "roleUser",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">角色用户列表：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li><span style="width:5%">序号</span>',
            '<span style="width:10%" data-align="center">编号</span><span style="width:10%" data-align="center">用户名</span>' ,
            '<span style="width:10%" data-align="center">姓 名</span><span style="width:10%" data-align="center">性 别</span>' ,
            '<span style="width:20%" data-align="center">部 门</span><span style="width:20%" data-align="center">岗 位</span>' ,
            '<span style="width:10%" data-align="center">账户状态</span></li>',
            '{% if (values.rows.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此角色暂无用户...</li>',
            '{% if (values.rows.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="rows">',
            '<li><span style="width:5%">{[xindex]}</span><span style="width: 10%;" >{userNumb}</span><span style="width: 10%;">{userName}</span>' ,
            '<span style="width: 10%;">{xm}</span>',
            '<span style="width: 10%;"><tpl if="xbm == 1">男<tpl elseif="xbm==2">女<tpl else></tpl></span>',
            '<span style="width: 20%;">{deptName}</span><span style="width: 20%;">{jobName}</span>' ,
            '<tpl if="state==0">',
            '<span style="width: 10%;color:green;" >正常</span>' ,
            '<tpl else>',
            '<span style="width: 10%;color: red;" >锁定</span>' ,
            '</tpl>' ,
            '</li>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
});
