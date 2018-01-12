Ext.define("core.reportcenter.ptsktermstatus.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptsktermstatus.maingrid",
    dataUrl: comm.get("baseUrl") + "/PtSkTermStatus/list", //数据获取地址
    model:"com.zd.school.control.device.model.PtSkTermStatus", //对应的数据模型
    menuCode:"PtSkTermStatus",
    al: false,
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
            iconCls: 'x-fa fa-file'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype: "basequeryfield",
            queryType: "datetimefield",
            dateType:'date',        //指定这个组件的格式，date或者datetime
           //fieldLabel: "状态的开始日期",
           name: "statusDate",
           funCode: 'girdFastSearchText',
           emptyText: '状态的开始日期',
            //format: "Y-m-d",
        },{
            xtype: "basequeryfield",
            queryType: "datetimefield",
            dateType:'date',        //指定这个组件的格式，date或者datetime
           // fieldLabel: "状态的终止日期",
           name: "statusDate",
           funCode: 'girdFastSearchText',
           emptyText: '状态的终止日期',
           // format: "Y-m-d",
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
/*    defGroup:"termName",
    features: [{
        ftype: 'groupingsummary',
        groupHeaderTpl: '{columnName}: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        id: 'restaurantGrouping',
        collapsible :false,
        enableGroupingMenu:false,
        enableNoGroups:false,
    }],*/
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
            align: 'center',
      /*      summaryRenderer: function(value){
               return "<font style='font-weight:bold'>小计:</font>";
           }*/
       }, {
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "房间名称",
        dataIndex: "roomName",
        field: {
            xtype: "textfield"
        },
        width:100,
    }, {
        text: "设备名称",
        dataIndex: "termName",
        field: {
            xtype: "textfield"
        },
        minWidth:100,
        fles:1
//        summaryRenderer : function (value,cellmeta,record,rowIndex,columnIndex,store) {  
//            return store.getAt(store.getCount()-1).get('termName');
//        },
    }, {
        text: "状态的日期",
        dataIndex: "statusDate",
        field: {
            xtype: "textfield"
        },
        width:150,
    }, {
        text: "测量单位",
        dataIndex: "measure",
        field: {
            xtype: "textfield"
        },
        width:80,
    }, {
        text: "费率",
        dataIndex: "price",
        field: {
            xtype: "textfield"
        },
        width:100,
    }, {
        text: "冷水当前小时使用水量（升）",
        dataIndex: "useliter",
        field: {
            xtype: "textfield"
        },
        width:150,
    }, {
        text: "冷水已使用总水量（升）",
        dataIndex: "totalusedliter",
        field: {
            xtype: "textfield"
        },
        width:150,
        /* summaryType: 'sum',
        summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }, {
        text: "冷水当前小时使用脉冲数",
        dataIndex: "usepulse",
        field: {
            xtype: "textfield"
        },
        width:150,
    }, {
        text: "冷水总使用脉冲数",
        dataIndex: "totalusedpulse",
        field: {
            xtype: "textfield"
        },
        width:150,
         /* summaryType: 'sum',
        summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }, {
        text: "热水交易金额",
        dataIndex: "usemoney",
        field: {
            xtype: "textfield"
        },
        width:150,
         /*summaryType: 'sum',
        summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }, {
        text: "热水已交易总额",
        dataIndex: "totalusedmoney",
        field: {
            xtype: "textfield"
        },
        width:150,
       /* summaryType: 'sum',
        summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }, {
        text: "热水已交易流水",
        dataIndex: "totalrecord",
        field: {
            xtype: "textfield"
        },
        width:150,
        /*  summaryType: 'sum',
       summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }, {
        text: "热水已上传流水",
        dataIndex: "uploadrecord",
        field: {
            xtype: "textfield"
        },
        width:150,
         /* summaryType: 'sum',
        summaryRenderer: function(value){
            return "<font style='font-weight:bold'>"+value+"</font>";
        }*/
    }]
    }
});