Ext.define("core.public.selectGateway.view.IsSelectGatewayGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.public.selectGateway.isselectgatewaygrid",
    ref: 'isselectusergrid',
    title: "<font color='#ffeb00'>已选服务器(选中后向左拖动或双击移除）</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
    viewConfig: {
        stripeRows: true
    },
    store: {
        type: "public.selectGateway.isselectedgatewaystore"
    },
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "机号",
            dataIndex: "gatewayNo",            
            width: 100,
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",            
            minWidth: 100,
            flex:1
        }, {
            width: 100,
            text: "前置名称",
            dataIndex: "frontServerName",           
        }, {
            width: 100,
            text: "序列号",
            dataIndex: "gatewaySN",            
        },{
            width: 100,
            text: "网关IP",
            dataIndex: "gatewayIP",
        }]
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=public.selectGateway.selectgatewaylayout]");
                var selectGrid = basePanel.down("panel[xtype=public.selectGateway.selectgatewaygrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
});