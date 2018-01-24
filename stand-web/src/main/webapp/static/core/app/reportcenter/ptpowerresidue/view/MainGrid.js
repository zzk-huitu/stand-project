Ext.define("core.reportcenter.ptpowerresidue.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptpowerresidue.maingrid",
    dataUrl: comm.get('baseUrl') + "/PtPowerResidue/list",
    model: "com.zd.school.control.device.model.PtPowerResidue",
    menuCode:"PtPowerResidue",
    al: false,
    remoteSort: false,   //是否远程排序
    noPagging: true,   //是否要在这里装载分页栏
    //工具栏操作按钮
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
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o'
        },'->'/*,{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype: "textfield",
            name: "roomName",
            funCode: 'girdFastSearchText',
            emptyText: '请输入宿舍名称',
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型  
            iconCls: 'x-fa fa-search',  
        }*/]
    },
/*    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],*/
    panelButtomBar:{},
    //扩展参数
    extParams: {
    },
    columns: {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    }, {
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "宿舍名称",
        dataIndex: "roomName",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
    }, {
        text: "剩余电量",
        dataIndex: "powerResidue",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
    },/* {
        text: "剩余金额",
        dataIndex: "moneyResidue",
        field: {
            xtype: "textfield"
        }
    },*/ {
        text: "宿舍人员1卡余",
        dataIndex: "cardResidue1",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员1卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "宿舍人员2卡余",
        dataIndex: "cardResidue2",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员2卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "宿舍人员3卡余",
        dataIndex: "cardResidue3",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员3卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "宿舍人员4卡余",
        dataIndex: "cardResidue4",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员4卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "宿舍人员5卡余",
        dataIndex: "cardResidue5",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员5卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }, {
        text: "宿舍人员6卡余",
        dataIndex: "cardResidue6",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:100,
        renderer: function(value, metaData) {
            var title = "宿舍人员6卡余";
            var html = value;
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
            return value;
        }
    }]
    }
});