Ext.define("core.baseset.studentdorm.view.AdjustDormLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.studentdorm.adjustdormlayout',
    funCode: "adjustdorm_detail",
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
        xtype:'baseset.studentdorm.mixdormgrid',
        region: "west",
        width: comm.get("clientWidth") * 0.28,
        margin:'5'
    },{
        xtype:'baseset.studentdorm.emptymixdormgrid',
        region: "center",
        margin:'5'
    }, {
        xtype: "baseset.studentdorm.notallotstugrid",
        width: comm.get("clientWidth") * 0.3,
        region: "east",
        margin:'5'
    }]
})
