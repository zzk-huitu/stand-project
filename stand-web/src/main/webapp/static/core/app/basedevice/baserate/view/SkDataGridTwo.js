Ext.define("core.basedevice.baserate.view.SkDataGridTwo", {
    extend: "Ext.grid.Panel",
    alias: "widget.basedevice.baserate.skdatagridtwo",
    extParams: {},
    title: "<font color=#ffeb00>已选设备(选中后向左拖动或双击删除)</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
     store: {
        type: "basedevice.baserate.isselectstore"
    },
    viewConfig: {
        stripeRows: true
    },

    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        width:150,
        text: "设备名称",
        dataIndex: "termName",
        field: {
            xtype: "textfield"
        }
    }, {
        width:150,
        text: "序列号",
        dataIndex: "termSN",
        field: {
            xtype: "textfield"
        }
    }, {
        flex:1,
        minWidth:150,
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE" //字典代码
    }],
     viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=basedevice.baserate.dkmainlayout]");
                var selectGrid = basePanel.down("basegrid[xtype=basedevice.baserate.skdatagrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    },

});