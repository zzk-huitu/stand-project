Ext.define("core.wisdomclass.notice.view.MainTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.wisdomclass.notice.maintree",
    dataUrl: comm.get('baseUrl') + "/OaNotice/getTypeTree",
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.comm.model.CommTree", "checked").modelName,
    al: true,
    expandFirst:true,
    scrollable:true,
    title: "信息分类",    
    extParams: {        
    },

    columnLines:false,
    multiSelect: false,
    selModel: null,
    lines:true,
    useArrows: false,
    viewConfig: {
        stripeRows: false
    },

    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function(event, toolEl, header) {
            var tree = header.ownerCt
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true);
            var mainlayout = tree.up("basepanel[xtype=wisdomclass.notice.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=wisdomclass.notice.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams=null;
         }
    }],

    listeners: {
        itemclick: function(grid, record, item, index, e) {

            var mainLayout = grid.up("panel[xtype=wisdomclass.notice.mainlayout]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'noticeType'}]"
            if(record.get("level")==1){
                filter = "";
            }

            var funData = mainLayout.funData;
            funData = Ext.apply(funData, {
                noticeType: record.get("id"),
                noticeTypeName: record.get("text"),
                noticeLevel: record.get("level"),
                filter: filter
            });

            //加载表格信息
            var mainGrid = mainLayout.down("panel[xtype=wisdomclass.notice.maingrid]");
            var store = mainGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter,
                noticeLevel: record.get("level"),
            };
            store.loadPage(1);

        }
    }
});