Ext.define("core.smartcontrol.roomuserauthority.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.roomuserauthority.maincontroller',
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
                 // 树刷新
            "basetreegrid[xtype=smartcontrol.roomuserauthority.mjuserrighttree] button[ref=gridRefresh]": {
                beforeclick: function(btn) {
                    var baseGrid = btn.up("panel[xtype=smartcontrol.roomuserauthority.mjuserrighttree]");
                    var store = baseGrid.getStore();
                    store.load(); // 刷新父窗体的grid

                    var mainLayout= baseGrid.up("panel[xtype=smartcontrol.roomuserauthority.mainlayout]");
                    var storeyGrid = mainLayout.down("panel[xtype=smartcontrol.roomuserauthority.maingrid]");
                    var store = storeyGrid.getStore();
                    store.removeAll();
                    
                    return false;
                }
            },
    }
});