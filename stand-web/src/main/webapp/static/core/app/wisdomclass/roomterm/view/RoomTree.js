Ext.define("core.wisdomclass.roomterm.view.RoomTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.wisdomclass.roomterm.roomtree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree", 
    extParams: {
        whereSql: "",
        excludes: "checked"
    },
    expandFirst:true,
    selModel: null,  
    sortableColumns:false,
/*    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function (event, toolEl, header) {
            var tree = header.ownerCt
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true);
        }
    }],*/
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间列表',
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