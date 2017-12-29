Ext.define("core.wisdomclass.classpersence.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classpersence.detaillayout',
	funCode: "classpersence_detail",
	funData: {
		action: comm.get('baseUrl') + "/classPersence", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.classpersence.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "wisdomclass.classpersence.detailform"
    }]

})