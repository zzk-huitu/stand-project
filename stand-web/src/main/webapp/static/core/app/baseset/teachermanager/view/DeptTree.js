Ext.define("core.baseset.teachermanager.view.DeptTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.teachermanager.depttree",
    dataUrl: comm.get('baseUrl') + "/SysOrg/getUserRightDeptTree",
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.baseset.model.BaseOrgTree", "checked").modelName,
    al: true,
    expandFirst:true,
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
            var mainlayout = tree.up("basepanel[xtype=baseset.teachermanager.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=baseset.teachermanager.teachergrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.deptId="";
         }
    }],
    listeners: {
        itemclick: function(grid, record, item, index, e) {
            var mainLayout = grid.up("panel[xtype=baseset.teachermanager.mainlayout]");
            var funData = mainLayout.funData;
            funData = Ext.apply(funData, {
                deptId: record.get("id"),
                isRight:record.get("isRight"),
                deptType:record.get("deptType")
            });
            //加载人员信息
            var userGrid = mainLayout.down("panel[xtype=baseset.teachermanager.teachergrid]");
            //获取快速搜索框的参数
            var girdSearchTexts = userGrid.query("field[funCode=girdFastSearchText]");
            var filter=new Array();
            if(girdSearchTexts[0].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "userName", "comparison": ""})
            }
            if(girdSearchTexts[1].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[1].getValue(), "field": "xm", "comparison": ""})
            }
            filter.push({"type": "string", "value": "1", "field": "category", "comparison": "="});
            filter = JSON.stringify(filter);
            var store = userGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                deptId: record.get("id"),
                filter: filter
            };
            store.load();

        
        }
    }
});