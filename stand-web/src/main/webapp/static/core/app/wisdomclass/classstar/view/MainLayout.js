Ext.define("core.wisdomclass.classstar.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classstar.mainlayout',

    requires: [   
        "core.wisdomclass.classstar.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'wisdomclass.classstar.maincontroller',

	funCode: "classstar_main",
	detCode: 'classstar_detail',
	detLayout: 'wisdomclass.classstar.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.classstar.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/ClassStar", //请求Action
		pkName: "uuid",
		defaultObj: {
        	doDate:new Date()
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加班级星旗',
            editTitle:'编辑班级星旗',
            detailTitle:'班级星旗详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "wisdomclass.classstar.starlevelgrid",
		region: "west",
		split:true,
		width: 200
	}, {
		xtype: "wisdomclass.classstar.maingrid",
		region: "center",
		
	}]
})
