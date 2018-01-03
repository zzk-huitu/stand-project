Ext.define("core.wisdomclass.classmotto.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classmotto.mainlayout',

    requires: [   
        "core.wisdomclass.classmotto.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'wisdomclass.classmotto.maincontroller',

	funCode: "classmotto_main",
	detCode: 'classmotto_detail',
	detLayout: 'wisdomclass.classmotto.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.classmotto.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/GradeClass", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加班训',
            editTitle:'编辑班训',
            detailTitle:'班训详情'
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "wisdomclass.classmotto.classtree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "wisdomclass.classmotto.maingrid",
		region: "center",
		
	}]
})
