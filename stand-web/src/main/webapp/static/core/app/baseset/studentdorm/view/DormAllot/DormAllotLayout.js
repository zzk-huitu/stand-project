Ext.define("core.baseset.studentdorm.view.DormAllotLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.studentdorm.dormallotLayout',
    funCode: "dormallot_detail",
    funData: {
        action: comm.get('baseUrl') + "/BaseStudentDorm", //请求controller
        pkName: "uuid", //主键
        defaultObj: {
        }
    },

    minWidth:1000,
    scrollable:'x',
    layout:'border',
    items: [{
        xtype:'baseset.studentdorm.dormallottree',
        region: "west",
        width: comm.get("clientWidth") * 0.17,
        margin:'5'
    },{
        xtype:'baseset.studentdorm.classdormgrid',
        region: "center",
        margin:'5'
    }, {
        xtype: "baseset.studentdorm.dormnotallotgrid",
        width: comm.get("clientWidth") * 0.40,
        region: "east",
        margin:'5'
    }]
})
