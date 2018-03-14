Ext.define("core.wisdomclass.classteacher.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classteacher.detaillayout',
	funCode: "classteacher_detail",
	funData: {
		action: comm.get('baseUrl') + "/ClassTeacher", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.classteacher.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "wisdomclass.classteacher.detailform"
    }]

})