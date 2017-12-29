Ext.define("core.wisdomclass.roomterm.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
	alias: "widget.wisdomclass.roomterm.detaillayout",
	funCode: "roomterm_detail",
	funData: {
		action: comm.get("baseUrl") + "/BaseInfoterm", //请求Action
		pkName: "uuid",
		defaultObj: {}
	},
    minWidth:1000,
    scrollable:true,
	items: [{
        xtype: "wisdomclass.roomterm.detailform",
    }]
});