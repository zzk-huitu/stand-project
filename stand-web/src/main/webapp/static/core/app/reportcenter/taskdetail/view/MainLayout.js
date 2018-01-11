

Ext.define("core.reportcenter.taskdetail.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.reportcenter.taskdetail.mainlayout',
    
    requires: [   
        "core.reportcenter.taskdetail.controller.MainController"
    ],
    
    /** 关联此视图控制器 */
    controller: 'reportcenter.taskdetail.maincontroller',
    /** 页面代码定义 */
    funCode: "taskdetail_main",
    detCode: 'taskdetail_detail',
    detLayout: 'reportcenter.taskdetail.detaillayout',   
    

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'reportcenter.taskdetail.othercontroller',
 
    funData: {
        action: comm.get('baseUrl') + "/PtTask", //请求Action 
        pkName: "uuid",
        defaultObj: {
         },
       tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'',
            editTitle:'',
            detailTitle:''
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "reportcenter.taskdetail.maingrid"
    }]
})