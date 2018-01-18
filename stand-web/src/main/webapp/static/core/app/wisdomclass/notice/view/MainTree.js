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
            proxy.extraParams.noticeType=""; 
            proxy.extraParams.noticeLevel="";
         }
    }],

});