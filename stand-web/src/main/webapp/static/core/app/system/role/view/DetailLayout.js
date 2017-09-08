Ext.define("core.system.role.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.system.role.detaillayout',
	funCode:"role_detail",
	
	funData: {
		action: comm.get('baseUrl') + "/SysRole", //请求Action
		pkName: "uuid",
		defaultObj: {
			issystem:"1",
			orderIndex:'1'
		}
	},
	
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    
	items: [{
		xtype: "system.role.deailform"
	}]
})