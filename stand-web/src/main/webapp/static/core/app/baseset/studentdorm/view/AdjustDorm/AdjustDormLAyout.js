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
        minWidth: 500,
        flex:1.5,
        split:true,      
    },{
        xtype:'baseset.studentdorm.emptymixdormgrid',
        region: "center",
        flex:1.2,
        split:true,
        //margin:'5'
    }, {
        xtype: "baseset.studentdorm.notallotstugrid",
        minWidth: 350,
        region: "east",
        flex:1,
        split:true,
        //margin:'5'
    }]
})
