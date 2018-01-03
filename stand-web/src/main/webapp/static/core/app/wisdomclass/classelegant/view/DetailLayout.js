Ext.define("core.wisdomclass.classelegant.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classelegant.detaillayout',
	funCode: "classelegant_detail",
	funData: {
		action: comm.get('baseUrl') + "/ClassElegant", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.classelegant.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "wisdomclass.classelegant.detailform"
    }]

})