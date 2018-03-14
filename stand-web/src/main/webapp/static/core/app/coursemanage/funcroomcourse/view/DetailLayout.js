Ext.define("core.coursemanage.funcroomcourse.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.coursemanage.funcroomcourse.detaillayout',
	funCode: "coursetable_detail",
	funData: {
		action: comm.get('baseUrl') + "/CourseArrange", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'coursemanage.funcroomcourse.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "coursemanage.funcroomcourse.detailform"
    }]

})