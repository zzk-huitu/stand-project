Ext.define("core.baseset.teacherdorm.view.TeacherDormTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.teacherdorm.teacherdormtree",
    dataUrl: comm.get('baseUrl') + "/BaseTeacherDrom/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    selModel: {},
    expandFirst:true,
    sortableColumns:false,
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
            iconCls: 'x-fa fa-refresh',
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
            flex: 1
        },/* {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:60
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
  },

    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=baseset.teacherdorm.mainlayout]");
            var treePanel = mainLayout.down("panel[xtype=baseset.teacherdorm.teacherdormtree]");
            var dormId = record.get("id");
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                dormId: dormId,
                //roomId: record.get("iconCls"),
                roomId: record.get("id"),
                roomName:record.get("text"),
                leaf: record.get("leaf"),
            });
            // 加载人员信息
            var storeyGrid = mainLayout.down("panel[xtype=baseset.teacherdorm.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                dormId:dormId,
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
})