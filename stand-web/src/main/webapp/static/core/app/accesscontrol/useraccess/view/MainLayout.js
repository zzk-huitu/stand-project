Ext.define("core.accesscontrol.useraccess.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.accesscontrol.useraccess.mainlayout',
    requires: [   
        "core.accesscontrol.useraccess.view.MainLayout",
    ],
    
    /** 关联此视图控制器 */
    controller: 'accesscontrol.useraccess.maincontroller',
    /** 页面代码定义 */
    funCode: "useraccess_main",
    detCode: "useraccess_detail",
    detLayout: "accesscontrol.useraccess.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'accesscontrol.useraccess.othercontroller',
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
    scrollable:true,
    items: [{
    	split: true,//对模块分开的线条
    	xtype: "accesscontrol.useraccess.roominfotree",
    	width: comm.get("clientWidth") * 0.18,
        region: "west",
    }, {
    	split: true,//对模块分开的线条
        xtype: "accesscontrol.useraccess.mjuserrightgrid",
        region: "center",
    }/*, {
    	split: true,//对模块分开的线条
        xtype: "accesscontrol.useraccess.mjuserselectgrid",
        width: 340,
        region: "east",
    }*/,{
    	split: true,//对模块分开的线条
        xtype: "accesscontrol.useraccess.maingrid",
        width: comm.get("clientWidth") * 0.25,
        region: "east",
    }]
})