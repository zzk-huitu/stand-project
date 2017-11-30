Ext.define("core.system.user.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.system.user.detailhtml",
    layout: "form", 
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    items: [{
        xtype: 'container',
        ref: 'userBaseInfo',
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classInfo">',
            '<div class="trainClass_title">用户基本信息：</div>',
            '<ul>' ,
            '<li style="width:50%" title="{userName}">用户名：{userName}</li>',
            '<li style="width:50%" title="{xm}">真实姓名：{xm}</li>',
            '<li style="width:50%">性别：',
            '<tpl if="xbm==1">男<tpl elseif="xbm==2">女</tpl></li>',
            '<li style="width:50%" title="{category}">身份：{category}</li>',
            '<li style="width:50%" title="{userNumb}">工号/学号：{userNumb}</li>',
            '<li style="width:50%" title="{sfzjh}">身份证件号：{sfzjh}</li>',
            '<li style="width:50%" title="{zzmmm}">政治面貌：{zzmmm}</li>',
            '<li style="width:50%" title="{zxxbzlb}">编制：{zxxbzlb}</li>',
            '<li style="width:50%" title="{date}">出生日期：{date}</li>',
            '<li style="width:50%" title="{mobile}">移动电话：{mobile}</li>',
            '<li style="width:50%" title="{dzxx}">电子邮箱：{dzxx}</li>',
            '<li style="width:50%">账号状态：',
            '<tpl if="state == 0">正常<tpl else>锁定</tpl></li>',
            '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
            '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }, {
        xtype: 'container',
        ref: "userDetailInfo",
        tpl: new Ext.XTemplate(
            '<div class="trainClass_classTraineeInfo">',
            '<div class="trainClass_title">用户角色管理：</div>',
            '<ul class="trainClass_gridUl" style="max-height: 400px;">',
            '<li>',
            '<span style="width:20%" data-align="center">角色编码</span><span style="width:20%" data-align="center">角色名称</span>' ,
            '<span style="width:10%" data-align="center">是否系统角色</span><span style="width:30%" data-align="center">remark</span>' ,
            '{% if (values.rows.length == 0) %}',
            '<li style="width:100%;font-size: 14px;font-weight: 400;text-align: center;line-height: 100px;">此用户暂无角色...</li>',
            '{% if (values.rows.length == 0 ) return  %}',   //reutrun 表示不执行下面的了，在for里面可以使用break、continue
            '<tpl for="rows">',
            '<li>' ,
            '<span style="width: 20%;" >{roleCode}</span><span style="width: 20%;">{roleName}</span>',
            '<tpl if="issystem==0">',
            '<span style="width: 10%;color:red;" >否</span>' ,
            '<tpl else>',
            '<span style="width: 10%;color: green;" >是</span>' ,
            '</tpl>' ,
            '<span style="width: 30%;" >{remark}</span>',
            '</li>',
            '</tpl>',
            '<div style="clear:both"></div>',
            '</ul>',
            '</div>'
        ),
        data: {}
    }]
  
});