Ext.define("core.public.selectJob.view.IsSelectJobGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.pubselect.isselectjobgrid",
    ref: 'isselectjobgrid',
    title: "<font color='#ffeb00'>已选岗位(选中后向左拖动或双击移除）</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
    store: {
        type: "public.selectJob.isselectedjobstore"
    },
    
    viewConfig: {
        stripeRows: true
    },
    columns: [{
        xtype: "rownumberer",
        flex:0,
        width: 50,
        text: '序号',
        align: 'center'
    },{
        text: "名称",
        dataIndex: "jobName",
        flex: 2
    }, {
        text: "编码",
        dataIndex: "jobCode",
        flex: 1
    }, {
        text: "级别",
        dataIndex: "orderIndex",
        flex: 1
    }],
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=pubselect.selectjoblayout]");
                var selectGrid = basePanel.down("panel[xtype=pubselect.selectjobgrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
});