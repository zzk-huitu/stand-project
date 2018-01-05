Ext.define("core.smartcontrol.useraccess.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.smartcontrol.useraccess.mainlayout',
    requires: [   
        "core.smartcontrol.useraccess.view.MainLayout",
    ],
    
    /** 关联此视图控制器 */
    controller: 'smartcontrol.useraccess.maincontroller',
    /** 页面代码定义 */
    funCode: "useraccess_main",
    detCode: "useraccess_detail",
    detLayout: "smartcontrol.useraccess.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'smartcontrol.useraccess.othercontroller',
    layout:'border',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BaseMjUserright", //请求Action 
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
        	addTitle:'添加计量',
        	editTitle:'编辑计量',
        	detailTitle:'计量详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    items: [{
    	split: true,//对模块分开的线条
    	xtype: "smartcontrol.useraccess.roominfotree",
    	width: 250,
        region: "west",
    }, {
    	split: true,//对模块分开的线条
        xtype: "smartcontrol.useraccess.mjuserrightgrid",
        region: "center",
    },{
    	split: true,//对模块分开的线条
        xtype: "smartcontrol.useraccess.maingrid",
        width: 400,
        region: "east",

    }]
})