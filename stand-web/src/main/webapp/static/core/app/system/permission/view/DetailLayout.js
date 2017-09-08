Ext.define("core.system.permission.view.DetailLayout", {
	extend:"core.base.view.BasePanel",
	alias: "widget.system.permission.detaillayout",
	funCode: "permission_detail",
	funData: {
		action: comm.get("baseUrl") + "/SysMenuPermission", //请求Action
		pkName: "uuid",
		defaultObj: {}
	},
    /*关联此视图控制器*/
	controller: 'system.permission.detailcontroller',
	items: [{
		xtype: "system.permission.detailform"
	}],

	/*设置最小宽度*/
    minWidth:1000,   
    scrollable:true, 
});
