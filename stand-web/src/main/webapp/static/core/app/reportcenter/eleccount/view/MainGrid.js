Ext.define("core.reportcenter.eleccount.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.eleccount.maingrid",
    dataUrl: comm.get('baseUrl') + "/PtEcTermStatus/listCount",
    model: "com.zd.school.control.device.model.PtEcTermStatus",
    menuCode:"ELEC_COUNT",
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
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],
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
            minWidth:100,
        }, {
            text: "设备名称",
            dataIndex: "TERMNAME",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100,
        }, {
            text: "设备序列号",
            dataIndex: "TERMSN",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100,
        }, {
            text: "设备类型",
            dataIndex: "TERMTYPEID",
            field: {
                xtype: "textfield"
            },
            width:80
        }, {
            text: "网关名称",
            dataIndex: "GATEWAYNAME",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100,
        }, {
            text: "房间名称",
            dataIndex: "ROOM_NAME",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100,
        }, {
            text: "楼层名称",
            dataIndex: "NODE_TEXT",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100,
        }/*, {
            text: "起始电量",
            dataIndex: "startDl",
            field: {
                xtype: "textfield"
            },
            width:120
        }, {
            text: "结束电量",
            dataIndex: "endDl",
            field: {
                xtype: "textfield"
            },
            width:120
        }*/, {
            text: "总电量",
            dataIndex: "sumdl",
            field: {
                xtype: "textfield"
            },
            width:100
        }]
    }
});