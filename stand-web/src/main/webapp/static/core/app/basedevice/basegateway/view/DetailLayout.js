Ext.define("core.basedevice.basegateway.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basegateway.detaillayout',
    funCode: "basegateway_detail",
    funData: {
        action: comm.get('baseUrl') + "/BaseGateway", //请求Action
        pkName: "uuid",
       // modelName: "com.zd.school.control.device.model.PtGateway", //实体全路径
        defaultObj: {}
    },
    /*关联此视图控制器*/
    controller: 'basedevice.basegateway.detailcontroller',
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "basedevice.basegateway.detailform"
    }]
})