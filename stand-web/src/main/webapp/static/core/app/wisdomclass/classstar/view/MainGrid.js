Ext.define("core.wisdomclass.classstar.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.wisdomclass.classstar.maingrid",
	dataUrl: comm.get("baseUrl") + "/ClassStar/list", //数据获取地址
    model: "com.zd.school.jw.ecc.model.EccClassstar", //对应的数据模型
	//al:false,
    menuCode:"CLASSSTAR",
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle',
            funCode:'girdFuntionBtn',
            //disabled:true
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle',
            disabled:true
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'className',
            funCode: 'girdFastSearchText',
            emptyText: '请输入班级名称'
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
        }]
    },
      panelButtomBar:{
        xtype:'wisdomclass.classstar.mainquerypanel'
    },
    
    defSort: [{
    	property: 'updateTime',
    	direction: 'DESC'
    }],

	//扩展参数
	extParams: {
		
	},
	columns: [{
		text: "主键",
		dataIndex: "uuid",
		hidden: true
	},{
        text: "班级名称",
        dataIndex: "className",
        flex:1,
        minWidth:200,
        renderer: function(value, metaData) {
            var title = "班级名称";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "星级",
        dataIndex: "starLevel",
        columnType: "basecombobox", //列类型
        ddCode: "STARLEVEL", //字典代码       
        width:100,  
        renderer: function(value, metaData) {
            var title = "星级";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "评定日期",
        dataIndex: "doDate",
        width:150,
        renderer: function(value, metaData) {
            var date = value.replace(new RegExp(/-/gm), "/");
            var title = "评定日期";
            var ss = Ext.Date.format(new Date(date), 'Y-m-d')
            var html = ss;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return ss;
        }
    }, {
        text: "开始日期",
        dataIndex: "beginDate",
        width:150,
        renderer: function(value, metaData) {
            var date = value.replace(new RegExp(/-/gm), "/");
            var title = "选课开始日期";
            var ss = Ext.Date.format(new Date(date), 'Y-m-d')
            var html = ss;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return ss;
        }
    }, {
        text: "结束日期",
        dataIndex: "endDate",
        width:150,
        renderer: function(value, metaData) {
            var date = value.replace(new RegExp(/-/gm), "/");
            var title = "选课结束日期";
            var ss = Ext.Date.format(new Date(date), 'Y-m-d')
            var html = ss;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
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
                        var menuCode="CLASSSTAR";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
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
                        var menuCode="CLASSSTAR";     // 此菜单的前缀
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
    });