Ext.define("core.basedevice.basefrontserver.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.basefrontserver.maingrid",

    dataUrl: comm.get('baseUrl') + "/BaseFrontServer/list",
    model: "com.zd.school.build.define.model.SysFrontServer",

    menuCode:"BASEFRONTSERVER", //new：此表格与权限相关的菜单编码

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
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '详细',
            ref: 'gridDetail_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'frontServerName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入服务器名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        },' ',{
            xtype: 'button',
            text: '高级搜索',
            ref: 'gridHignSearch',
            iconCls: 'x-fa fa-sliders'
        }],
    }, 
    panelButtomBar:{
        xtype:'basedevice.basefrontserver.mainquerypanel'
    },
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
   
    columns: {
        defaults:{
            titleAlign:"center"
        },
        items: [{
                xtype: "rownumberer",
                width: 50,
                text: '序号',
                align: 'center'
            }, {
                text: "主键",
                dataIndex: "uuid",
                hidden: true
            }, {
                width: 100,
                text: "服务器名称",
                dataIndex: "frontServerName",
                field: {
                    xtype: "textfield"
                }
            }, {
                width: 100,
                text: "服务IP",
                dataIndex: "frontServerIp",
                field: {
                    xtype: "textfield"
                }
            }, {
                text: "服务端口",
                dataIndex: "frontServerPort",
                field: {
                    xtype: "textfield"
                },
                width: 100,
            }, {
                text: "请求任务URL",
                dataIndex: "frontServerUrl",
                field: {
                    xtype: "textfield"
                },
                width: 100,
            }, {
                width: 100,
                text: "状态",
                dataIndex: "frontServerStatus",
                 renderer: function(value) {
                    switch (value) {
                        case 0:
                            return '<font color=red>禁用</font>';
                            break;
                        case 1:
                            return '<font color=green>启用</font>';                        
                            break;
                    }
                }
            }, {
                text: "备注",
                dataIndex: "notes",
                field: {
                    xtype: "textfield"
                },
                flex: 1,
                minWidth:150
            },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 200,
            fixed: true,
            items: [{
                text:'编辑',  
                style:'font-size:12px;', 
                tooltip: '编辑',
                ref: 'gridEdit',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('editClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
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
            }, {
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASEFRONTSERVER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('deleteClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }],
    }
});