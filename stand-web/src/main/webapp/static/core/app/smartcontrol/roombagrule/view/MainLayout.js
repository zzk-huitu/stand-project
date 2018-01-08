Ext.define("core.smartcontrol.roombagrule.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.roombagrule.mainlayout',

    requires: [   
        "core.smartcontrol.roombagrule.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'smartcontrol.roombagrule.maincontroller',

	funCode: "roombagrule_main",
	detCode: 'roombagrule_detail',
	detLayout: 'smartcontrol.roombagrule.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'smartcontrol.roombagrule.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BasePtRoomBagRule", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
        finalObj: {},   //一般在点击事件代码中使用。 详见main控制器
        //whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roomRuleName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'增加钱包规则',
            editTitle:'编辑钱包规则',
            detailTitle:'钱包规则详情',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:'smartcontrol.roombagrule.detailhtml',	//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1000,
    scrollable:true,
    layout:'fit',

	items: [ {
		xtype: "smartcontrol.roombagrule.maingrid",		
	}]
})
