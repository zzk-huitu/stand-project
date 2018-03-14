Ext.define("core.coursemanage.funcroomcourse.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.funcroomcourse.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    	var self = this
    },
    /** 该视图内的组件事件注册 */
    control: {
        "panel[xtype=coursemanage.funcroomcourse.maintree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid

                var mainlayout = btn.up("basepanel[xtype=coursemanage.funcroomcourse.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=coursemanage.funcroomcourse.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams=null;             //重置查询参数
                mainlayout.funData.roomLeaf=null;   //重置点击参数

                return false;
            }
        },
        
        "basetreegrid[xtype=coursemanage.funcroomcourse.maintree]": {
            itemclick: function(tree, record, item, index, e, eOpts) { 
            	this.loadMainGridStore(tree,record);                
                return false; 
             }
        },

       "basegrid[xtype=coursemanage.funcroomcourse.maingrid] button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {            
                var baseGrid = btn.up("panel[xtype=coursemanage.funcroomcourse.maingrid]");
                var funCode = baseGrid.funCode;
                var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                var funData = basePanel.funData;

                var roomLeaf = funData.roomLeaf;            

                if (roomLeaf != true) {
                    this.Warning("请选择功能室！");
                    return false;
                }
               
            }
        },

    },

   
    loadMainGridStore:function(tree,record){
        var self=this;
        var mainLayout = tree.up("panel[xtype=coursemanage.funcroomcourse.mainlayout]");
        var roomLeaf = record.get("leaf");
        var roomId = record.get("id");

        Ext.apply(mainLayout.funData, {
            roomId: roomId,
            roomLeaf: roomLeaf,
            roomName: record.get("text"),
        });
    
        var roomGrid = mainLayout.down("panel[xtype=coursemanage.funcroomcourse.maingrid]");

        //获取右边筛选框中的条件数据
//       var filter=self.getFastSearchFilter(roomGrid);
        //var filter = new Array();
        //额外必须的参数
        //filter.push({"type":"string","comparison":"=","value":areaId,"field":"claiId"});                
       

        if(roomLeaf==true)
            roomLeaf="1";
        else
            roomLeaf="0";

        var store = roomGrid.getStore();
        var proxy = store.getProxy();
        //附带参赛
        proxy.extraParams={
            roomId:roomId,
            roomLeaf:roomLeaf,
            //filter:JSON.stringify(filter)
        }
        store.loadPage(1);
        
        
    },
    
});