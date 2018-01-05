Ext.define("core.basedevice.irdevice.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.irdevice.mainlayout',
    requires: [   
        "core.basedevice.irdevice.view.MainLayout",
    ],
    
    /** 关联此视图控制器 */
    controller: 'basedevice.irdevice.maincontroller',
    /** 页面代码定义 */
    funCode: "irdevice_main",
    detCode: 'irdevice_branddetaillayout',
    detLayout: "basedevice.irdevice.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
//    otherController:'basedevice.irdevice.othercontroller',
    layout: 'border',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BasePtIrDeviceBrand", //请求Action 
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
        	addTitle:'添加型号',
        	editTitle:'编辑型号',
        	detailTitle:'型号详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        collapsible: true,
        split: true,
        xtype: "basedevice.irdevice.irbrandtreegrid",
        region: "west",
        width: 380
    }, {
        xtype: "basedevice.irdevice.maingrid",
        region: "center"
    }]
})