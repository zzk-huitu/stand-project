Ext.define("core.wisdomclass.classpersence.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classpersence.maincontroller',
    mixins: {},
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"panel[xtype=wisdomclass.classpersence.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    var mainlayout = btn.up("basepanel[xtype=wisdomclass.classpersence.mainlayout]");
                    var mianGrid = mainlayout.down("basegrid[xtype=wisdomclass.classpersence.maingrid]");
                    var store = mianGrid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams.claiId="";
                    return false;
                }
            },
        }
});