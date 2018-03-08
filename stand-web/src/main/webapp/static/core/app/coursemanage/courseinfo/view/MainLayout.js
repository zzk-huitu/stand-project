Ext.define("core.coursemanage.courseinfo.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.coursemanage.courseinfo.mainlayout",
    funCode: "courseinfo_main",
    detCode: "courseinfo_detail",
    detLayout: "coursemanage.courseinfo.detaillayout",
    /** 关联此视图控制器 */
    controller: 'coursemanage.courseinfo.maincontroller',
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'coursemanage.courseinfo.othercontroller',
    funData: {
        action: comm.get("baseUrl") + "/BaseCourse", //请求Action
        pkName: "uuid",
        defaultObj: {
            inBefore: 30,
            beLate: 5,
            absenteeism: 10
        },
        tabConfig:{         
            titleField:'courseName',  
            addTitle:'添加课程',
            editTitle:'编辑课程',
            detailTitle:'课程详情'
        }
    },
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "coursemanage.courseinfo.maingrid",
    }]
})