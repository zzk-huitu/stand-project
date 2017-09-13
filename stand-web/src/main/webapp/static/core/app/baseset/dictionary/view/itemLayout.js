Ext.define("core.baseset.dictionary.view.ItemLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.dictionary.itemlayout',
	funCode: "dicItem_main",
	border: false,
	funData: {
		action: comm.get('baseUrl') + "/BaseDicitem", //请求Action
		whereSql: "", //表格查询条件
		orderSql: "", //表格排序条件
		pkName: "uuid",
		defaultObj: {
			orderIndex: 1
		}
	},
	/*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
	items: [{
		xtype: "baseset.dictionary.itemform"
	}]
})