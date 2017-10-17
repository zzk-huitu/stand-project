 

Ext.define("core.baseset.studentdorm.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.studentdorm.detaillayout',
    funCode: "studentdorm_detail",
    funData: {
        action: comm.get('baseUrl') + "/BaseStudentDorm", //请求controller
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },

    minWidth:1000,
    scrollable:'x',
    layout:'border',
    items: [{
        xtype:'baseset.studentdorm.dormallotgrid',
        region: "west",
        width: comm.get("clientWidth") * 0.4,
        margin:'5'
    }, {
        xtype: "baseset.studentdorm.dormnotallotgrid",
        region: "center",
        margin:'5'
    }]
})
