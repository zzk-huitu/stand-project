Ext.define("core.basedevice.basedeviceallot.view.DeviceSysGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.basedevice.basedeviceallot.devicesysgrid",
    title: "<font color='#ffeb00'>选中的设备 (双击添加或删除)</font>",
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
        type: "basedevice.basedeviceallot.isselectstore"
    },
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            text: "机号",
            dataIndex: "termNo",
            hidden: true
        },{
            text: "序列号",
            dataIndex: "termSN",
            hidden: true
        },{
            text: "房间名称",
            dataIndex: "roomName",
            width:100
        }, {
            text: "设备名称",
            dataIndex: "termName",
            width:100
        }, {
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE", //字典代码
            width:100
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",
            width:100
        }]
    },
    
    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
            var mainlayout = grid.up('panel[xtype=basedevice.basedeviceallot.deviceallotlayout]');
            var deviceAllotGrid = mainlayout.down("panel[xtype=basedevice.basedeviceallot.deviceallotgrid]");
            var roomName = undefined;
            var roomId = undefined;
            var termName = undefined;
            var tremId = undefined;
            var termTypeID = undefined;
            var gatewayName = undefined;
            termName = record.get('termName');
            termTypeID = record.get('termTypeID');
            gatewayName = record.get('gatewayName');
            tremId = record.get('uuid');
            var data = {
                gatewayName: gatewayName,
                termTypeID: termTypeID,
                termName: termName,
                uuid: tremId,
                termNo:record.get('termNo'),
                termSN:record.get('termSN'),
            };
            grid.getStore().removeAt(index); //将选中的移除
            deviceAllotGrid.getStore().insert(0, data); //加入到新的grid
            return false;
        },
        beforeitemclick: function() {
            return false;
        }
    }
    
});