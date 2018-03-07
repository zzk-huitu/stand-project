Ext.define("core.wisdomclass.classelegant.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.wisdomclass.classelegant.maingrid",
	dataUrl: comm.get("baseUrl") + "/ClassElegant/list", //数据获取地址
	model: "com.zd.school.jw.ecc.model.EccClasselegant", //对应的数据模型
    //new：此表格与权限相关的菜单编码
    menuCode:"CLASSELEGANT",
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref:'gridAdd_Tab',
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
            name:'title',
            funCode: 'girdFastSearchText',
            emptyText: '请输入标题'
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
    columns: { 
        defaults:{
            titleAlign:"center"
        },
        items:[{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    },{
        text: "班级名称",
        dataIndex: "className",
        width:200,
    },{
        text: "标题",
        dataIndex: "title",
        flex:1,
        minWidth:200,
    }, {
        text: "更新时间",
        dataIndex: "updateTime",
        width:200,
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
                        var menuCode="CLASSELEGANT";     // 此菜单的前缀
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
            },{
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="CLASSELEGANT";     // 此菜单的前缀
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
        }]
    },
    });