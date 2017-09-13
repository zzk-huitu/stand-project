Ext.define("core.system.jobinfo.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.system.jobinfo.detaillayout',
	funCode:"jobinfo_detail",
	funData: {
		action: comm.get('baseUrl') + "/SysJob", //请求Action
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
	controller: 'system.jobinfo.detailcontroller',
	items: [{
		xtype: "system.jobinfo.detailform"
	}]
})