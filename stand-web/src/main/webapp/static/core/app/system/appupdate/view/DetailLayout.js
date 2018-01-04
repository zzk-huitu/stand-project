Ext.define("core.system.appupdate.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.system.appupdate.detaillayout',
	funCode:"appupdate_detail",
	funData: {
		action: comm.get('baseUrl') + "/SysAppinfo", //请求Action
		pkName: "uuid"
	},
    minWidth:1000,
    scrollable:true,
	items: [{
		xtype: "system.appupdate.detailform"
	}]
})