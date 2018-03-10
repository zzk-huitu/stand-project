Ext.define("core.reportcenter.watercount.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.watercount.maingrid",
    dataUrl: comm.get("baseUrl") + "/PtSkTermStatus/statistics", //数据获取地址
    model:"com.zd.school.control.device.model.PtSkTermStatus", //对应的数据模型
    menuCode:"WATER_COUNT",
    al: false,
    remoteSort:false,
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
        text: "设备机号",
        dataIndex: "TERMNO",
        field: {
            xtype: "textfield"
        },
        flex:1,
        minWidth:120
    }, {
        text: "设备名称",
        dataIndex: "TERMNAME",
        field: {
            xtype: "textfield"
        },
        width:120
    }, {
        text: "设备类型",
        dataIndex: "TERMTYPEID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE", //字典代码  
        width:120   
    }, {
        text: "网关名称",
        dataIndex: "GATEWAYNAME",
        field: {
            xtype: "textfield"
        },
         width:120 
    }, {
        text: "房间名称",
        dataIndex: "ROOM_NAME",
        field: {
            xtype: "textfield"
        },
         width:120 
    }, {
        text: "楼层名称",
        dataIndex: "NODE_TEXT",
        field: {
            xtype: "textfield"
        },
         width:120 
    }, {
        text: "最初用水量(升)",
        dataIndex: "TOTALUSEDLITERmin",
        field: {
            xtype: "textfield"
        },
        width:150,
    }, {
        text: "最终用水量(升)",
        dataIndex: "TOTALUSEDLITERmax",
        field: {
            xtype: "textfield"
        },
        width:150,
       
    }, {
        text: "累积用水量(升)",
        dataIndex: "useliter",
        field: {
            xtype: "textfield"
        },
        width:150,
    }]
    }
});