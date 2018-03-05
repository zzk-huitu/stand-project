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
        filter: '[{"type":"string","comparison":"!=","value":"0","field":"roomType"}]'  //只显示已定义的房间
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
            minWidth:80,
            flex:1
        }, {
            text: "设备名称",
            dataIndex: "termName",
            field: {
                xtype: "textfield"
            },
            minWidth:80,
            flex:1
        }, {
            text: "状态日期",
            dataIndex: "statusDate",
            field: {
                xtype: "textfield"
            },
            width:100,
            renderer: function(value, metaData) {
                var date = value.replace(new RegExp(/-/gm), "/");
                var title = "状态的日期";
                var ss = Ext.Date.format(new Date(date), 'Y-m-d')
                var html = ss;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return ss;
            }
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
            width:80,
        }, {
            text: "冷水当前小时使用水量（升）",
            dataIndex: "useliter",
            field: {
                xtype: "textfield"
            },
            width:190,
        }, {
            text: "冷水已使用总水量（升）",
            dataIndex: "totalusedliter",
            field: {
                xtype: "textfield"
            },
            width:180,            
        }, {
            text: "冷水当前小时使用脉冲数",
            dataIndex: "usepulse",
            field: {
                xtype: "textfield"
            },
            width:170,
        }, {
            text: "冷水总使用脉冲数",
            dataIndex: "totalusedpulse",
            field: {
                xtype: "textfield"
            },
            width:150,            
        }, {
            text: "热水交易金额",
            dataIndex: "usemoney",
            field: {
                xtype: "textfield"
            },
            width:120,            
        }, {
            text: "热水已交易总额",
            dataIndex: "totalusedmoney",
            field: {
                xtype: "textfield"
            },
            width:120,            
        }, {
            text: "热水已交易流水",
            dataIndex: "totalrecord",
            field: {
                xtype: "textfield"
            },
            width:120
        }, {
            text: "热水已上传流水",
            dataIndex: "uploadrecord",
            field: {
                xtype: "textfield"
            },
            width:120
        }]
    }
});