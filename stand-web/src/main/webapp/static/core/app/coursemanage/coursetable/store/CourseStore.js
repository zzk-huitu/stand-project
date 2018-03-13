
Ext.define("core.coursemanage.coursetable.store.CourseStore",{
    extend:"Ext.data.Store",
    alias: 'store.coursemanage.coursetable.coursestore',
//    fields: ['courseName','uuid'],
    model: factory.ModelFactory.getModelByName("com.zd.school.jw.eduresources.model.JwTBasecourse", "").modelName,
	proxy: {
		type: "ajax",
		url: comm.get('baseUrl') + "/BaseCourse/list", //对应后台controller路径or方法
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
});