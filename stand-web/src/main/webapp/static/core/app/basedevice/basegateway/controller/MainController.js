Ext.define("core.basedevice.basegateway.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.basegateway.maincontroller',
    mixins: {
       
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
       
    },
    init: function () {
         this.control({

              //区域列表刷新按钮事件
            "basetreegrid[xtype=basedevice.basegateway.ptgatewaytree] button[ref=gridRefresh]": {
                click: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },
         });
    },

 
   // control: {}
});
