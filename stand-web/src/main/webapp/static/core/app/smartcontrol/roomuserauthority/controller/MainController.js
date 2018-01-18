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
                    store.getProxy().extraParams.querySql="";
                    
                    return false;
                }
            },
        "basepanel basegrid button[ref=gridFastSearchBtn]": {
                beforeclick: function (btn) {
                 this.queryFastSearchForm(btn);
                 return false;
             }
         },

        "basepanel basegrid field[funCode=girdFastSearchText]": {
             specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                 this.queryFastSearchForm(field);
                 return false;
           }
         }
     },
    },
    queryFastSearchForm:function(btn){
        var self = this;

        var baseGrid = btn.up("basegrid");
        var toolBar = btn.up("toolbar");    

        //获取快速搜索框的值
        var girdSearchTexts = baseGrid.query("field[funCode=girdFastSearchText]");
        var querySql2="";
        if(girdSearchTexts[0].getValue()){
            querySql2+=" and XM like "+"'%"+girdSearchTexts[0].getValue()+"%'";

        }
        if(girdSearchTexts[1].getValue()){
            querySql2+=" and ROOM_NAME like "+"'%"+girdSearchTexts[1].getValue()+"%'";

        }
        
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.querySql2 =  querySql2 ;
        store.loadPage(1);
    },
});