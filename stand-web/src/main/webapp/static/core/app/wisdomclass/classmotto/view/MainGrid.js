Ext.define("core.wisdomclass.classmotto.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.wisdomclass.classmotto.maingrid",
	dataUrl: comm.get("baseUrl") + "/GradeClass/classmottolist", //数据获取地址
	model: "com.zd.school.jw.eduresources.model.JwTGradeclass", //对应的数据模型
	al:false,
    menuCode:"CLASSMOTTO",
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            iconCls: 'x-fa fa-pencil-square',
            funCode:'girdFuntionBtn',
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
        }]
    },
    defSort: [{
    	property: 'updateTime',
    	direction: 'DESC'
    }],
    panelButtomBar:{},
	//扩展参数
	extParams: {
		
	},
	columns: [{
		text: "主键",
		dataIndex: "uuid",
		hidden: true
	}, {
		text: "班级名称",
		dataIndex: "className",
        width:200,
		renderer: function(value, metaData) {
			var title = "班级名称";
			var html = value;
			metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
			return value;
		}
	}, {
		text: "班训",
		dataIndex: "classMotto",
        flex:1,
        minWidth:200,
		renderer: function(value, metaData) {
			var title = "classMotto";
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
            text:'编辑',  
            style:'font-size:12px;', 
            tooltip: '编辑',
            ref: 'gridEdit',
            getClass :function(v,metadata,record,rowIndex,colIndex,store){   
                if(comm.get("isAdmin")!="1"){
                        var menuCode="CLASSMOTTO";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridEdit")==-1){
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
            },{
                text:'详情',  
                style:'font-size:12px;', 
                tooltip: '详情',
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
    });