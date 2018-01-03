Ext.define("core.wisdomclass.classpersence.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classpersence.mainlayout',

    requires: [   
        "core.wisdomclass.classpersence.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'wisdomclass.classpersence.maincontroller',

	funCode: "classpersence_main",
	detCode: 'classpersence_detail',
	detLayout: 'wisdomclass.classpersence.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.classpersence.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/classPersence", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加班级风采1',
            editTitle:'编辑班级风采',
            detailTitle:'班级风采详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "wisdomclass.classpersence.classtree",
		region: "west",
		split:true,
		width: 200
	}, {
		xtype: "wisdomclass.classpersence.maingrid",
		region: "center",
		
	}]
})
