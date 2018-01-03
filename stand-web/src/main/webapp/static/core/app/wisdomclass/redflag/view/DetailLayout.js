Ext.define("core.wisdomclass.redflag.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.redflag.detaillayout',
	funCode: "redflag_detail",
	funData: {
		action: comm.get('baseUrl') + "/ClassRedflag", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'wisdomclass.redflag.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
	layout: "border",
    minWidth:1000,
    scrollable:'x',
    items: [{
    	xtype: "wisdomclass.redflag.detailform",
    	height: 120,
    	padding:0, 
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