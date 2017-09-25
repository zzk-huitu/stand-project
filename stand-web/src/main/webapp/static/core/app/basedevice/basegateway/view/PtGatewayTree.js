Ext.define("core.basedevice.basegateway.view.PtGatewayTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.basegateway.ptgatewaytree",
    dataUrl: comm.get('baseUrl') + "/BaseGateway/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    selModel: {
        selType: "checkboxmodel",
        mode: "single"
    },

    //title: "区域信息",
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
            iconCls: ''
        }]
    },
    extParams: {
        whereSql: "",
    },
   
  columns: {
     defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "区域名称",
            dataIndex: "text",
            xtype: 'treecolumn',
            flex: 1,
            minWidth:100

        },{
            text: "主键",
            dataIndex: 'id',
            hidden: true
     }]
  },
 //排序字段及模式定义
    defSort: [{
        property: 'gatewayName',
        direction: 'DESC'
    }],
 
    listeners: {
        itemclick: function(view, record, item, index, e) {
          
            var basepanel = view.up("basepanel[xtype=basedevice.basegateway.mainlayout]");
           // 加载人员信息
            var basegrid = basepanel.down("basegrid[xtype=basedevice.basegateway.miangrid]");
            var store = basegrid.getStore();
            var id = record.get('id');
            var filter=[];
            var proxy = store.getProxy();
            if (id!= 1) {
             //filter.push({"type":"string","value":"'+record.get("id")+'","field":"frontserverId","comparison":"="});
            filter.push({"type": "string", "value":  record.get("id") , "field": "frontserverId", "comparison": ""});
             }
             proxy.extraParams.filter = JSON.stringify(filter);
           //proxy.extraParams.filter='[{"type":"string","value":"'+record.get("id")+'","field":"frontserverId","comparison":"="}]';
            store.load(); // 给form赋值
            return false;
        }
    }
})