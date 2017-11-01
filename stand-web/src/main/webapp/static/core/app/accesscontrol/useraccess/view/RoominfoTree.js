Ext.define("core.accesscontrol.useraccess.view.RoominfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.accesscontrol.useraccess.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    forceFit:true,
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
                fontSize: '14px',
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
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    },
    listeners: {
        itemclick: function (tree, record, item, index, e, eOpts) {
        	var mainLayout = tree.up("panel[xtype=accesscontrol.useraccess.mainlayout]");
        	var funData = mainLayout.funData;
            var roomId=record.get("id");
            var leaf = record.get("leaf");
            mainLayout.funData = Ext.apply(funData, {
                roomId: roomId,
                leaf : record.get("leaf"),//true: 房间 false:区域
                arealevel: record.get("level"),
            });
            // 加载房间的人员信息
            var mianGrid = mainLayout.down("panel[xtype=accesscontrol.useraccess.mjuserrightgrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.roomId=roomId;
            proxy.extraParams.leaf=leaf;
            store.loadPage(1); // 给form赋值
            return false;
        	
        }
    }
});