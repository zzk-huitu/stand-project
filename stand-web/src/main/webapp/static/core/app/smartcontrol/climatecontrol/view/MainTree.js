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
});