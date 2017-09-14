Ext.define("core.baseset.terminal.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
	alias: "widget.baseset.terminal.detaillayout",
	funCode: "terminal_detail",
	funData: {
		action: comm.get("baseUrl") + "/BaseInfoterm", //请求Action
		whereSql: "", //表格查询条件
		orderSql: "", //表格排序条件
		pkName: "uuid",
		defaultObj: {}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
	items: [{
		xtype: "baseset.terminal.detailform"
	}]
});