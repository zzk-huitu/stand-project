Ext.define("core.system.user.view.UserLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.system.user.userlayout',
	funCode: "user_detail",
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
	/*设置最小宽度，并且自动滚动*/
    minWidth: 1000,
    scrollable: true,

    controller:'system.user.detailcontroller',

	items: [{
		xtype: "system.user.userform"
	}]
})