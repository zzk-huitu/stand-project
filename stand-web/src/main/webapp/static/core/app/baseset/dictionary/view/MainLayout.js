Ext.define("core.systemset.dictionary.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.systemset.dictionary.mainlayout',
    requires: [    
		"core.systemset.dictionary.view.MainLayout",
		"core.systemset.dictionary.view.dicDetailLayout",
		"core.systemset.dictionary.view.dicGrid",
		"core.systemset.dictionary.view.dicForm",
		"core.systemset.dictionary.view.itemLayout",
		"core.systemset.dictionary.view.itemGrid",
		"core.systemset.dictionary.view.itemForm"
   
    ],

    controller: 'systemset.dictionary.maincontroller',
	funCode: "dic_main",
	detCode: 'dic_detail',
	detLayout: 'systemset.dictionary.dicdetaillayout',
	border: false,
	funData: {
		action: comm.get('baseUrl') + "/BaseDic", //请求Action		
		pkName: "id",
		defaultObj: {
			orderIndex: 1,
			dicType:"LIST"
		},
		tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
			titleField:'itemName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        	addTitle:'添加字典',
        	editTitle:'编辑字典',
        	detailTitle:'字典详细',
        }
    },    
    layout: 'border',
    
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
	//bodyPadding: 2,
	items: [{
		xtype: "systemset.dictionary.dicgrid",
		region: "west",
		width:550,
		split:true,
		collapsible:true,
		//margin:'0 5 0 0',
		border: false,
		// style:{
  //           border: '1px solid #ddd'
  //       },
		frame:false
	}, {
		xtype: "systemset.dictionary.itemgrid",
		region: "center",
		border: false,
		// style:{
  //           border: '1px solid #ddd'
  //       },
		frame:false
	}]
})