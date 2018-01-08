Ext.define("core.smartcontrol.userauthority.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.userauthority.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
        "basetreegrid[xtype=smartcontrol.userauthority.depttree] button[ref=gridRefresh]": {
          beforeclick: function(btn) {
           btn.up('basetreegrid').getStore().load();
           var baseGrid = btn.up("basetreegrid");
           var mainlayout = baseGrid.up("basepanel[xtype=smartcontrol.userauthority.mainlayout]");
           var mianGrid = mainlayout.down("basegrid[xtype=smartcontrol.userauthority.usergrid]");
           var store = mianGrid.getStore();
           var proxy = store.getProxy();
           proxy.extraParams.deptId="";
           return false;
       }
   },
}
});