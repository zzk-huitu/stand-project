Ext.define("core.baseset.teachermanager.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.teachermanager.mainlayout',

	requires: [
		//"core.baseset.teachermanager.controller.MainController",
        "core.baseset.teachermanager.view.MainLayout",
        "core.baseset.teachermanager.view.DeptTree",
    ],
    controller:'baseset.teachermanager.maincontroller',
    
	funCode: "teachermanage_main", //主窗体标识
	detCode: 'teachermanage_detail', //详细窗口标识
	detLayout: 'baseset.teachermanager.detaillayout', //详细窗口别名
	border: false,

	/*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.teachermanager.othercontroller',
    
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/SysUser", //请求controller
		pkName: "uuid", //主键
		//默认的初始值设置
		defaultObj: {
			sex: '1',
			category: '1',
			state: '0',
			orderIndex: 1,
			userPwd: '123456',
			issystem: '1'
		},
		tabConfig: {         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
			titleField:'userName',
            addTitle: '添加教师',
            editTitle: '编辑教师',
            detailTitle: '教师详情'
        }
	},
	layout: 'border',

	/*设置最小宽度，并且自动滚动*/
    minWidth: 1200,
    scrollable: 'x',

	items: [{
		xtype: "baseset.teachermanager.depttree",
		region: "west",
		width:250,
		split : true,
        collapsible:true,    
	}, 
	{
		xtype: "baseset.teachermanager.teachergrid",
		region: "center",
		title:null,
	}]
})