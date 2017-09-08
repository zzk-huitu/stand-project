Ext.define("core.systemset.campus.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.systemset.campus.detaillayout',
	funCode: "campus_detail",
	funData: {
		action: comm.get('baseUrl') + "/BaseCampus", //请求Action	
		pkName: "uuid",
		defaultObj: {
			// schoolId: comm.get("schoolId"),
			// schoolName: comm.get("schoolName"),
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'systemset.campus.detailcontroller',

	layout:'fit',
	items: [{
		xtype: "systemset.campus.detailform"
	}]
})