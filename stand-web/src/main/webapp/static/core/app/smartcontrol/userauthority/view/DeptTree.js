Ext.define("core.smartcontrol.userauthority.view.DeptTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.smartcontrol.userauthority.depttree",
    dataUrl: comm.get('baseUrl') + "/SysOrg/treeList",
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.baseset.model.BaseOrgTree", "checked").modelName,
    al: true,
    expandFirst:true,
    scrollable:true,
   // title: "部门列表",
    selModel: {
        selType: ""
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by parentNode,orderIndex asc",
        excludes:"checked"      //排除这个字段，不显示复选框
    },

    columnLines:false,
    multiSelect: false,
    lines:true,
    useArrows: false,
    viewConfig: {
        stripeRows: false
    },
/*
    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function(event, toolEl, header) {
            var tree = header.ownerCt
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true);
            var mainlayout = tree.up("basepanel[xtype=system.user.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=system.user.usergrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.deptId="";
         }
    }],*/
     tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '部门列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:600
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
        }]
    },
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items:[{
            text: "部门名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1
        },/* {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:60
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },
    listeners: {
        itemclick: function(grid, record, item, index, e) {
            var mainLayout = grid.up("basepanel[xtype=smartcontrol.userauthority.mainlayout]");
            var funData = mainLayout.funData;
            funData = Ext.apply(funData, {
                deptId: record.get("id"),
                /*isRight:record.get("isRight"),
                deptType:record.get("deptType")*/
            });
            //加载人员信息
            var userGrid = mainLayout.down("panel[xtype=smartcontrol.userauthority.usergrid]");
            var store = userGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                deptId: record.get("id")
            };
            store.load();

        }
    }
});
