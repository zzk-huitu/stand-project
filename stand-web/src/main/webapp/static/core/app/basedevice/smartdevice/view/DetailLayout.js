Ext.define("core.basedevice.smartdevice.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.basedevice.smartdevice.detaillayout',
	funCode:"smartdevice_detail",
	funData: {
		action: comm.get('baseUrl') + "/PtTerm", //请求Action
		pkName: "uuid",
		defaultObj: {
		// 	 actBegin: new Date(),
		// 	 signBeing:new Date()
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    viewModel: 'basedevice.smartdevice.mainModel',
    /*关联此视图控制器*/
	controller: 'basedevice.smartdevice.detailcontroller',
	items: [{
		xtype: "basedevice.smartdevice.detailform"
	}]
})