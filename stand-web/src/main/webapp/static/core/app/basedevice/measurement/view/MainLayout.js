Ext.define("core.basedevice.measurement.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.measurement.mainlayout',
    requires: [   
        "core.basedevice.measurement.view.MainLayout",
    ],
    
    /** 关联此视图控制器 */
    controller: 'basedevice.measurement.maincontroller',
    /** 页面代码定义 */
    funCode: "measurement_main",
    detCode: "measurement_detail",
    detLayout: "basedevice.measurement.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
//    otherController:'basedevice.measurement.othercontroller',
    layout: 'fit',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BasePtSkMeter", //请求Action 
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
		xtype: "basedevice.measurement.maingrid",
	}]
})