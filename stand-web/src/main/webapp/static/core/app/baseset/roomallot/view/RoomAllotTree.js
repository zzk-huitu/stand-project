Ext.define("core.baseset.roomallot.view.RoomAllotTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.roomallot.roomallottree",
    dataUrl: comm.get('baseUrl') + "/BaseOfficeAllot/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    selModel: {},
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:600
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: '',
            titleAlign:'right'
        }]
    },
    extParams: {
        whereSql: "",
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
            minWidth:200
        }, {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:80
        },{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },

    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=baseset.roomallot.mainlayout]");
            var basetreegrid = mainLayout.down("basetreegrid[xtype=baseset.roomallot.roomallottree]");
            var funData = mainLayout.funData;
            var roomId=record.get("id");
            mainLayout.funData = Ext.apply(funData, {
                roomId: roomId,
                arealevel: record.get("level"),
            });
            // 加载房间的人员信息
            var mianGrid = mainLayout.down("panel[xtype=baseset.roomallot.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.roomId=roomId;
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
})