Ext.define("core.basedevice.ptirroomdevice.view.RoominfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.ptirroomdevice.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    selModel: {
      
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: "",
        excludes:"checked"
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
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: ''
        }]
    },
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "区域名称",
            dataIndex: "text",
            xtype: 'treecolumn',
            width: comm.get("clientWidth") * 0.24
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    },
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=basedevice.ptirroomdevice.mainlayout]");
            var storeyGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: "[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]"
            };
            store.load(); // 给form赋值
            return false;
        }
    }
});