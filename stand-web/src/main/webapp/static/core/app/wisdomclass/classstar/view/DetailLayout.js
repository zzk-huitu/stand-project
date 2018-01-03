Ext.define("core.wisdomclass.classstar.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classstar.detaillayout',
	funCode: "classstar_detail",
	funData: {
		action: comm.get('baseUrl') + "/ClassStar", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.classstar.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
	layout: "border",
    minWidth:1000,
    scrollable:'x',
    items: [{
    	xtype: "wisdomclass.classstar.detailform",
    	height: 120,
    	region: "north"
    },{ 
        xtype: "public.SelectClass.selectclasslayout",
        region: "center"
    }/* {
    	xtype: "wisdomclass.classstar.selectclassgrid",
    	region: "west",
    	flex : 1,
    	margin:'5' ,
    }, {
    	xtype: "wisdomclass.classstar.isclassgrid",
    	region: "center",
    	flex : 1,
    	margin:'5' ,
    }*/]

})