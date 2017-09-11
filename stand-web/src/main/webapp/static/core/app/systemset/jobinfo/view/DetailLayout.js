Ext.define("core.systemset.jobinfo.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.systemset.jobinfo.detaillayout',
	funCode:"jobinfo_detail",
	funData: {
		action: comm.get('baseUrl') + "/BaseJob", //请求Action
		pkName: "uuid",
		defaultObj: {
		// 	 actBegin: new Date(),
		// 	 signBeing:new Date()
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'systemset.jobinfo.detailcontroller',
	items: [{
		xtype: "systemset.jobinfo.detailform"
	}]
})