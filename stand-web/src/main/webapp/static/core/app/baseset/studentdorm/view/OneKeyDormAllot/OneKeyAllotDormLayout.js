 Ext.define("core.baseset.studentdorm.view.OneKeyAllotDormLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.studentdorm.onekeyallotdormlayout',
    funCode: "onekeyallotdorm_detail",
    funData: {
        action: comm.get('baseUrl') + "/BaseStudentDorm", //请求controller
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },

    minWidth:1000,
    scrollable:'x',
    layout: 'border',
    items : [{  
        xtype: 'baseset.studentdorm.dormallotdetailgrid',
        height: 100,
        padding:0,  
        region : 'north', 
    },{ 
        xtype : 'baseset.studentdorm.boydormgrid',  
        region : 'west',  
        flex : 1,
        margin:'5' ,
    },{ 
       region : 'center',  
       xtype: 'baseset.studentdorm.girldormgrid',
       flex : 1,
       margin:'5',
   }] 
})
