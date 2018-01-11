Ext.define("core.smartcontrol.climatecontrol.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.climatecontrol.detaillayout',
	funCode: "classelegant_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePtIrRoomDevice", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'smartcontrol.climatecontrol.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "smartcontrol.climatecontrol.detailform"
    }]

})