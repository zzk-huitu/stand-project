Ext.define("core.baseset.calendar.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.calendar.mainlayout',

    requires: [   
        "core.baseset.calendar.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.calendar.maincontroller',

	funCode: "calendarMian_main",
	detCode: 'calendarMain_detail',
	detLayout: 'baseset.calendar.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.calendar.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseCalenderdetail", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'jcName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加作息时间',
            editTitle:'编辑作息时间',
            detailTitle:'作息时间详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',
	items: [{
		xtype: "baseset.calendar.calendargrid",
		region: "west",
		split:true,
		width: 600,
	}, {
		xtype: "baseset.calendar.maingrid",
		region: "center",
	}]
})
