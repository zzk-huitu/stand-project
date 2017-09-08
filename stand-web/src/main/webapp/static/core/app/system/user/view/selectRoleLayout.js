Ext.define("core.system.user.view.selectRoleLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.system.user.selectrolelayout',
	funCode: "user_selectrolemain",
	layout: 'border',
	//bodyPadding: 5,	
	funData: {
		action: comm.get('baseUrl') + "/SysUser", //请求Action
		pkName: "uuid",
		//默认的初始值设置
		defaultObj: {
			sex: '1',
			category: '1',
			state: '1',
			userPwd: '123456',
			orderIndex: 1,
			issystem: '1'
		}
	},
	items: [{
		xtype: "system.user.selectrolegrid",
		region: "west",
		margin:5,
		flex:2,
		title:null
		//border:true
	},{
		xtype: "system.user.isselectrolegrid",
		region: "center",
		flex:1,
		margin:5,
		//border:true
	}]
})