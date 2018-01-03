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
    }
});