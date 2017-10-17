 

Ext.define("core.baseset.roomallot.view.SelectTeacherLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.roomallot.selectteacherlayout',
    funCode: "roomallot_detail",
    border: false,
    funData: {
        action: comm.get('baseUrl') + "/BaseOfficeAllot", //请求controller
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },

    minWidth:1200,
    scrollable:'x',
    layout:'border',
    items: [{
        xtype:'baseset.roomallot.selectteachergrid',
        region: "west",
        width: comm.get("clientWidth") * 0.43,
        margin:'5'
    }, {
        xtype: "baseset.roomallot.isselectteachergrid",
        region: "center",
        margin:'5'
    }]
})
