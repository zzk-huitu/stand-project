Ext.define("core.basedevice.irdevice.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.basedevice.irdevice.detaillayout',
	funCode:"irdevice_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePtIrDeviceBrand", //请求Action
		pkName: "uuid",
		defaultObj: {
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'basedevice.irdevice.detailcontroller',
	
	items: [{
		xtype: "basedevice.irdevice.detailform"
	}]
})