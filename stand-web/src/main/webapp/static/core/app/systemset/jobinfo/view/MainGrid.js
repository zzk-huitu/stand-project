Ext.define("core.systemset.jobinfo.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.systemset.jobinfo.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseJob/list",
    model: 'com.zd.school.plartform.baseset.model.BaseJob',

    menuCode:"JOBINFO", //new：此表格与权限相关的菜单编码

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
        }, /*{
            xtype: 'button',
            text: '同步数据',
            ref: 'sync',
            funCode:'girdFuntionBtn',         
            iconCls: 'x-fa fa-rss'
        },*/{
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
            name:'jobName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入职务名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
    items: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "名称",
        dataIndex: "jobName",
        flex: 1,
        minWidth: 150,
    }, {
        text: "级别",
        dataIndex: "orderIndex",
        width:350
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
                    var menuCode="JOBINFO";     // 此菜单的前缀
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
    }    
});