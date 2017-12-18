Ext.define("core.system.jobinfo.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.jobinfo.mainlayout',
    
    requires: [   
    	"core.system.jobinfo.controller.MainController",
        "core.system.jobinfo.view.MainLayout",
        "core.system.jobinfo.view.DetailLayout",
        "core.system.jobinfo.view.MainGrid",
        "core.system.jobinfo.view.DetailForm"
    ],
    
    /** 关联此视图控制器 */
    controller: 'system.jobinfo.maincontroller',
    /** 页面代码定义 */
    funCode: "jobinfo_main",
    detCode: "jobinfo_detail",
    detLayout: "system.jobinfo.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'system.jobinfo.othercontroller',
    layout:'fit',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/SysJob", //请求Action 
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'jobName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        	addTitle:'添加岗位',
        	editTitle:'编辑岗位',
        	detailTitle:'岗位详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "system.jobinfo.maingrid"
    }]
})