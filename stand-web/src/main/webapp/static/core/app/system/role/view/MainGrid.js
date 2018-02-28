Ext.define("core.system.role.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.role.maingrid",
    dataUrl: comm.get('baseUrl') + "/SysRole/list",
    model: 'com.zd.school.plartform.system.model.SysRole',
    frame: false,
    //tbar:[],
    menuCode:"SYSROLE",
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
            text: '角色用户',
            ref: 'gridJobUser_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分   
            disabled:true,
            iconCls: 'x-fa fa-user'
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
            name:'roleName',
            funCode:'girdFastSearchText', 
            emptyText: '请输入角色名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    },
    panelBottomBar:false,

    //排序字段及模式定义
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],
    extParams: {
        whereSql: ""
    },
  
    columns:  {        
        defaults:{
            //flex:1,       //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center',
            resizable :false
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true    
        }, {
            text: "角色名称",
            dataIndex: "roleName",
            flex:2,
        }, {
            text: "角色编码",
            dataIndex: "roleCode",
            flex:1.5,
        }, {
            text: "是否系统角色",
            dataIndex: "issystem",
            renderer: function(value) {
                return value=="1"?"<font color=green>是</font>":"<font color=red>否</font>"
            }
        }, {
            text: "角色说明",
            dataIndex: "remark",
            flex:2,
            renderer: function(value,metaData) {  
                var title=" 角色说明 ";

                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  
        },{
            xtype:'actiontextcolumn',
            ref: "roledetail",
            text: "操作",
            width:250,
            resizable :false,
            align:'center',
            items: [{
                text:'编辑',  
                style:'font-size:12px;',                    
                tooltip: '编辑',      
                ref: 'gridEdit',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){
                    if(record.get("issystem")==1){
                        return 'x-hidden-display';
                    }else if(comm.get("isAdmin")!="1"){
                         var menuCode="SYSROLE";     // 此菜单的前缀
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
                        view:view.grid,
                        record: rec
                    });                    
                },
                               
            },{
                text:'详情',
                style:'font-size:12px;',
                tooltip: '详情',
                ref: 'gridDetail',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view:view.grid,
                        record: rec
                    });
                }
            },{               
                text:'角色用户',
                style:'font-size:12px;',
                tooltip: '角色用户',
                ref: 'gridjobUser',
                //hidden:true,   
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SYSROLE";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridJobUser_Tab")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },        
                handler: function(view, rowIndex, colIndex, item) {             
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('jobUserClick_Tab', {
                        view:view.grid,
                        record: rec
                    });
                }
            },{              
                text:'删除',
                style:'font-size:12px;',
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){
                    if(record.get("issystem")==1){
                        return 'x-hidden-display';
                    }else if(comm.get("isAdmin")!="1"){
                         var menuCode="SYSROLE";     // 此菜单的前缀
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
                        view:view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }
});