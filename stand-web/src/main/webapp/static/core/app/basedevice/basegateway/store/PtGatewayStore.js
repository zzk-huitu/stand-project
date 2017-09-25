Ext.define("core.basedevice.basegateway.store.PtGatewayStore", {
	extend: "Ext.data.Store",
	alias: 'store.basedevice.basegateway.ptgatewaystore',
	model: factory.ModelFactory.getModelByName("com.zd.school.build.define.model.SysFrontServer", "checked").modelName,
	proxy: {
		type: "ajax",
		url: comm.get('baseUrl') + "/BaseFrontServer/list", //对应后台controller路径or方法
		extParams: {
		},
		reader: {
			type: "json",
			rootProperty: "rows",
			totalProperty: 'totalCount'
		},
		writer: {
			type: "json"
		}
	},
	autoLoad: true
})