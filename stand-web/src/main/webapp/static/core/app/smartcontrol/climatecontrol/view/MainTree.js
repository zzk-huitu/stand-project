Ext.define("core.smartcontrol.climatecontrol.view.MainTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.smartcontrol.climatecontrol.maintree",
    model:" com.zd.school.plartform.comm.model.CommTree",
    dataUrl:comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    expandFirst:true,
    selModel: {},
    sortableColumns:false,
    multiSelect: false,
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间区域',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh'
        }]
    },
    extParams: {
        excludes: 'checked',
        whereSql: "",
        orderSql: " order by orderIndex asc "
    },
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1,
            minWidth:150
        }, /*{
            text: "顺序号",
            dataIndex: "orderIndex",
            width:100
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=smartcontrol.climatecontrol.mainlayout]");
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                roomId: record.get("id"),
                roomLevel: record.get("level")
            });
            // 加载人员信息
            var grid = mainLayout.down("panel[xtype=smartcontrol.climatecontrol.maingrid]");
            var store = grid.getStore();
            var proxy = store.getProxy();

            var filter = '[{"type":"string","comparison":"","value":"空调","field":"deviceTypeName"}]';
            proxy.extraParams = {
                roomId: record.get("id"),
                filter :filter
            };            
            store.load(); // 给form赋值        
        }
    }
});