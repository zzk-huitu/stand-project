Ext.define("core.baseset.studentdorm.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.studentdorm.mainlayout',

    requires: [   
        "core.baseset.studentdorm.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.studentdorm.maincontroller',

	funCode: "studentdorm_main",
	detCode: 'dormallot_detail',
	detLayout: 'baseset.studentdorm.dormallotLayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.studentdorm.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseStudentDorm", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roomName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'学生宿舍',
            editTitle:'',
            detailTitle:''
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "baseset.studentdorm.studentdormtree",
		region: "west",
		split:true,
		width:250
	}, {
		xtype: "baseset.studentdorm.maingrid",
		region: "center",
		
	}]
})
