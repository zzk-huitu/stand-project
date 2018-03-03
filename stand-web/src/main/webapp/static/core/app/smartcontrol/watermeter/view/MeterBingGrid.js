Ext.define("core.smartcontrol.watermeter.view.MeterBingGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.watermeter.meterbinggrid",
    model: 'com.zd.school.control.device.model.PtTerm',
    dataUrl: comm.get('baseUrl') + "/BasePtSkMeterbind/meterBingTermlist",
    //title:"绑定费率的设备",
    al:false,
    tbar: [{
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
    }],
    panelTopBar:null,
    panelButtomBar:null,
    remoteSort:false,
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    extParams: {
    },
   
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "机号",
            dataIndex: "termNo",
            flex:1,
        }, {
            text: "设备序列号",
            dataIndex: "termSN",
            flex:1,
        },{
            text: "设备名称",
            dataIndex: "termName",
            flex:1,
        },{
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",
            flex:1,
        },{
            text: "设备状态",
            dataIndex: "termStatus",
            flex:1,
            renderer: function(value) {
                switch (value) {
                  case 0:
                    return '<font color=red>禁用</font>';
                    break;
                  case 1:
                    return '<font color=green>启用</font>';                    
                    break;
                }
            }
        }]
    }
});