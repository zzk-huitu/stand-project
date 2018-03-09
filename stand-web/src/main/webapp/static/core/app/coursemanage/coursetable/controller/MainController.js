Ext.define("core.coursemanage.coursetable.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.coursetable.maincontroller',
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
    	"basegrid[xtype=coursemanage.coursetable.maingrid] button[ref=gridImport]": {
            beforeclick: function (btn) {
                this.openImportView(btn);
                return false;
            }
        },
        
        "panel[xtype=coursemanage.coursetable.maingrid] button[ref=gridDownExcel]": {
            beforeclick: function(btn) {
                window.open(comm.get("baseUrl")+"/BaseAttachment/downLoadExcel?filename=/static/upload/excel/model/高中部课表导入模版.xls");
                return false;
            }
        },
        
        "panel[xtype=coursemanage.coursetable.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    var mainlayout = btn.up("basepanel[xtype=coursemanage.coursetable.mainlayout]");
                    var mianGrid = mainlayout.down("basegrid[xtype=coursemanage.coursetable.maingrid]");
                    var store = mianGrid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams.claiId="";
                    return false;
                }
            },
            
        "basetreegrid[xtype=coursemanage.coursetable.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) { 
            	this.loadMainGridStore(tree,record);                
                return false; 
             }
         },
    },

    openImportView:function(btn){
        var self = this;
        //得到组件
        var baseGrid = btn.up("basegrid");
    
        var win = Ext.create('Ext.Window', {
            title: "导入课程数据",
            iconCls: 'x-fa fa-clipboard',
            width: 450,
            resizable: false,
            constrain: true,
            autoHeight: true,
            modal: true,
            controller: 'public.importExcel.maincontroller',
            closeAction: 'close',
            plain: true,
            grid: baseGrid,
            items: [{
                xtype: "public.importExcel.importform",
                url:comm.get('baseUrl') + "/CourseArrange/importExcel",
                downUrl:comm.get('baseUrl') + "/CourseArrange/downNotImportInfo"
            }]
        });
        win.show();

    },
    
    loadMainGridStore:function(tree,record){
        var self=this;
        var mainLayout = tree.up("panel[xtype=coursemanage.coursetable.mainlayout]");
        var areaType = record.get("depth");
        var areaId = record.get("id");

        Ext.apply(mainLayout.funData, {
            areaId: areaId,
            areaType: areaType,
            areaName: record.get("text"),
        });
        
        var roomGrid = mainLayout.down("panel[xtype=coursemanage.coursetable.maingrid]");

        //获取右边筛选框中的条件数据
//        var filter=self.getFastSearchFilter(roomGrid);
        var filter = new Array();

        //额外必须的参数
//        filter.push({"type":"string","comparison":"!=","value":"0","field":"roomType"});                

        filter = JSON.stringify(filter);

        var store = roomGrid.getStore();
        var proxy = store.getProxy();
        //附带参赛
        proxy.extraParams={
            areaId:areaId,
            areaType:areaType,
            filter:filter
        }
        store.loadPage(1); // 给form赋值
    },
    
});