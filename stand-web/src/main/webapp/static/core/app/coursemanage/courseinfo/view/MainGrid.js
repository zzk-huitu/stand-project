Ext.define("core.coursemanage.courseinfo.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.courseinfo.maingrid",
    dataUrl: comm.get("baseUrl") + "/BaseCourse/list", //数据获取地址
    model: "com.zd.school.jw.eduresources.model.JwTBasecourse", //对应的数据模型
    menuCode:"COURSEINFO",

    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
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
        },{
            xtype:'textfield',
            name:'courseName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入课程名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
  
   },
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],
    panelButtomBar:null,
    extParams: {
        
    },
    columns:{
         defaults:{
            titleAlign:"center",
            align:'center',
        },
        items: [{
            xtype : "rownumberer",
            width : 50,
            text : '序号',
            align : 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },  {
            text : "课程名称",
            dataIndex : "courseName",
            flex:1
        }, {
            text : "课程等级",
            dataIndex : "courseLevel",
            columnType: "basecombobox", //列类型
            ddCode: "KCJB", //字典代码        
            flex:1
        },{
            text : "总学时",
            dataIndex : "totalHour",        
            flex:1
        },{
            text : "周学时",
            dataIndex : "weekHour",     
            flex:1
        },{
            text : "授课方式",
            dataIndex : "teachWay",
            columnType: "basecombobox", //列类型
            ddCode: "SKFS",          //字典代码
            flex:1
        },{
            text : "课程编码",
            dataIndex : "courseCode",
            flex:1
        }, {
           xtype: 'actiontextcolumn',
           text: "操作",
           align: 'center',
           width: 100,
           fixed: true,
           items: [{
                text: '编辑',
                style: 'font-size:12px;',
                tooltip: '编辑此信息',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="COURSEINFO";     // 此菜单的前缀
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
                text: '删除',
                style: 'font-size:12px;',
                tooltip: '删除',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="COURSEINFO";     // 此菜单的前缀
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