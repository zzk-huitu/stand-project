Ext.define("core.wisdomclass.classmotto.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classmotto.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil',
        TreeUtil:'core.util.TreeUtil'},
    init: function () {
       /*执行一些初始化的代码*/  
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"panel[xtype=wisdomclass.classmotto.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    var mainlayout = btn.up("basepanel[xtype=wisdomclass.classmotto.mainlayout]");
                    var mianGrid = mainlayout.down("basegrid[xtype=wisdomclass.classmotto.maingrid]");
                    var store = mianGrid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams.claiId="";
                    return false;
                }
            },
        "basetreegrid[xtype=wisdomclass.classmotto.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("panel[xtype=wisdomclass.classmotto.mainlayout]");
                mainLayout.funData.claiId=record.get("id");

                var storeGrid = mainLayout.down("panel[xtype=wisdomclass.classmotto.maingrid]");
                var store = storeGrid.getStore();
                var proxy = store.getProxy();

                //获取右边筛选框中的条件数据
                var filter=self.getFastSearchFilter(storeGrid);       
                if(filter.length==0)
                    filter=null;
                else
                    filter = JSON.stringify(filter);
                //获取点击树节点的参数            
                var claiId= record.get("id");
                var claiIdLeaf=record.get("leaf");
                if(claiIdLeaf==true)
                    claiIdLeaf="1";
                else
                    claiIdLeaf="0";

                //附带参赛
                proxy.extraParams={
                    claiId: record.get("id"),
                    claiIdLeaf:claiIdLeaf,
                    filter:filter
                }
                store.loadPage(1); 
                return false;
            }
        },
    },

    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "className", "comparison": ""})
        }
        return filter;

    }
});