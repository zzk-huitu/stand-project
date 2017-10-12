Ext.define("core.basedevice.measurement.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.basedevice.measurement.detaillayout',
	funCode:"measurement_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePtSkMeter", //请求Action
		pkName: "uuid",
		defaultObj: {
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'basedevice.measurement.detailcontroller',
	
	items: [{
		xtype: "basedevice.measurement.detailform"
	}]
})