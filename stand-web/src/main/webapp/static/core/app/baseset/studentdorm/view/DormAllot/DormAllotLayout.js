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

    minWidth:1200,
    scrollable:'x',
    layout:'border',
    items: [{
        xtype:'baseset.studentdorm.dormallottree',
        region: "west",
        width: 250,
        //split:true,
        margin:'0 10 0 0'
    },{
        xtype:'baseset.studentdorm.classdormgrid',
        region: "center",
        flex:1,
        split:true,
        //margin:'5'
    }, {
        xtype: "baseset.studentdorm.dormnotallotgrid",
        flex:1,
        region: "east",
        minWidth:350,
        split:true,
        //margin:'5'
    },{
        xtype: "baseset.studentdorm.dormallotfinishgrid",
        flex:1.5,
        minWidth:350,
        region: "east",
        split:true,
        //margin:'5'
    }]
})
