Ext.define("core.coursemanage.courseinfo.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: "widget.coursemanage.courseinfo.detaillayout",
	funCode: "courseinfo_detail",
	funData: {
		action: comm.get("baseUrl") + "/BaseCourse", //请求Action
		pkName: "uuid",
		defaultObj: {},
	},
	  /*关联此视图控制器*/
    controller: 'coursemanage.courseinfo.detailcontroller',
     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
	items: [{
		xtype: "coursemanage.courseinfo.detailform"
	}]
});