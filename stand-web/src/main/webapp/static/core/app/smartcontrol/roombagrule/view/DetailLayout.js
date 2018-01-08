Ext.define("core.smartcontrol.roombagrule.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.roombagrule.detaillayout',
	funCode: "roombagrule_detail",
	funData: {
		action: comm.get('baseUrl') + "/BasePtRoomBagRule", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'smartcontrol.roombagrule.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "smartcontrol.roombagrule.detailform"
    }]

})