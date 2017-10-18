Ext.define("core.basedevice.baserate.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.basedevice.baserate.detaillayout',
	funCode:"baserate_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePriceDefine", //请求Action
		pkName: "uuid",
		defaultObj: {
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'basedevice.baserate.detailcontroller',
	
	items: [{
		xtype: "basedevice.baserate.detailform"
	}]
})