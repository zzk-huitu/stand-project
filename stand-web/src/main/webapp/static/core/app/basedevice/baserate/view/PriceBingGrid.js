Ext.define("core.basedevice.baserate.view.PriceBingGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.baserate.pricebinggrid",
    model: 'com.zd.school.control.device.model.PtTerm',
    dataUrl: comm.get('baseUrl') + "/BasePtPriceBind/priceBingTermlist",
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
            dataIndex: "termSn",
            flex:1,
        },{
            text: "设备名称",
            dataIndex: "termName",
            flex:1,
        }, {
            text: "设备类型",
            dataIndex: "termTypeID",
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
        }]
    }
});