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
	detLayout: 'baseset.roomallot.selectteacherlayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.roomallot.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseOfficeAllot", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "baseset.roomallot.roomallottree",
		region: "west",
		split:true,
		width:250
		//width: comm.get("clientWidth") * 0.2
	}, {
		xtype: "baseset.roomallot.maingrid",
		region: "center",
		
	}]
})
