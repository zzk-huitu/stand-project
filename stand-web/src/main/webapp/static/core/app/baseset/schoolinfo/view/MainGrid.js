
Ext.define("core.baseset.schoolinfo.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.schoolinfo.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseSchool/list",
    model: 'com.zd.school.plartform.baseset.model.BaseSchool',
    

    menuCode:"SCHOOLINFO", //new：此表格与权限相关的菜单编码
    sortableColumns: false,
   /* panelTopBar:{
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
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        }, {
            xtype:'textfield',
            name:'schoolName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入学校名称'
        },  {
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
   */
    panelTopBar:{
     xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '学校信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
        }]
    },
    panelButtomBar:{
        xtype:'baseset.schoolinfo.mainquerypanel'
    },
  
    
    //排序字段及模式定义
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },/*{
        property: 'createTime',
        direction: 'DESC'
    }*/],
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
        }, {
            flex: 1,
            minWidth: 120,
            text: "学校名称",
            dataIndex: "schoolName"
           
        },{
            text: "学校代码",
            dataIndex: "schoolCode",        
            width: 100
        }, {
            width: 120,
            text: "学校英文名",
            dataIndex: "schoolEng"
         
        }, {
            width: 120,
            text: "学校邮政编码",
            dataIndex: "zipCode"
           
        }, { 
            width: 120,
            text: "建校年月",
            dataIndex: "foundYear"
           
        }, {
            width: 100,
            text: "办学类型",
            dataIndex: "officeType",
            columnType: "basecombobox", //列类型
            ddCode: "BXLX" //字典代码
         
        },{
            width: 120,
            text: "校长姓名",
            dataIndex: "schoolmasterName"
        }, {
            width: 120,
            text: "联系电话",
            dataIndex: "telephone"
          
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
                        var menuCode="SCHOOLINFO";     // 此菜单的前缀
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
            }]
        }]
    }    
});