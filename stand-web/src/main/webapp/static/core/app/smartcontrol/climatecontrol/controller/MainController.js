Ext.define("core.smartcontrol.climatecontrol.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.climatecontrol.maincontroller',
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
    	"panel[xtype=smartcontrol.climatecontrol.maintree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=smartcontrol.climatecontrol.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=smartcontrol.climatecontrol.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                return false;
            }
        },


        "basegrid button[ref=gridOpen]": {
            beforeclick: function(btn) {
                console.log(1);
                return false;
            }
        },
        "basegrid button[ref=gridClose]": {
            beforeclick: function(btn) {
                console.log(2);
                return false;
            }
        },
        "basegrid button[ref=gridSet]": {
            beforeclick: function(btn) {
                console.log(3);
                return false;
            }
        },

        //操作列
        "basegrid actioncolumn": {
            opneClick: function (data) {
                console.log(11);
                return false;
            },           
            closeClick:function(data){
                console.log(22);
                return false;
            },           
            setClick:function(data){
                console.log(33);
                return false;
            },
        },
    },
    
});