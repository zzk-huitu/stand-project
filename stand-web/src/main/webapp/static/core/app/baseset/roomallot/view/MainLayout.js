Ext.define("core.baseset.roomallot.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.roomallot.mainlayout',

    requires: [   
        "core.baseset.roomallot.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.roomallot.maincontroller',

	funCode: "roomallot_main",
	detCode: 'roomallot_detail',
	detLayout: 'baseset.roomallot.selectroomlayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.roomallot.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseOfficeAllot", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roomName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'教室列表',
            editTitle:'',
            detailTitle:''
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "baseset.roomallot.roomallottree",
		region: "west",
		split:true,
		width: comm.get("clientWidth") * 0.18
	}, {
		xtype: "baseset.roomallot.maingrid",
		region: "center",
		
	}]
})
