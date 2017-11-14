Ext.define("core.basedevice.irdevice.view.IrBrandTreeGrid", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.irdevice.irbrandtreegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtIrDeviceBrand/treelist",
    model: "com.zd.school.plartform.comm.model.CommTree",
    selModel: {
      
    },
    sortableColumns:false,
    extParams: {
        excludes:"checked"
    },
    title: "品牌信息",
    tbar: [{
        xtype: 'button',
        text: '添加下级',
        ref: 'gridAdd',
        iconCls: 'x-fa fa-plus-circle'
        //disabled: true
    }, {
        xtype: 'button',
        text: '添加同级',
        ref: 'gridAddBrother',
        iconCls: 'x-fa fa-plus-circle'
        //disabled: true
    }, {
        xtype: 'button',
        text: '修改',
        ref: 'gridEdit',
        iconCls: 'x-fa fa-pencil-square'
        //disabled: true
    }, {
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
        //disabled: true
    }, {
        xtype: 'button',
        text: '刷新',
        ref: 'gridRefresh',
        iconCls: 'x-fa fa-refresh'
    }],
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "品牌名称",
            dataIndex: "text",
            xtype: 'treecolumn',
            flex:1
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }, {
            text: "等级",
            dataIndex: 'level',
            hidden: true
        }, {
            text: "上级ID",
            dataIndex: 'parentNode',
            hidden: true
        }]
    },
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=basedevice.irdevice.mainlayout]");
            var basetreegrid = mainLayout.down("basetreegrid[xtype=basedevice.irdevice.irbrandtreegrid]");
        	
            var funData = mainLayout.funData;
            var brandId=record.get("id");
            var leaf = record.get("leaf");
            var level = record.get("level");
            
            mainLayout.funData = Ext.apply(funData, {
            	brandId: brandId,
                leaf : record.get("leaf"),//true: 房间 false:区域
            });
            
            // 加载品牌信息
            var mianGrid = mainLayout.down("panel[xtype=basedevice.irdevice.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.brandId=brandId;
            proxy.extraParams.leaf=leaf;
            proxy.extraParams.level=level;
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
});