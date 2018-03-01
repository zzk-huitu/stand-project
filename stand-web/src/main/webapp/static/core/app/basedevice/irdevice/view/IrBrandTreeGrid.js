Ext.define("core.basedevice.irdevice.view.IrBrandTreeGrid", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.irdevice.irbrandtreegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtIrDeviceBrand/treelist",
    model: "com.zd.school.plartform.comm.model.CommTree",
    selModel: {
      
    },
    menuCode:"IRDEVICE",
    expandFirst:true,
    sortableColumns:false,
    extParams: {
        excludes:"checked"
    },
    title: "品牌信息",

    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function(event, toolEl, header) {
            var tree = header.ownerCt
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true);     
            var mainlayout = tree.up("basepanel[xtype=basedevice.irdevice.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=basedevice.irdevice.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.brandId="";
            proxy.extraParams.level="";     
         } 
    }],


    tbar: [{
        xtype: 'button',
        text: '添加下级',
        ref: 'gridAdd',
        iconCls: 'x-fa fa-plus-circle',
        disabled: true
    }, {
        xtype: 'button',
        text: '添加同级',
        ref: 'gridAddBrother',
        iconCls: 'x-fa fa-plus-circle',
        disabled: true
    }, {
        xtype: 'button',
        text: '编辑',
        ref: 'gridEdit',
        iconCls: 'x-fa fa-pencil-square',
        disabled: true
    }, {
        xtype: 'button',
        text: '删除',
        ref: 'gridDel',
        iconCls: 'x-fa fa-minus-circle',
        disabled: true
    }/*, {
        xtype: 'button',
        text: '刷新',
        ref: 'gridRefresh',
        iconCls: 'x-fa fa-refresh'
    }*/],
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
    /*
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=basedevice.irdevice.mainlayout]");
            var funData = mainLayout.funData;
            var brandId=record.get("id");
            var level = record.get("level");
            var mianGrid = mainLayout.down("panel[xtype=basedevice.irdevice.maingrid]");
            mainLayout.funData = Ext.apply(funData, {
            	brandId: brandId,
            });
            var girdSearchTexts = mianGrid.query("field[funCode=girdFastSearchText]");
            var filter=new Array();
            if(girdSearchTexts[0].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "productModel", "comparison": ""})
            }
            if(filter.length==0)
                filter=null;
            else
                filter = JSON.stringify(filter);
            // 加载品牌信息
    
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams={
                brandId:brandId,
                level:level,
                filter:filter
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }*/
});