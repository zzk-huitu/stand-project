Ext.define("core.basedevice.basefrontserver.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basefrontserver.detaillayout',
    funCode: "basefrontserver_detail",
    funData: {
        action: comm.get('baseUrl') + "/BaseFrontServer", //请求Action
        pkName: "uuid",
        modelName: "com.zd.school.build.define.model.SysFrontServer", //实体全路径
    },
     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    /*关联此视图控制器*/
    controller: 'basedevice.basefrontserver.detailcontroller',
    items: [{
        xtype: "basedevice.basefrontserver.detailform"
    }]
})