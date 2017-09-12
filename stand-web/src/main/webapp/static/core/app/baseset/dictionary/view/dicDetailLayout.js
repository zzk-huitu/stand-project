Ext.define("core.systemset.dictionary.view.dicDetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.systemset.dictionary.dicdetaillayout',
	funCode: "dic_detail",
	funData: {
		action: comm.get('baseUrl') + "/BaseDic", //请求Action
		pkName: "uuid",
		defaultObj: {
			orderIndex: 1,
			dicType:"LIST"
		}
	},
	layout: 'fit',
	bodyPadding: 2,
	items: [{
		xtype: "systemset.dictionary.dicform"
	}]
})