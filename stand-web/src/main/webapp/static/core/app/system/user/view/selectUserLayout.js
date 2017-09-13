Ext.define("core.system.user.view.selectUserLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.system.user.selectuserlayout',
	funCode: "selectsysuser_main", //主窗体标识
	detCode: 'selectsysuser_detail', //详细窗口标识
	detLayout: 'system.user.userlayout', //详细窗口别名
	border: false,
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/SysUser", //请求controller
		filter: "[{'type':'numeric','comparison':'=','value':0,'field':'isDelete'},	  {'type':'string','comparison':'=','value':'1','field':'category'}, {'type': 'numeric','comparison': '=','value': '1','field': 'issystem'}]",
		pkName: "uuid", //主键
		//默认的初始值设置
		defaultObj: {
			sex: '1',
			category: '1',
			state: '1',
			orderIndex: 1,
			userPwd: '123456',
			issystem: '1'
		}
	},
	layout: 'border',
	//bodyPadding: 2,
	items: [{
			xtype: "system.user.selectusergrid",
	        //width: 800,
	        region: "west",
	        width: comm.get("clientWidth") * 0.35,
	        margin:'5',
		
	}, {
		xtype: "system.user.isselectusergrid",
        region: "center",
        margin:'5',
	}]
})