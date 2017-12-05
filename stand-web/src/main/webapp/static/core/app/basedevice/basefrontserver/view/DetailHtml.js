Ext.define("core.basedevice.basefrontserver.view.DetailHtml", {
    extend: "Ext.Container",
    alias: "widget.basedevice.basefrontserver.detailhtml",
    layout: "form", 
    margin: '0 0 0 10',
    scrollable: true,
    width: '100%',
    tpl: new Ext.XTemplate(
        '<div class="trainClass_classInfo">',
        '<div class="trainClass_title">服务器详情：</div>',
        '<ul>' ,
        '<li style="width:50%" title="{frontServerName}">名称：{frontServerName}</li>',
        '<li style="width:50%" title="{frontServerIp}">服务IP：{frontServerIp}</li>',
        '<li style="width:50%" title="{frontServerPort}">服务端口；{frontServerPort}</li>',
        '<li style="width:50%" title="{frontServerUrl}">请求的URL：{frontServerUrl}</li>',
        '<li style="width:50%" title="{createTime}">创建时间：{createTime}</li>',
        '<li style="width:50%" title="{createUser}">创建人：{createUser}</li>',
        '<li style="width:50%">状态：',
        '<tpl if="frontServerStatus==0">',
        '<span style="width: 10%;color:green;" >启用</span>' ,
        '<tpl else>',
        '<span style="width: 10%;color: red;" >禁用</span>' ,
        '</tpl>',
        '</li>',
        '<li style="width:50%" title="{textarea}">备注：{textarea}</li>',
        '<div style="clear:both"></div>',
        '</ul>',
        '</div>'
        ),
    data: {}
});