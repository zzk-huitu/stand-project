Ext.define("core.baseset.roomdefine.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.roomdefine.mainlayout',

    requires: [   
        "core.baseset.roomdefine.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.roomdefine.maincontroller',

	funCode: "roomdefine_main",
	detCode: 'roomdefine_detail',
	detLayout: 'baseset.roomdefine.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.roomdefine.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseRoomdefine", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roomName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'房间设置',
            editTitle:'编辑宿舍',
            detailTitle:'宿舍详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "baseset.roomdefine.roomdefinetree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "baseset.roomdefine.maingrid",
		region: "center",
		
	}]
})
