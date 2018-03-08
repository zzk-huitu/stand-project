Ext.define("core.coursemanage.specialcourseattend.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: "widget.coursemanage.specialcourseattend.detaillayout",
	funCode: "specialcourseattend_detail",
	funData: {
		action: comm.get("baseUrl") + "/AttendTitle", //请求Action
		pkName: "uuid",
		defaultObj: {},
	},
	  /*关联此视图控制器*/
    controller: 'coursemanage.specialcourseattend.detailcontroller',
     /*设置最小宽度，并且自动滚动*/
    //minWidth:1000,
    scrollable:true,
	items: [{
		xtype: "coursemanage.specialcourseattend.detailform"
	}]
});