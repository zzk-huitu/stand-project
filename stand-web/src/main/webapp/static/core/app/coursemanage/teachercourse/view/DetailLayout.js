Ext.define("core.coursemanage.teachercourse.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.coursemanage.teachercourse.detaillayout',
	funCode: "teachercourse_detail",
	funData: {
		action: comm.get('baseUrl') + "/CourseTeacher", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'coursemanage.teachercourse.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "coursemanage.teachercourse.detailform"
    }]

})