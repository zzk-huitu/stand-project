Ext.define("core.basedevice.baserate.view.SkDataGridTwo", {
	 extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.baserate.skdatagridtwo",
    model: "com.zd.school.control.device.model.PtTerm",
    title: "选中数据<font color=blue>（往左拖动或者双击删除）</font>",
    al:false,
    noPagging: true,
    panelTopBar:{},
    panelButtomBar:{},
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragGroup: 'firstGridDDGroup',
            dropGroup: 'secondGridDDGroup'
        }
    },
    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "设备名称",
        dataIndex: "termName",
        field: {
            xtype: "textfield"
        }
    }, {
        text: "序列号",
        dataIndex: "termSN",
        field: {
            xtype: "textfield"
        }
    }, {
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE" //字典代码
    }],
    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
            var data = record.data;
            var grid2 = grid.up('window').down('panel[xtype=basedevice.baserate.skdatagrid]');
            grid.getStore().removeAt(index); //将选中的移除
            grid2.getStore().insert(0, data); //加入到新的grid
            return false;
        },
        beforeitemclick: function(grid, record, item, index, e, eOpts) {
            return false;
        }
    }
});