Ext.define("core.systemset.jobinfo.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.systemset.jobinfo.mainlayout',
    
    requires: [   
    	"core.systemset.jobinfo.controller.MainController",
        "core.systemset.jobinfo.view.MainLayout",
        "core.systemset.jobinfo.view.DetailLayout",
        "core.systemset.jobinfo.view.MainGrid",
        "core.systemset.jobinfo.view.DetailForm"
    ],
    
    /** 关联此视图控制器 */
    controller: 'systemset.jobinfo.maincontroller',
    /** 页面代码定义 */
    funCode: "jobinfo_main",
    detCode: "jobinfo_detail",
    detLayout: "systemset.jobinfo.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'systemset.jobinfo.othercontroller',
    layout:'border',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BaseJob", //请求Action 
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'jobName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        	addTitle:'添加职位',
        	editTitle:'编辑职位',
        	detailTitle:'职位详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "systemset.jobinfo.maingrid",
        region: "center"
    }]
})