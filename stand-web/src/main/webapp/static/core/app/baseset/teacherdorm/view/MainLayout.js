Ext.define("core.baseset.teacherdorm.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.baseset.teacherdorm.mainlayout',

    requires: [   
        "core.baseset.teacherdorm.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.teacherdorm.maincontroller',

	funCode: "teacherdorm_main",
	detCode: "teacherdorm_detail",
	detLayout: 'baseset.teacherdorm.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.teacherdorm.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/BaseTeacherDrom", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'dormName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'分配宿舍',
            editTitle:'',
            detailTitle:''
        }
	},

    minWidth:1000,
    scrollable:'x',
    layout:'border',

	items: [{
		xtype: "baseset.teacherdorm.teacherdormtree",
		region: "west",
		split:true,
		width: 250
	}, {
		xtype: "baseset.teacherdorm.maingrid",
		region: "center",
		
	}]
})
