Ext.define("core.baseset.terminal.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.terminal.maingrid",
    dataUrl: comm.get("baseUrl") + "/BaseInfoterm/list", //数据获取地址
    model: "com.zd.school.oa.terminal.model.OaInfoterm", //对应的数据模型
    tbar:[],
    menuCode:"INFOTERM",
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'roomName',
            emptyText: '请输入房间名称',
            funCode: 'girdFastSearchText',
        },{
            xtype: 'button',
            funCode: 'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search', 
        }],
    },
    panelBottomBar:false,
    
    //排序字段
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: "termCode", //排序字段
        direction: "ASC" //升降充
    }],
    //扩展参数
    extParams: {
        whereSql: "",
        //filter: "[{'type':'numeric','comparison':'=','value':'0','field':'isUse'}]"
    },
    
    columns:  {        
        defaults:{
            //flex:1,
            //align:'center',
            titleAlign:"center"
        }, 
    items: [ {
        text: "终端号",
        dataIndex: "termCode",
        flex: 1,
        minWidth: 150,
        renderer: function(value, metaData) {
            var title = "终端号";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "类型",
        dataIndex: "termType",
        //flex:1,
        width: 180,
        columnType: "basecombobox", //列类型
        ddCode: "INFOTERTYPE" //字典代码
    }, {
        text: "规格",
        dataIndex: "termSpec",
        //flex:1,
        width: 180,
        renderer: function(value, metaData) {
            var title = "规格";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "使用状态",
        dataIndex: "isUse",
        //flex:1,
        width: 180,
        renderer: function(value, metaData) {
            var title = "使用状态";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return (value == 0) ? "<font color=red>未使用</font>" : "<font color=green>已使用</font>";
        }
    }, {
        text: "房间名称",
        dataIndex: "roomName",
        //flex:1,
        width: 180,
        renderer: function(value, metaData) {
            var title = "房间名称";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    },{
        xtype: 'actiontextcolumn',
        text: "操作",
        align: 'center',
        width: 150,
        fixed: true,
        items: [{
            text:'详细',  
            style:'font-size:12px;', 
            tooltip: '详细',
            ref: 'gridDetail',
            handler: function(view, rowIndex, colIndex, item) {
                var rec = view.getStore().getAt(rowIndex);
                this.fireEvent('detailClick_Tab', {
                    view: view.grid,
                    record: rec
                });
            }
        }]
    }],
    }
});