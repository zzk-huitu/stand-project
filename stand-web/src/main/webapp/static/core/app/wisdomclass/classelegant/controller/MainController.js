Ext.define("core.wisdomclass.classelegant.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classelegant.maincontroller',
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
    	"panel[xtype=wisdomclass.classelegant.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=wisdomclass.classelegant.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=wisdomclass.classelegant.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.claiId="";
                return false;
            }
        },
       "basetreegrid[xtype=wisdomclass.classelegant.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("panel[xtype=wisdomclass.classelegant.mainlayout]");
                mainLayout.funData.claiId=record.get("id");

                var storeGrid = mainLayout.down("panel[xtype=wisdomclass.classelegant.maingrid]");
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

        "basegrid button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {
                /*处理基础数据，处理完后再调用公共的弹出界面的方法*/
                var result=this.doData(btn);

                if(!result)
                    return false;
            }
        },
    },
    doData:function(btn){
        var self=this;

        var basePanel = btn.up("basepanel[funCode=classelegant_main]");
        var mainTree=basePanel.down("basetreegrid");
        var treeSelect=mainTree.getSelectionModel().getSelection();
        
        if(treeSelect.length!=1){
            self.msgbox("请选择一个班级！")
            return false;
        }
        var data=treeSelect[0].getData();
        
        if(!data.leaf){
            self.msgbox("请选择一个班级！")
            return false;
        }
        basePanel.funData.defaultObj={
            claiId:data.id,
            className:data.text
        };

        return true;
    },
    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "title", "comparison": ""})
        }
        return filter;

    }
});