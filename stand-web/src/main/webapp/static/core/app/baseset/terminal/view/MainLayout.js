Ext.define("core.baseset.terminal.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.baseset.terminal.mainlayout",
    requires: [  
    	"core.baseset.terminal.controller.MainController",
        "core.baseset.terminal.view.DetailLayout",
        "core.baseset.terminal.view.MainGrid",
        "core.baseset.terminal.view.DetailForm",
   
    ],
    
    controller: 'baseset.terminal.maincontroller',
    
    otherController:'baseset.terminal.othercontroller',
    funCode: "terminal_main",
    detCode: "terminal_detail",
    detLayout: "baseset.terminal.detaillayout",
    funData: {
        action: comm.get("baseUrl") + "/BaseInfoterm", //请求Action
        pkName: "uuid",
        defaultObj: {
            beforeNumber:1,
            termCount:30,
            termType:"1"
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'termCode',
        	addTitle:'添加终端',
        	editTitle:'编辑终端',
        	detailTitle:'终端详情'
        }
    },
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "baseset.terminal.maingrid"
    }]
})