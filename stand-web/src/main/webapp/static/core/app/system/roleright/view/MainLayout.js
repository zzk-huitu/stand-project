Ext.define("core.system.roleright.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.system.roleright.mainlayout',

	requires: [    
        'core.system.roleright.controller.MainController',
        "core.system.roleright.view.RoleGrid",
        'core.system.roleright.view.RoleRightGrid', 
        "core.system.roleright.view.SelectMenuGrid",
        'core.system.roleright.view.DetailLayout',
    ],
    controller: 'system.roleright.maincontroller',


	funCode: "roleright_main",    //主窗体标识
	detCode: 'roleright_selectmenu',  //详细窗口标识
	detLayout: 'system.roleright.detaillayout', //详细窗口别名

	/*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'system.roleright.othercontroller',

	border: false,
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/SysRole", //请求controller
		pkName: "uuid", //主键
		//默认的初始值设置
		defaultObj: {
			orderIndex: 1
		},
		tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'text',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
		    addTitle:'添加权限',
		    editTitle:'编辑权限',
		    deleteTitle:'权限详情'
		}
	},
	layout: 'border',
	/*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',

	//bodyPadding: 2,
	items: [{
		xtype: "system.roleright.rolegrid",
		region: "west",

		split:true,
		//collapsible:true,
		border: false,
		// style:{
  //           border: '1px solid #ddd'
  //       },
		//margin:'0 5 0 0',
		width:450
		//width: comm.get("clientWidth") * 0.35
	}, {
		xtype: "system.roleright.rolgerightgrid",
		region: "center",
		border: false,
		// style:{
  //           border: '1px solid #ddd'
  //       },
		flex:1
	}]
})