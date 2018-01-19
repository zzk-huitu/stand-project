Ext.define("core.baseset.room.view.AreaGrid", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.room.areagrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    expandFirst:true,
    menuCode:"JWTROOMINFO",
    sortableColumns:false,
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: "",
        excludes:"checked"
            //filter: "[{'type':'string','comparison':'=','value':'0','field':'isDelete'}]"
    },
    selModel: {
      
    },
    title: "区域信息",

    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function(event, toolEl, header) {
            var tree = header.ownerCt;
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true); 
            var mainlayout = tree.up("basepanel[xtype=baseset.room.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=baseset.room.maingrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.areaId= "";
            proxy.extraParams.areaType= "";         
         }
    }],

    tbar: [/*{
            xtype: 'tbtext',
            html: '区域信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',*/{
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
            text: "区域名称",
            dataIndex: "text",
            xtype: 'treecolumn',
            //width: 250
            flex:1
        }, {
            text: "区域类型",
            dataIndex: "areaType",
            columnType: "basecombobox", //列类型
            ddCode: "BUILDAREATYPE", //字典代码        
            width:80,
        }, {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:60,
        },{
            text: "区域说明",
            dataIndex: "areaDesc",   
            width:100,
            renderer: function(value,metaData) {  
                var title=" 区域说明 ";
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    }
})