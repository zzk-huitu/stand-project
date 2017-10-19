Ext.define("core.basedevice.ptirroomdevice.view.RoominfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.ptirroomdevice.roominfotree",
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
        itemclick: function (tree, record, item, index, e, eOpts) {
//            var mainLayout = tree.up("panel[xtype=basedevice.ptirroomdevice.mainlayout]");
//            var areaId = record.get("id");
//            var level = record.get("level");
//            var filter = [];
//            var roomIds = new Array();
//            
//            filter.push({"type":"string","comparison":"=","value": areaId ,"field":"areaId"});
//            var funData = mainLayout.funData;
//            mainLayout.funData = Ext.apply(funData, {
//                areaId: record.get("id"),
//                areaName: record.get("text"),
//                level:record.get("level"),
//                roomIds:roomIds.join(","),
//                filter: JSON.stringify(filter),
//            });
//            // 加载对应的房间信息
//            var roomGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
//            var store = roomGrid.getStore();
//            var proxy = store.getProxy();
//
//            if(level==5){
//                    roomIds.push(record.id);
//            }
//            
//            if(level==4){
//            	var childrens = record.childNodes;
//                Ext.each(childrens, function (rec) {
//                    var roomId = rec.id;
//                    roomIds.push(roomId);
//                });
//            }
//            
//            if(level==3){
//            	var childrens = record.childNodes;
//                for(var i=0;i<childrens.length;i++){
//                	Ext.each(childrens[i].childNodes, function (rec) {
//                        var roomId = rec.id;
//                        roomIds.push(roomId);
//                    });
//                }
//            }
//            
//            proxy.extraParams.filter = JSON.stringify(filter);
//            proxy.extraParams.areaId= areaId;
//            proxy.extraParams.level= level;
//            proxy.extraParams.roomIds= roomIds.join(",");
//            store.loadPage(1); // 给form赋值
//            return false;
    
//        itemclick: function(view, record, item, index, e) {
//            var mainLayout = view.up("panel[xtype=basedevice.ptirroomdevice.mainlayout]");
//            var storeyGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
//            var store = storeyGrid.getStore();
//            var proxy = store.getProxy();
//            proxy.extraParams = {
//                filter: "[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]"
//            };
//            store.load(); // 给form赋值
//            return false;
//        }
//    }
        	var mainLayout = tree.up("panel[xtype=basedevice.ptirroomdevice.mainlayout]");
        	var basetreegrid = mainLayout.down("basetreegrid[xtype=basedevice.ptirroomdevice.roominfotree]");
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
            var mianGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.roomId=roomId;
            proxy.extraParams.leaf=leaf;
            proxy.extraParams.filter=filter;
            store.loadPage(1); // 给form赋值
            return false;
        	
        }
    }
});