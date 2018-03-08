Ext.define("core.coursemanage.teachercourse.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.coursemanage.teachercourse.mainlayout',

    requires: [   
        "core.coursemanage.teachercourse.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'coursemanage.teachercourse.maincontroller',

	funCode: "teachercourse_main",
	detCode: 'teachercourse_detail',
	detLayout: 'coursemanage.teachercourse.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'coursemanage.teachercourse.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/CourseTeacher", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加任课教师',
            editTitle:'编辑任课教师',
            detailTitle:'任课教师详情',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:null,									//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "coursemanage.teachercourse.maintree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "coursemanage.teachercourse.maingrid",
		region: "center",
		
	}]
})
