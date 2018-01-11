Ext.define("core.smartcontrol.climatecontrol.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.smartcontrol.climatecontrol.mainlayout',

    requires: [   
        "core.smartcontrol.climatecontrol.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'smartcontrol.climatecontrol.maincontroller',

	funCode: "climatecontrol_main",
	detCode: 'climatecontrol_detail',
	detLayout: 'smartcontrol.climatecontrol.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'smartcontrol.climatecontrol.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BasePtIrRoomDevice", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
       // whereSql:" where isDelete=0",
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'brandname',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'',
            editTitle:'',
            detailTitle:'',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:null,									//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "smartcontrol.climatecontrol.maintree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "smartcontrol.climatecontrol.maingrid",
		region: "center",
		
	}]
})
