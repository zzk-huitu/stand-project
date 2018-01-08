Ext.define("core.reportcenter.ptsktermstatus.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.reportcenter.ptsktermstatus.mainlayout',

    requires: [   
        "core.reportcenter.ptsktermstatus.controller.MainController",
    ],
    
    /** 关联此视图控制器 */
    controller: 'reportcenter.ptsktermstatus.maincontroller',

	funCode: "ptsktermstatus_main",
	detCode: 'ptsktermstatus_detail',
	detLayout: 'reportcenter.ptsktermstatus.detaillayout',

	 /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'reportcenter.ptsktermstatus.othercontroller',
 
	funData: {
		action: comm.get('baseUrl') + "/PtSkTermStatus", //请求Action
		pkName: "uuid",
		defaultObj: {
           
        },
	    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'',
            editTitle:'',
            detailTitle:'',
            addXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            editXtype:null,										//2018/1/3新加入，用于在公共方法中打开指定的界面
            detailXtype:null,	//2018/1/3新加入，用于在公共方法中打开指定的界面
        }
	},

    minWidth:1100,
    scrollable:'x',
    layout:'border',

	items: [ {
		xtype: "reportcenter.ptsktermstatus.roominfotree",		
        region: "west",
        width:200,
        split:true,
        //margin:'0 5 0 0'
	},{
        xtype: "reportcenter.ptsktermstatus.maingrid",   
        region: "center",
      //  margin:'0 5 0 0'  
    }]
})