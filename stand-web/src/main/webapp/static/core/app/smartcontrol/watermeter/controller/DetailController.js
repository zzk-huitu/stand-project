Ext.define("core.smartcontrol.watermeter.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.watermeter.detailcontroller',
    mixins: {},
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"panel[xtype=smartcontrol.watermeter.roominfotree] button[ref=gridRefresh]": {
            click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=smartcontrol.watermeter.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=smartcontrol.watermeter.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                proxy.extraParams.roomLeaf="";
                return false;
            }
        },

    }
});