Ext.define("core.wisdomclass.notice.view.DetailLayout",{
	extend:"core.base.view.BasePanel",
	alias : 'widget.wisdomclass.notice.detaillayout',
	funCode:"notice_detail",
	funData: {
		action: comm.get('baseUrl') + "/OaNotice", //请求Action
		pkName: "uuid",
		defaultObj: {
		// 	 actBegin: new Date(),
		// 	 signBeing:new Date()
		}
	},
	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
	controller: 'wisdomclass.notice.detailcontroller',
	items: [{
		xtype: "wisdomclass.notice.detailform"
	}]
})