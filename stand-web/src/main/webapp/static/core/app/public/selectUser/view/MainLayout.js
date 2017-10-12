Ext.define("core.public.selectuser.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.public.selectuser.mainlayout',
	funCode: "suser_main", //主窗体标识
	detCode: 'selectuser_detail', //详细窗口标识
	detLayout: 'selectuser.userlayout', //详细窗口别名
	border: false,
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/sysuser", //请求controller
		pkName: "uuid", //主键
	},
	layout: 'border',
	items: [{
		xtype:"public.selectuser.filterpanel",
		region: "west",
		width: comm.get("clientWidth") * 0.18
	}, {
        xtype:'pubselect.selectusergrid',
        flex:1,
        region: "center",
    }, {
        xtype: "pubselect.isselectusergrid",
        region: "east",
        width: comm.get("clientWidth") * 0.2
    }]
})