Ext.define("core.system.appupdate.view.MainGrid", {
    extend: 'core.base.view.BaseGrid',
    alias: "widget.system.appupdate.maingrid",
    dataUrl: comm.get('baseUrl') + "/SysAppinfo/list",
    model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysAppinfo", "checked").modelName,

    emptyText:'<div style="width:100%;line-height: 100px;text-align:center">暂无APP！</div>',
    selModel: Ext.create('Ext.selection.CheckboxModel', {
        injectCheckbox:1,//checkbox位于哪一列，默认值为0
        mode:'single',//multi,simple,single；默认为多选multi
        checkOnly:false,//如果值为true，则只用点击checkbox列才能选中此条记录
        allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    }),

    menuCode:"APPUPDATE", //new：此表格与权限相关的菜单编码
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '上传APP',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-upload'
        },{
            xtype: 'button',
            text: '启用',
            ref: 'gridUse',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-star'
        }, {
            xtype: 'button',
            text: '取消启用',
            ref: 'gridCancel',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-star-o'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'appTitle',
            funCode: 'girdFastSearchText',
            emptyText: '请输入APP名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:{},
    extParams: {},
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: 'appType',
        direction: 'ASC'
    }],
    columns:  {
        defaults: {
            titleAlign:"center",
            align:'center'
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "APP名称",
            dataIndex: "appTitle",
            width:150
        }, {
            text: "APP类型",
            dataIndex: "appType",
            ddCode: "APPTYPE",
            columnType: "basecombobox",
            width:120
        },{
            text: "APP版本号",
            dataIndex: "appVersion",
            width:120
        },{
            text: "APP描述",
            dataIndex: "appIntro",
            flex:1,
            minWidth:200,
            renderer: function(value,metaData) {  

                metaData.tdAttr = '" data-qtip="' + value + '"';  
                return value;  
            }
        },{
            text: "上传时间",
            dataIndex: "createTime",
            width:180,
            renderer: function(value,metaData) {          
                if(value!=null){      
                    return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                }
                        
            }
        },{
            text: "是否启用",
            dataIndex: "appIsuse",
            width:120,
            renderer: function(value,metaData) {          
                if(value==1){
                    return "<span style='color:green'>已启用</span>";
                }else{
                    return "<span style='color:red'>未启用</span>";
                }
            
            }
        }, {
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 150,
            fixed: true,
            items: [{
                text:'启用',  
                style:'font-size:12px;', 
                tooltip: '启用',
                ref: 'gridUse',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){
                    if(record.get("appIsuse")==1)
                        return 'x-hidden-display';     
                                               
                    if(comm.get("isAdmin")!="1"){
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(this.menuCode+"_gridUse")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                }, 
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('userClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
                text:'取消启用',  
                style:'font-size:12px;', 
                tooltip: '取消启用',
                ref: 'gridCancel',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){
                    if(record.get("appIsuse")!=1)
                        return 'x-hidden-display';

                    if(comm.get("isAdmin")!="1"){
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(this.menuCode+"_gridCancel")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('cancelClick', {
                        view: view.grid,
                        record: rec
           
                 });
                }
            }]
        }]
    }
    
});