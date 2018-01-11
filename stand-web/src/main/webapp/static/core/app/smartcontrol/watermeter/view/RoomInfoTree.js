Ext.define("core.smartcontrol.watermeter.view.RoomInfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.smartcontrol.watermeter.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.plartform.comm.model.CommTree",
    al: true,
    expandFirst:true,
    forceFit:true,
    sortableColumns:false,
    multiSelect: false,
    selModel: {
      
    },
    extParams: {
        whereSql: "",
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
            iconCls: 'x-fa fa-refresh'
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
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    },
    listeners: {
        itemclick: function (tree, record, item, index, e, eOpts) {
            
            var mainLayout = tree.up("panel[xtype=smartcontrol.watermeter.binddetaillayout]");
            //var funData = mainLayout.funData;
            var roomId=record.get("id");
            var leaf = record.get("leaf");
         
                /*
                mainLayout.funData = Ext.apply(funData, {
                    roomId: roomId,
                    leaf : record.get("leaf"),//true: 房间 false:区域
                    arealevel: record.get("level"),
                });
                */
                // 加载信息
                var mianGrid = mainLayout.down("panel[xtype=smartcontrol.watermeter.devicegrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId=roomId;
                store.loadPage(1); 

            

            return false;        
        }
    }
});