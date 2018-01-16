Ext.define("core.reportcenter.ptectermstatus.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptectermstatus.maingrid",
    dataUrl: comm.get("baseUrl") + "/PtEcTermStatus/list", //数据获取地址
    model:"com.zd.school.control.device.model.PtEcTermStatus", //对应的数据模型
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
/*    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],*/
/*    panelButtomBar:{},
    defGroup:"termName",
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
    text: "当前小时用电量",
    dataIndex: "usekwh",
    field: {
        xtype: "textfield"
    },
    width:150,
}, {
    text: "已购电总量",
    dataIndex: "buyedkwh",
    field: {
        xtype: "textfield"
    },
    width:150,
   // summaryType: 'sum',
  /*  summaryRenderer: function(value){
        return "<font style='font-weight:bold'>"+value+"</font>";
    }*/
}, {
    text: "已使用总电量",
    dataIndex: "totalusedkwh",
    field: {
        xtype: "textfield"
    },
    width:150,
   // summaryType: 'sum',
  /*  summaryRenderer: function(value){
        return "<font style='font-weight:bold'>"+parseFloat(value).toFixed(2)+"</font>";
    }*/
}, {
    text: "剩余总电量",
    dataIndex: "surpluskwh",
    field: {
        xtype: "textfield"
    },
    width:150,
   // summaryType: 'sum',
/*    summaryRenderer: function(value){
        return "<font style='font-weight:bold'>"+value+"</font>";
    }*/
}, {
    text: "电压",
    dataIndex: "voltage",
    field: {
        xtype: "textfield"
    },
    width:100,
}, {
    text: "电流",
    dataIndex: "currents",
    field: {
        xtype: "textfield"
    },
    width:100,
}, {
    text: "功率",
    dataIndex: "power",
    field: {
        xtype: "textfield"
    },
    width:100,
}]
}
});