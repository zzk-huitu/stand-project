Ext.define("core.wisdomclass.eccset.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: "widget.wisdomclass.eccset.detaillayout",
	funCode: "eccset_detail",
	funData: {
		action: comm.get("baseUrl") + "/ClassCheckrule", //请求Action
		pkName: "uuid",
		defaultObj: {}
	},
	  /*关联此视图控制器*/
    controller: 'wisdomclass.eccset.detailcontroller',
     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
	items: [{
		xtype: "wisdomclass.eccset.detailform"
	}]
});