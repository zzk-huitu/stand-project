Ext.define("core.wisdomclass.redflag.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.redflag.mainlayout',

    requires: [   
        "core.wisdomclass.redflag.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'wisdomclass.redflag.maincontroller',

	funCode: "redflag_main",
	detCode: 'redflag_detail',
	detLayout: 'wisdomclass.redflag.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.redflag.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/ClassRedflag", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加班训内容',
            editTitle:'编辑班训内容',
            detailTitle:'班训内容详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "wisdomclass.redflag.flagtypegrid",
		region: "west",
		split:true,
		width: 200
	}, {
		xtype: "wisdomclass.redflag.maingrid",
		region: "center",
		
	}]
})
