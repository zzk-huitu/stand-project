Ext.define("core.wisdomclass.classelegant.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.classelegant.mainlayout',

    requires: [   
        "core.wisdomclass.classelegant.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'wisdomclass.classelegant.maincontroller',

	funCode: "classelegant_main",
	detCode: 'classelegant_detail',
	detLayout: 'wisdomclass.classelegant.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.classelegant.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/ClassElegant", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'className',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加班级风采',
            editTitle:'编辑班级风采',
            detailTitle:'班级风采详情',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:'wisdomclass.classelegant.readform',	//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "wisdomclass.classelegant.classtree",
		region: "west",
		split:true,
		width: 200
	}, {
		xtype: "wisdomclass.classelegant.maingrid",
		region: "center",
		
	}]
})
