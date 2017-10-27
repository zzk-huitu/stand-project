Ext.define("core.basedevice.basedeviceallot.view.DeviceSysGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.basedeviceallot.devicesysgrid",
    model: "com.zd.school.control.device.model.PtTerm",
    extParams: {
        whereSql: " and isDelete='0' ",
    },
    al:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '选中的设备  (双击添加或删除)',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '保存列表数据',
            ref: 'gridAdde',
            iconCls: 'x-fa fa-plus-circle'
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            text: "房间名称",
            dataIndex: "roomName",
        }, {
            text: "设备名称",
            dataIndex: "termName",
        }, {
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE" //字典代码
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",
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
                uuid: tremId
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