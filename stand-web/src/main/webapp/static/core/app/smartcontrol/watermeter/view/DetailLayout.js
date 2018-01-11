Ext.define("core.smartcontrol.watermeter.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.watermeter.detaillayout',
	funCode: "watermeter_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePtSkMeter", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'smartcontrol.watermeter.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "smartcontrol.watermeter.detailform"
    }]

})