Ext.define("core.basedevice.baserate.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.baserate.maingrid",
    dataUrl: comm.get('baseUrl') + "/BasePriceDefine/list",
    model: 'com.zd.school.build.define.model.SkPriceDefine',
    al:false,
    menuCode:"BASERATE",
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
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
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },{
            xtype: 'button',
            text: '费率绑定',
            ref: 'gridBinding',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-link',
            disabled:true,
        },{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'priceName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [/*{
        property: 'createTime',
        direction: 'DESC'
    }, */{
        property: 'updateTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            text: "名称",
            dataIndex: "priceName",
            width: 120,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "费率",
            dataIndex: "priceValue",
            width: 100,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "状态",
            dataIndex: "priceStatus",
            width: 80,
             renderer: function(value) {
                switch (value) {
                    case '0':
                        return '<font color=red>禁用</font>';
                        break;
                    case '1':
                        return '<font color=green>启用</font>';                    
                        break;
                }
            }
        }, {
            text: "币种",
            width: 120,
            dataIndex: "currencyType",
            field: {
                xtype: "textfield"
            }
        }, {
            text: "备注",
            flex:1,
            minWidth:120,
            dataIndex: "priceNotes",
            field: {
                xtype: "textfield"
            },
            renderer:function(value,metaData){
                var title="备注";
                metaData.tdAttr= 'data-qtitle="' + title + '" data-qtip="' + value + '"';
                return value;  

            }
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
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASERATE";     // 此菜单的前缀
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
            },  {
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASERATE";     // 此菜单的前缀
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
            },{
                text:'费率设备',  
                style:'font-size:12px;', 
                tooltip: '费率设备',
                ref: 'priceBingTerm',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="BASERATE";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_priceBingTerm")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('priceBingClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }    
});