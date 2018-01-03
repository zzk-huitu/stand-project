Ext.define("core.wisdomclass.classmotto.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classmotto.detaillayout',
	funCode: "classmotto_detail",
	funData: {
		action: comm.get('baseUrl') + "/GradeClass", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.classmotto.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "wisdomclass.classmotto.detailform"
    }]

})