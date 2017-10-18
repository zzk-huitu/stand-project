Ext.define("core.basedevice.irdevice.view.IrBrandTreeGrid", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.irdevice.irbrandtreegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtIrDeviceBrand/treelist",
    model: "com.zd.school.plartform.comm.model.CommTree",
    al: true,
    selModel: {
      
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: "",
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
            var storeyGrid = mainLayout.down("panel[xtype=basedevice.irdevice.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            if (record.get('level') != 3) {
                proxy.extraParams = {
                    filter: "[{'type':'string','comparison':'=','value':'','field':'parentNode'}]"
                }
                store.load(); // 给form赋值
            } else {
                proxy.extraParams = {
                    filter: "[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'parentNode'}]"
                };
                store.load(); // 给form赋值
            }
            return false;
        }
    }
});