Ext.define("core.basedevice.basedeviceallot.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.basedevice.basedeviceallot.detaillayout',
	funCode:"basedeviceallot_detaillayout",
	funData: {
		action: comm.get('baseUrl') + "/BasePtTerm", //请求Action
		pkName: "uuid",
		defaultObj: {
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'basedevice.basedeviceallot.detailcontroller',
	
	items: [{
		xtype: "basedevice.basedeviceallot.detailform"
	}]
})