Ext.define("core.system.appupdate.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.appupdate.mainlayout',
    funCode: "appupdate_main",
    detCode: 'appupdate_detail',
    detLayout: 'system.appupdate.detaillayout',
    funData: {
        action: comm.get('baseUrl') + "/SysAppinfo", //请求Action
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'appTitle',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'APP上传',
            editTitle:'',
            detailTitle:''
        }
    },
    requires: [    
        "core.system.appupdate.controller.MainController",
    ],
      /*关联此视图控制器*/
    controller: 'system.appupdate.maincontroller',
    
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'system.appupdate.othercontroller',

    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "system.appupdate.maingrid",        
    }]
  
});