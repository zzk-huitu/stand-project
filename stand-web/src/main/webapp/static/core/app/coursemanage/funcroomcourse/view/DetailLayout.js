Ext.define("core.coursemanage.funcroomcourse.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.coursemanage.funcroomcourse.detaillayout',
	funCode: "funcroomcourse_detail",
	funData: {
		action: comm.get('baseUrl') + "/FuncRoomCourse", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'coursemanage.funcroomcourse.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "coursemanage.funcroomcourse.classtree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "container",
		region: "center",
		layout:'border',
		items:[{
	        xtype:"coursemanage.funcroomcourse.selectcourse",
	        region: "north",
	        height: "50%",
	        split:true,
	    },{
	    	split:true,
	        xtype:"coursemanage.funcroomcourse.selectedcourse",
	        region: "center",
	        height: "50%"
	    }]
	}]
})