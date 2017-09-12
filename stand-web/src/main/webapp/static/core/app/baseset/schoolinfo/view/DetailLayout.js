Ext.define("core.systemset.schoolinfo.view.schoolDetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.systemset.school.detaillayout',
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
	controller: 'systemset.schoolinfo.detailcontroller',

	layout:'fit',
	items: [{
		xtype: "systemset.schoolinfo.detailform"
	}]
})