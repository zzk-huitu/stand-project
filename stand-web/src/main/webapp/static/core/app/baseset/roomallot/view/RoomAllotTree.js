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
                fontWeight:800
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
            width:100
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
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'roomId'}]";
            //filter += ",{'type':'integer','comparison':'=','value':0,'field':'isDelete'}]";
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                areaId: record.get("id"),
                areaType: record.get("areaType"),
               /* claiId: record.get("id"),
                claiLevel: record.get("level"),*/
                filter: filter
            });
            // 加载人员信息
            var mianGrid = mainLayout.down("panel[xtype=baseset.roomallot.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter,
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
})