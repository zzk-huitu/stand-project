

Ext.define("core.systemset.campus.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.systemset.campus.mainlayout',
    
    requires: [   
        "core.systemset.campus.controller.MainController"
    ],
    
    /** 关联此视图控制器 */
    controller: 'systemset.campus.maincontroller',
    /** 页面代码定义 */
    funCode: "campus_main",
    detCode: 'campus_detail',
    detLayout: 'systemset.campus.detaillayout',    

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'systemset.campus.othercontroller',
 
    funData: {
        action: comm.get('baseUrl') + "/BaseCampus", //请求Action 
        pkName: "uuid",
        defaultObj: {
            // schoolId: comm.get("schoolId"),
            // schoolName: comm.get("schoolName"),
            // orderIndex:1
        },
        excelInfo: {
            excelFields: [{
                name: "校区代码",
                code: "campusCode"
            }, {
                name: "校区名称",
                code: "campusName"
            }, {
                name: "校区地址",
                code: "campusAddr"
            }, {
                name: "校区联系电话",
                code: "campusPhone"
            }]
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'campusName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加校区',
            editTitle:'编辑校区',
            detailTitle:'校区详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    layout:'fit',
    items: [{
        xtype: "systemset.campus.maingrid"
    }]
})