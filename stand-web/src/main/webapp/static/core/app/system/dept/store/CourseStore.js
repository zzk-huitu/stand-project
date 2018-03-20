Ext.define("core.system.dept.store.CourseStore", {
	extend: "Ext.data.Store",
	alias: 'store.system.dept.coursestore',

	model: factory.ModelFactory.getModelByName("com.zd.school.jw.eduresources.model.JwTBasecourse", "checked").modelName,
	proxy: {
		type: "ajax",
		url: comm.get('baseUrl') + "/BaseCourse/list", //对应后台controller路径or方法
		extraParams : {
			filter: "[{'type':'string','comparison':'=','value':'aaaa','field':'uuid'}]"
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
	autoLoad: false
})