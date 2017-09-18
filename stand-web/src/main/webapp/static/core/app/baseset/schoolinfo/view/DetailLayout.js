Ext.define("core.baseset.schoolinfo.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.baseset.school.detaillayout',
	funCode:"school_detail",
	funData: {
		action: comm.get('baseUrl') + "/BaseSchool", //请求Action
	
		pkName: "uuid"
		// defaultObj: {
		// 	 actBegin: new Date(),
		// 	 signBeing:new Date()
		// }
	},
	
	minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'baseset.schoolinfo.detailcontroller',

	layout:'fit',
	items: [{
		xtype: "baseset.schoolinfo.detailform"
	}]
})