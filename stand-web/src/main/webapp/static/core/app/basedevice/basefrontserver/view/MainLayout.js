Ext.define("core.basedevice.basefrontserver.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basefrontserver.mainlayout',
    requires: [   
        "core.basedevice.basefrontserver.controller.MainController"
    ],
    
    /** 关联此视图控制器 */
    controller: 'basedevice.basefrontserver.maincontroller',
     /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'basedevice.basefrontserver.othercontroller',
 
    /** 页面代码定义 */
    funCode: "basefrontserver_main",
    detCode: 'basefrontserver_detail',
    detLayout: 'basedevice.basefrontserver.detaillayout',
    funData: {
        action: comm.get('baseUrl') + "/BaseFrontServer", //请求Action
        pkName: "uuid",
        defaultObj: {
            frontServerStatus: 0
        },
       tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'frontServerName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加服务器',
            editTitle:'编辑服务器',
            detailTitle:'服务器详情'
        }
    },
     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "basedevice.basefrontserver.maingrid"
    }]
})