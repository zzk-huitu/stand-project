

Ext.define("core.reportcenter.sbxx.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.reportcenter.sbxx.mainlayout',
    
    requires: [   
        "core.reportcenter.sbxx.controller.MainController"
    ],
    
    /** 关联此视图控制器 */
    controller: 'reportcenter.sbxx.maincontroller',
    /** 页面代码定义 */
    funCode: "sbxx_main",
    detCode: 'sbxx_detail',
    detLayout: 'reportcenter.sbxx.detaillayout',   
    

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'reportcenter.sbxx.othercontroller',
 
    funData: {
        action: comm.get('baseUrl') + "/BasePtTerm", //请求Action 
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
        xtype: "reportcenter.sbxx.maingrid"
    }]
})