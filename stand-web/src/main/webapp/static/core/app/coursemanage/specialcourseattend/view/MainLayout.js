Ext.define("core.coursemanage.specialcourseattend.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.coursemanage.specialcourseattend.mainlayout",
    funCode: "specialcourseattend_main",
    detCode: "specialcourseattend_detail",
    detLayout: "coursemanage.specialcourseattend.detaillayout",
    /** 关联此视图控制器 */
    controller: 'coursemanage.specialcourseattend.maincontroller',
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'coursemanage.specialcourseattend.othercontroller',
    funData: {
        action: comm.get("baseUrl") + "/AttendTitle", //请求Action
        pkName: "uuid",
        defaultObj: {
            inBefore: 30,
            beLate: 5,
            absenteeism: 10
        },
        tabConfig:{         
            titleField:'titleName',  
            addTitle:'添加考勤主题',
            editTitle:'编辑考勤主题',
            detailTitle:'考勤主题详情'
        },    
        width:600,
        height:200
    },
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "coursemanage.specialcourseattend.maingrid",
    }]
})