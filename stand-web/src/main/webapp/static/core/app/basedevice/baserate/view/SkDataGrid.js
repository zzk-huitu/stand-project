Ext.define("core.basedevice.baserate.view.SkDataGrid", {
	 extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.baserate.skdatagrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    extParams: {
        whereSql: " where termTypeID=8"
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragGroup: 'secondGridDDGroup',
            dropGroup: 'firstGridDDGroup'
        }
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间存在设备<font color=red>（往右拖动或者双击选择）</font>',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->'],
    }, 
    panelButtomBar:{},
    al:false,
    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "设备名称",
        dataIndex: "termName",
        width:120
    }, {
        text: "序列号",
        dataIndex: "termSN",
        width:150
    }, {
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE", //字典代码
        flex:1
    }],
    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
            var data = record.data;
            var grid2 = grid.up('window').down('panel[xtype=basedevice.baserate.skdatagridtwo]');
            for (var i = 0; i < grid2.getStore().getCount(); i++) {
                if (data.uuid == grid2.getStore().getAt(i).get('uuid')) {
                    Ext.Msg.alert("提示", "该设备已存在选中列表，请勿重复操作");
                    return false;
                }
            };
            grid.getStore().removeAt(index); //将选中的移除
            grid2.getStore().insert(0, data); //加入到新的grid
            return false;
        },
        beforeitemclick: function(grid, record, item, index, e, eOpts) {
            return false;
        }
    }
});