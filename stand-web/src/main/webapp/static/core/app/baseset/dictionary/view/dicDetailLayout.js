Ext.define("core.baseset.dictionary.view.DicDetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.dictionary.dicdetaillayout',
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
		xtype: "baseset.dictionary.dicform"
	}]
})