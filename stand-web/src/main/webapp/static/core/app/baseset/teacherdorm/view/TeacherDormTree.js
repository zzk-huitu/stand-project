Ext.define("core.baseset.teacherdorm.view.TeacherDormTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.teacherdorm.teacherdormtree",
    dataUrl: comm.get('baseUrl') + "/BaseTeacherDrom/treelist",
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
            titleAlign:'right',
        }]
    },
    extParams: {
        whereSql: ""
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
            width:60
        },{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
  },

    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=baseset.teacherdorm.mainlayout]");
            var treePanel = mainLayout.down("panel[xtype=baseset.teacherdorm.teacherdormtree]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'dormId'}]";
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                dormId: record.get("id"),
                roomId: record.get("iconCls"),
                roomName:record.get("text"),
                roomLevel: record.get("level"),
                filter: filter
            });
            // 加载人员信息
            var storeyGrid = mainLayout.down("panel[xtype=baseset.teacherdorm.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                querySql: " and dormId='"+record.get("id")+"'",
                id:record.get("id"),
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
})