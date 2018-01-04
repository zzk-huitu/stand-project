Ext.define("core.basedevice.baserate.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.baserate.mainlayout',
    
    requires: [   
    	"core.basedevice.baserate.controller.MainController",
        "core.basedevice.baserate.view.MainLayout",
        "core.basedevice.baserate.view.MainGrid",
        "core.basedevice.baserate.view.CategroyGrid",
        "core.basedevice.baserate.view.DetailForm",
    ],
    
    /** 关联此视图控制器 */
    controller: 'basedevice.baserate.maincontroller',
    /** 页面代码定义 */
    funCode: "baserate_main",
    detCode: "baserate_detail",
    detLayout: "basedevice.baserate.detaillayout",
    
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'basedevice.baserate.othercontroller',
    layout: 'border',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BasePriceDefine", //请求Action 
        pkName: "uuid",
        categroy:"",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
        	addTitle:'添加费率',
        	editTitle:'编辑费率',
        	detailTitle:'费率详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    items: [{
		xtype: "basedevice.baserate.categroygrid",
		region: "west",
		//margin:'5',
		width:200,
        split:true
	}, {
		xtype: "basedevice.baserate.maingrid",
       // margin:'5',
		region: "center",
	}]
})