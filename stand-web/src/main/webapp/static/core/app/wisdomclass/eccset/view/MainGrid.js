Ext.define("core.wisdomclass.eccset.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.wisdomclass.eccset.maingrid",
    dataUrl: comm.get("baseUrl") + "/ClassCheckrule/list", //数据获取地址
    model: "com.zd.school.jw.ecc.model.JwCheckrule", //对应的数据模型
    menuCode:"ECCSET",

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
            name:'ruleName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入规则名称'
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
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "规则名称",
            dataIndex: "ruleName",
            flex:1,
            minWidth:150,
            renderer: function(value, metaData) {
                var title = "规则名称";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "考勤模式",
            dataIndex: "checkMode",
            width:90,
            renderer: function(value, metaData) {
                // var title = "考勤模式 1-按半天考勤 2-按全天考勤 3-按节次考勤";
                 var html = value;
                // metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                switch(value) {
                    case 1:
                        html = "半天考勤";
                        break;
                    case 2:
                        html = "全天考勤";
                        break;
                    case 3:
                        html = "节次考勤"
                }
                return html;
            }
        }, {
            text: "签到提前分钟",
            width:120,
            dataIndex: "inBefore",
            renderer: function(value, metaData) {
                var title = "签到提前分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "迟到分钟",
            width:90,
            dataIndex: "beLate",
            renderer: function(value, metaData) {
                var title = "迟到分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "缺勤分钟",
            width:90,
            dataIndex: "absenteeism",
            renderer: function(value, metaData) {
                var title = "缺勤分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "是否签退",
            width:90,
            dataIndex: "needCheckout",
            renderer: function(value, metaData) {
                return value == 0 ? "<font color=red>不签退</font>" : "<font color=green>签退</font>";
            }
        }, {
            text: "签退提前分钟",
            width:120,
            dataIndex: "outBefore",
            renderer: function(value, metaData) {
                var title = "签退提前分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "早退分钟",
            width:90,
            dataIndex: "leaveEarly",
            renderer: function(value, metaData) {
                var title = "早退分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "签退延迟分钟",
            width:120,
            dataIndex: "outLate",
            renderer: function(value, metaData) {
                var title = "签退延迟分钟";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            text: "启用标识",
            width:100,
            dataIndex: "startUsing",
            renderer: function(value, metaData) {
                return value == 0 ? "<font color=red>未启用</font>" : "<font color=green>已启用</font>";
            }
        }, {
           xtype: 'actiontextcolumn',
           text: "操作",
           align: 'center',
           width: 150,
           fixed: true,
           items: [{
                text: '启用',
                style: 'font-size:12px;',
                tooltip: '启用此规则',
                ref: 'setUsing',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if (record.get("startUsing") == 1) {
                        return "x-hidden-display";
                    } else if(comm.get("isAdmin")!="1"){
                        var menuCode="ECCSET";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_setUsing")==-1){
                            return 'x-hidden-display';
                        }
                    }
                        return null;
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick', {
                        view: view.grid,
                        cmd: "setusing",
                        record: rec
                    });
                }

            }, {
                text: '停用',
                style: 'font-size:12px;',
                tooltip: '停用此规则',
                ref: 'setNoUsing',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if (record.get("startUsing") == 0) {
                        return "x-hidden-display";
                    } else if(comm.get("isAdmin")!="1"){
                        var menuCode="ECCSET";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_setNoUsing")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null;
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick', {
                        view: view.grid,
                        cmd: "setnousing",
                        record: rec
                    });
                }
            },{
                text: '编辑',
                style: 'font-size:12px;',
                tooltip: '编辑此规则信息',
                getClass: function(view, metadata, record, rowIndex, colIndex, store) {
                    if (record.get("startUsing") == 1) {
                        return "x-hidden-display";
                    } else if(comm.get("isAdmin")!="1"){
                        var menuCode="ECCSET";     // 此菜单的前缀
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
                    if (record.get("startUsing") == 1) {
                        return "x-hidden-display";
                    } else if(comm.get("isAdmin")!="1"){
                        var menuCode="ECCSET";     // 此菜单的前缀
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