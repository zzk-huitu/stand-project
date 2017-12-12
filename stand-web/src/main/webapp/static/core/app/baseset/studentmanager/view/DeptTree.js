Ext.define("core.baseset.studentmanager.view.DeptTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.studentmanager.depttree",
    dataUrl: comm.get('baseUrl') + "/SysOrg/treeList",
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.baseset.model.BaseOrgTree", "checked").modelName,
    al: true,
    scrollable:true,
    title: "部门列表",
    selModel: {
        selType: ""
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by parentNode,orderIndex asc",
        excludes:"checked"
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
            var mainlayout = tree.up("basepanel[xtype=baseset.studentmanager.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=baseset.studentmanager.studentgrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.deptId="";
         }
    }],

    listeners: {
        itemclick: function(grid, record, item, index, e) {
            var mainLayout = grid.up("panel[xtype=baseset.studentmanager.mainlayout]");
            var funData = mainLayout.funData;
            funData = Ext.apply(funData, {
                deptId: record.get("id"),
                isRight:record.get("isRight"),
                deptType:record.get("deptType")
            });
            //加载人员信息
            var userGrid = mainLayout.down("panel[xtype=baseset.studentmanager.studentgrid]");
            var store = userGrid.getStore();
            var proxy = store.getProxy();
            var filter = "[{'type':'string','comparison':'=','value':'2','field':'category'}]";
            proxy.extraParams = {
                deptId: record.get("id"),
                filter :filter
            };
            store.load();

        }
    }
});