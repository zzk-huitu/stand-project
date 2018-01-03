Ext.define("core.wisdomclass.notice.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.wisdomclass.notice.maingrid",
    dataUrl: comm.get('baseUrl') + "/OaNotice/list",
    model: 'com.zd.school.oa.notice.model.OaNotice',

    menuCode:"OANOTICE", //new：此表格与权限相关的菜单编码

    al:true,

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
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },/*{
            xtype: 'button',
            text: '新生注冊',
            ref: 'gridReg', 
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-registered'
        },*/'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'noticeTitle',
            funCode: 'girdFastSearchText',
            emptyText: '请输入公告标题'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        },' ', {
            xtype: 'button',
            text: '高级搜索',
            ref: 'gridHignSearch',
            iconCls: 'x-fa fa-sliders'
        }],
    }, 
    panelButtomBar: {
        xtype: 'wisdomclass.notice.mainquerypanel',
    },
    
    //排序字段及模式定义
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: 'createTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "公告标题",
            dataIndex: "noticeTitle",
            flex: 1,
            minWidth: 150,
            renderer: function(value, metaData) {
                var title = "公告标题";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "公告类型",
            dataIndex: "noticeType",
            width:100,
            columnType: "basecombobox", //列类型
            ddCode: "NOTICETYPE", //字典代码          
        }, {
            text: "紧急程度",
            dataIndex: "emergency",
            width:100,
            columnType: "basecombobox", //列类型
            ddCode: "EMERGENCY", //字典代码
        }, {
            text: "生效日期",
            dataIndex: "beginDate",
            width: 100,
            renderer: function(value, metaData) {
                var date = value.replace(new RegExp(/-/gm), "/");
                var ss = Ext.Date.format(new Date(date), 'Y-m-d')            
                return ss;
            }
        }, {
            text: "中止日期",
            dataIndex: "endDate",
            width: 100,
            renderer: function(value, metaData) {
                var date = value.replace(new RegExp(/-/gm), "/");
                var ss = Ext.Date.format(new Date(date), 'Y-m-d')              
                return ss;
            }
        },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 150,
            fixed: true,
            items: [{
                text:'编辑',  
                style:'font-size:12px;', 
                tooltip: '编辑',
                ref: 'gridEdit',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var userBtn=comm.get("userBtn");   
                        if(userBtn.indexOf(this.menuCode+"_gridEdit_Tab")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
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
                        var userBtn=comm.get("userBtn");   
                        if(userBtn.indexOf(this.menuCode+"_gridDelete")==-1){
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
        }]
    }    
});