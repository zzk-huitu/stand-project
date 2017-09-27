Ext.define("core.baseset.roomdefine.view.RoomDefineTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.roomdefine.roomdefinetree",
    dataUrl: comm.get('baseUrl') + "/BuildRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: false,
    selModel: {
      
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: ""
    },
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
        width:250
    }, {
        text: "顺序号",
        dataIndex: "orderIndex"
    },{
        text:"主键",
        dataIndex:'id',
        hidden:true
    }]
  },
  listeners: {
    itemclick: function(view, record, item, index, e) {
            var basepanel = view.up("basepanel[xtype=baseset.roomdefine.mainlayout]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'areaId'}";
            filter += ",{'type':'integer','comparison':'=','value':0,'field':'isDelete'}]";
            var funData = basepanel.funData;
            basepanel.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                claiLevel: record.get("level"),
                filter: filter
            });
            // 加载人员信息
            var basegrid = basepanel.down("basegrid[xtype=baseset.roomdefine.maingrid]");
            var store = basegrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter,
                page: 1
            };
            store.load(); // 给form赋值
            return false;
        }
    }
})