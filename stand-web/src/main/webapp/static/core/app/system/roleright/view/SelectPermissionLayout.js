
Ext.define("core.system.roleright.view.SelectPermissionLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.roleright.selectpmslayout',
    funCode: "selectpms_detail",
    border: false,
    //funData用来定义一些常规的参数
    funData: {
        action: comm.get('baseUrl') + "/SysRole", //请求controller
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },
    layout: 'border',
    items: [{
        xtype:'system.roleright.permissiongrid',
        width: 650,
        region: "west",
        margin:'5',
    }, {
        xtype: "system.roleright.selectedpermissiongrid",
        region: "center",
        margin:'5',
    }]
})