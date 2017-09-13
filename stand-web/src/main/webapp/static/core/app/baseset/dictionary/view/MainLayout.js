Ext.define("core.baseset.dictionary.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.dictionary.mainlayout',
    requires: [    
		"core.baseset.dictionary.view.MainLayout",
		"core.baseset.dictionary.view.DicDetailLayout",
		"core.baseset.dictionary.view.DicGrid",
		"core.baseset.dictionary.view.DicForm",
		"core.baseset.dictionary.view.ItemLayout",
		"core.baseset.dictionary.view.ItemGrid",
		"core.baseset.dictionary.view.ItemForm"

    ],

    controller: 'baseset.dictionary.maincontroller',
	funCode: "dic_main",
	detCode: 'dic_detail',
	detLayout: 'baseset.dictionary.dicdetaillayout',
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
		xtype: "baseset.dictionary.dicgrid",
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
		xtype: "baseset.dictionary.itemgrid",
		region: "center",
		border: false,
		// style:{
  //           border: '1px solid #ddd'
  //       },
		frame:false
	}]
})