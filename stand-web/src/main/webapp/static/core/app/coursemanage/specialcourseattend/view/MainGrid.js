Ext.define("core.coursemanage.specialcourseattend.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.specialcourseattend.maingrid",
    dataUrl: comm.get("baseUrl") + "/AttendTitle/list", //数据获取地址
    model: "com.zd.school.oa.attendance.model.AttTitle", //对应的数据模型
    menuCode:"SPECIAL_COURSEATTEND",

    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit',
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
            name:'titleName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入主题名称'
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
            titleAlign:"center"
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
        }, {
            text: "主题名称",
            dataIndex: "titleName",
            flex:1,
        },   {
            text: "发布时间",
            dataIndex: "createTime",
            width:200,
        }, {
            text: "更新时间",
            dataIndex: "updateTime",
            width:200,
        }, {
           xtype: 'actiontextcolumn',
           text: "操作",
           align: 'center',
           width: 250,
           fixed: true,
           items: [{
                text: '考勤人员',
                style: 'font-size:12px;',
                tooltip: '考勤人员',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SPECIAL_COURSEATTEND";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_setUsers")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null;
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick', {
                        view: view.grid,
                        cmd: "setUsers",
                        record: rec
                    });
                }
            }, {
                text: '考勤设备',
                style: 'font-size:12px;',
                tooltip: '考勤设备',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SPECIAL_COURSEATTEND";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_setTerms")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null;
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick', {
                        view: view.grid,
                        cmd: "setTerms",
                        record: rec
                    });
                }

            }, {
                text: '考勤时间',
                style: 'font-size:12px;',
                tooltip: '考勤时间',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SPECIAL_COURSEATTEND";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_setTimes")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null;
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick', {
                        view: view.grid,
                        cmd: "setTimes",
                        record: rec
                    });
                }

            }]
        }]

    }
});