Ext.define("core.basedevice.baserate.view.SkDataGrid", {
	extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.baserate.skdatagrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    extParams: {
        whereSql: " where termTypeID=8"
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
        }],
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
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var data = record.data;
                selectStore = grid.getStore();
               
                var basePanel = grid.up("panel[xtype=basedevice.baserate.dkmainlayout]");
                var isSelectGrid;
                if (basePanel) {
                    isSelectGrid = basePanel.down("panel[xtype=basedevice.baserate.skdatagridtwo]");
                    var isSelectStore = isSelectGrid.getStore();
                    for (var i = 0; i < isSelectStore.getCount(); i++) {
                        if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                            Ext.Msg.alert("提示", "该设备已存在选中列表，请勿重复操作");
                            return;
                        }
                    };
                    selectStore.removeAt(index);
                    isSelectStore.insert(0, [record]);
                }

                return false;
            }
        }
    },

});