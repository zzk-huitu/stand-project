Ext.define("core.system.roleright.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.roleright.detaillayout',

    controller: 'system.roleright.detailcontroller',

    funCode: "roleright_selectmenu",
    funData: {
        action: comm.get('baseUrl') + "/SysRole", //请求Action
        pkName: "uuid",
        defaultObj: {}
    },
    layout:'fit',
    items: [{
        xtype: "system.roleright.selectmenugrid",
        flex:1
    }]
})