Ext.define("core.baseset.studentmanager.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.studentmanager.mainlayout',

	requires: [
		"core.baseset.studentmanager.controller.MainController",
        "core.baseset.studentmanager.view.MainLayout",
        "core.baseset.studentmanager.view.DeptTree",
        "core.baseset.studentmanager.view.StudentGrid",
    ],
    controller:'baseset.studentmanager.maincontroller',
    
	funCode: "studentmanager_main", //主窗体标识
	detCode: 'studentmanager_detail', //详细窗口标识
	detLayout: 'baseset.studentmanager.detaillayout', //详细窗口别名
	border: false,

	/*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.studentmanager.othercontroller',
    
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/SysUser", //请求controller
		pkName: "uuid", //主键
		//默认的初始值设置
		defaultObj: {
			sex: '1',
			category: '2',
			state: '0',
			orderIndex: 1,
			userPwd: '123456',
			issystem: '1'
		},
		tabConfig: {         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
			titleField:'userName',
            addTitle: '添加学生',
            editTitle: '编辑学生',
            detailTitle: '学生详情'
        }
	},
	layout: 'border',

	/*设置最小宽度，并且自动滚动*/
    minWidth: 1200,
    scrollable: 'x',

	items: [{
		xtype: "baseset.studentmanager.depttree",
		region: "west",
		width:250,
		split : true,
        collapsible:true,    
        
	}, {
		xtype: "baseset.studentmanager.studentgrid",
		region: "center",
		title:null,
	}]
})