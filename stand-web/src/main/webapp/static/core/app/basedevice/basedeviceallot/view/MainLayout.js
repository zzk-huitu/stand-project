Ext.define("core.basedevice.basedeviceallot.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basedeviceallot.mainlayout',
    requires: [   
        "core.basedevice.basedeviceallot.view.MainLayout",
    ],
    
    /** 关联此视图控制器 */
    controller: 'basedevice.basedeviceallot.maincontroller',
    /** 页面代码定义 */
    funCode: "basedeviceallot_main",
    detCode: 'basedeviceallot_detaillayout',
    detLayout: "basedevice.basedeviceallot.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'basedevice.basedeviceallot.othercontroller',
    layout: 'border',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BasePtTerm", //请求Action 
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
    scrollable:'x',
    layout:'border',
    
    items: [{
        split: true,
        xtype: "basedevice.basedeviceallot.roominfotree",
        region: "west",
        width: comm.get("clientWidth") * 0.24
    }, {
        xtype: "basedevice.basedeviceallot.maingrid",
        region: "center"
    }]
})