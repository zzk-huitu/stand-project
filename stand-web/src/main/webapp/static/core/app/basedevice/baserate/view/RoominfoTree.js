Ext.define("core.basedevice.baserate.view.RoominfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.baserate.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    selModel: {
        
    },
    extParams: {
        whereSql: "",
        orderSql: "",
        excludes:"checked"
    },
    title:"区域信息",
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
//    	checkchange: function(node, state) {
//            var mainLayout = Ext.ComponentQuery.query("panel[xtype=basedevice.baserate.dkmainlayout]")[0];
//                var record = node.raw;
//                var level = record.level;
//                //递归选中孩子节点
//                var eachChild = function(node, checked) {
//                    node.eachChild(function(n) {
//                        if (!Ext.isEmpty(n.get('checked'))) {
//                            n.set('checked', checked);
//                            n.commit();
//                        }
//                        eachChild(n, checked);
//                    });
//                };
//                eachChild(node, state);
//                var tree = mainLayout.down("panel[xtype=basedevice.baserate.roominfotree]");
//                var selRecords = new Array();
//                var records = tree.getChecked();
//                if (records.length <= 0) {
//                    records = tree.getSelectionModel().getSelection();
//                }
//                Ext.each(records, function(rec) {
//                    if (!rec.raw.disabled) {
//                        selRecords.push("'"+rec.data.id+"'");
//                    }
//                });
//                var storeyGrid = mainLayout.down("panel[xtype=basedevice.baserate.skdatagGrid]");
//                var store = storeyGrid.getStore();
//                var proxy = store.getProxy();
//                store.removeAll();
//                var whereSql = " where roomId in (" + selRecords.join(',') + ")  and termTypeID=9";
//                proxy.extraParams = {
//                      whereSql: whereSql
//                  };
//                store.load(); // 给form赋值
//            }
    	
        itemclick: function (tree, record, item, index, e, eOpts) {
    		var mainLayout =tree.up("panel[xtype=basedevice.baserate.dkmainlayout]");
    		var win = mainLayout.up('window');
    		var categroy = win.categroy;
    		var funData = mainLayout.funData;
            var roomId=record.get("id");
            var leaf = record.get("leaf");
            var filter="[]";
            mainLayout.funData = Ext.apply(funData, {
                roomId: roomId,
                leaf : record.get("leaf"),//true: 房间 false:区域
                arealevel: record.get("level"),
            });
            // 加载房间的人员信息
            var mianGrid = mainLayout.down("panel[xtype=basedevice.baserate.skdatagrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.roomId=roomId;
            proxy.extraParams.leaf=leaf;
            proxy.extraParams.filter=filter;
            store.loadPage(1); // 给form赋值
            return false;
    		
    	}
     }
})