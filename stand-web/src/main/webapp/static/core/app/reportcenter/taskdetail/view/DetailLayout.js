Ext.define("core.reportcenter.taskdetail.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.reportcenter.taskdetail.detaillayout',
	funCode:"taskdetail_detail",
	funData: {
		action: comm.get('baseUrl') + "/PtTask", //请求Action
	
		pkName: "uuid"
	},
	
	minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'reportcenter.taskdetail.detailcontroller',

	layout:'fit',
	items: [{
		xtype: "reportcenter.taskdetail.detailform"
	}]
})