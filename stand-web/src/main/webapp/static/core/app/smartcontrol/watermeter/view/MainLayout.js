Ext.define("core.smartcontrol.watermeter.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.watermeter.mainlayout',

    requires: [   
        "core.smartcontrol.watermeter.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'smartcontrol.watermeter.maincontroller',

	funCode: "watermeter_main",
	detCode: 'watermeter_detail',
	detLayout: 'smartcontrol.watermeter.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'smartcontrol.watermeter.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BasePtSkMeter", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加水控流量计',
            editTitle:'编辑水控流量计',
            detailTitle:'水控流量计详情',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:'smartcontrol.watermeter.detailhtml',	//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1000,
    scrollable:true,
    layout:'fit',

	items: [ {
		xtype: "smartcontrol.watermeter.maingrid",
		region: "center",
		
	}]
})
