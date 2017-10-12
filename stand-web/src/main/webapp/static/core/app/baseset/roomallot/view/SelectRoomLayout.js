 

Ext.define("core.baseset.roomallot.view.SelectRoomLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.roomallot.selectroomlayout',
    funCode: "roomallot_detail",
    border: false,
    funData: {
        action: comm.get('baseUrl') + "/BaseOfficeAllot", //请求controller
        whereSql: "", //表格查询条件
        orderSql: "", //表格排序条件
        filter: "", //表格过滤条件
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },

    minWidth:1000,
    scrollable:'x',
    layout:'border',
    items: [{
        xtype:'baseset.roomallot.selectroomgrid',
        region: "west",
        width: comm.get("clientWidth") * 0.45,
        margin:'5'
    }, {
        xtype: "baseset.roomallot.isselectroomgrid",
        region: "center",
        margin:'5'
    }]
})
