Ext.define("core.baseset.roomdefine.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.roomdefine.detaillayout',
	funCode: "roomdefine_detail",
	funData: {
		action: comm.get('baseUrl') + "/BaseRoomdefine", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'baseset.roomdefine.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    items: [{
        xtype: "baseset.roomdefine.detailform"
    }]

})