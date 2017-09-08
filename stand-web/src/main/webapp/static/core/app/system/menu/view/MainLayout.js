Ext.define("core.system.menu.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.system.menu.mainlayout',

	requires: [    
        'core.system.menu.controller.MainController',
        'core.system.menu.view.MenuTree',
        'core.system.menu.store.MenuStore', 
        'core.system.menu.view.MenuForm',
        "core.system.menu.view.DetailLayout" 
    ],

    controller: 'system.menu.maincontroller',


	funCode: "menu_main",
	detCode: "menu_detail",
	detLayout: "system.menu.detaillayout",
	
	
	funData: {
		action: comm.get('baseUrl') + "/SysMenu", //请求controller路径
		pkName: "uuid", //主键id    
		defaultObj: {
			orderIndex: 1
		},
		tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
			titleField:'text',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
	    	addTitle:'添加菜单',
	    	editTitle:'编辑菜单',
	    	detailTitle:'菜单详细'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    
	items: [{
		xtype: "system.menu.menutree",
		/*style:{
            border: '1px solid #ddd'
        },*/
	}]
})