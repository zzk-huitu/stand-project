Ext.define("core.wisdomclass.redflag.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.wisdomclass.redflag.maingrid",
    dataUrl: comm.get("baseUrl") + "/ClassRedflag/list", //数据获取地址
    model: "com.zd.school.jw.ecc.model.EccClassredflag", //对应的数据模型
	//al:false,
    menuCode:"REDFLAG",
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle',
            funCode:'girdFuntionBtn',
          //  disabled:true
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-pencil-square',
            disabled:true
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
        xtype:'wisdomclass.redflag.mainquerypanel'
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
	}, {
        text: "红旗类型",
        dataIndex: "redflagType",
        columnType: "basecombobox", //列类型
        ddCode: "REDFLAG", //字典代码 ,
        flex:1,
        minWidth:200,  
    }, {
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
        text: "开始日期",
        dataIndex: "beginDate",
        width:150,
        renderer: function(value, metaData) {
            var date = value.replace(new RegExp(/-/gm), "/");
            var title = "开始日期";
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
            var title = "结束日期";
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
                    var menuCode="REDFLAG";     // 此菜单的前缀
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
                    var menuCode="REDFLAG";     // 此菜单的前缀
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