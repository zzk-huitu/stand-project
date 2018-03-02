Ext.define("core.basedevice.baserate.view.RoominfoTree", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.baserate.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    expandFirst:true,
    sortableColumns:false,
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
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
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
            flex:1
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    },
    listeners: {
        itemclick: function (tree, record, item, index, e, eOpts) {
            var baseformwin =tree.up("baseformwin");
            var categroy = baseformwin.categroy;
            var filter=new Array();
            if(categroy==0){//水控
                filter.push({"type": "string", "value":"8", "field": "termTypeID", "comparison": "="})
            }else if(categroy==1){//电控
                filter.push({"type": "string", "value": "9", "field": "termTypeID", "comparison": "="})
            }
            if(filter.length==0)
                filter=null;
            else
                filter = JSON.stringify(filter);

            var mainLayout =tree.up("panel[xtype=basedevice.baserate.dkmainlayout]");
    		var funData = mainLayout.funData;
            var roomId=record.get("id");
            var roomLeaf=record.get("leaf");
            if(roomLeaf==true)
                roomLeaf="1";
            else
                roomLeaf="0";
            mainLayout.funData = Ext.apply(funData, {
                roomId: roomId,
                leaf :record.get("leaf"),//true: 房间 false:区域
            });
            // 加载房间的人员信息
            var mianGrid = mainLayout.down("panel[xtype=basedevice.baserate.skdatagrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
               proxy.extraParams={
                roomId:roomId,
                roomLeaf:roomLeaf,
                filter:filter
            };
            store.loadPage(1); // 给form赋值
            return false;
    		
    	}
     }
})