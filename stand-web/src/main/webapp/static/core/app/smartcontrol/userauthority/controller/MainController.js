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
      "basetreegrid[xtype=smartcontrol.userauthority.depttree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("basepanel[xtype=smartcontrol.userauthority.mainlayout]");
                var funData = mainLayout.funData;
                funData = Ext.apply(funData, {
                  deptId: record.get("id"),
                /*isRight:record.get("isRight"),
                deptType:record.get("deptType")*/
              });

                var storeGrid = mainLayout.down("panel[xtype=smartcontrol.userauthority.usergrid]");
                var store = storeGrid.getStore();
                var proxy = store.getProxy();

                //获取右边筛选框中的条件数据
                var filter=self.getFastSearchFilter(storeGrid);           
                 if(filter.length==0)
                    filter=null;
                else
                    filter = JSON.stringify(filter); 
                 //附带参赛
                proxy.extraParams = {
                  deptId: record.get("id"),
                  filter:filter
                };
                store.loadPage(1); 
                return false;
           }
        },
      "basegrid[xtype=smartcontrol.userauthority.maingrid] button[ref=gridFastSearchBtn]": {
          beforeclick: function (btn) {
           this.queryFastSearchForm(btn);
           return false;
         }
       },

      "basegrid[xtype=smartcontrol.userauthority.maingrid] field[funCode=girdFastSearchText]": {
         specialkey: function (field, e) {
          if (e.getKey() == e.ENTER) {
           this.queryFastSearchForm(field);
           return false;
         }
       }
     },
 },
 getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "xm", "comparison": ""})
        }
        return filter;
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