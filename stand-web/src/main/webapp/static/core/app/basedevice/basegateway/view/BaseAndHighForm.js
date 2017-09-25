Ext.define("core.basedevice.basegateway.view.BaseAndHighForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.basegateway.baseandhighform",

    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 100,
        labelAlign : 'right',
        margin:"10 5 0 5",
    },   
  
    items :[{
       xtype: "fieldset",
       title: '基础参数',
       style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:400
            },
       items: [{
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.5,
                name: 'tlvs[1].valInt',
                fieldLabel: '心跳间隔：',
                xtype: 'numberfield',
                value: 60,
                maxValue: 300,
                minValue: 1,
                allowDecimals: false
            }, {
                columnWidth: 0.5,
                xtype: "label",
                html: "&nbsp&nbsp&nbsp秒 <font color=red,size=10>(取值范围1-300)</font>",
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.5,
                fieldLabel: '通讯超时：',
                name: 'tlvs[0].valInt',
                xtype: 'numberfield',
                value: 5000,
                maxValue: 60000,
                minValue: 5000,
                allowDecimals: false
            }, {
                columnWidth: 0.5,
                xtype: "label",
                html: "&nbsp&nbsp&nbsp毫秒 <font color=red,size=12>(取值范围5000-60000)</font>",
            }]
        }],
   },  {
       xtype: "fieldset",
       title: '高级参数',
       style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:400
            },
       items :[{
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.5,
                xtype: 'timefield',
                name: 'time1',
                format: 'H:i',
                fieldLabel: '重启时间1',
                minValue: '00:00',
                maxValue: '23:59',
                increment: 10,
                value:'00:00',
                 allowBlank: false,
                anchor: '100%',
                invalidText: "时间格式不正确，例如：00:00"
            },{ 
                columnWidth: 0.5,
                xtype: 'timefield',
                name: 'time2',
                format: 'H:i',
                fieldLabel: '重启时间2',
                minValue: '00:00',
                maxValue: '23:59',
                increment: 10,
                value:'00:00',
                anchor: '100%',
                allowBlank: false,
                invalidText: "时间格式不正确，例如：00:00"
            }]
        },{
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.5,
                xtype: 'timefield',
                name: 'time3',
                format: 'H:i',
                fieldLabel: '重启时间3',
                minValue: '00:00',
                maxValue: '23:59',
                increment: 10,
                value:'00:00',
                anchor: '100%',
                allowBlank: false,
                invalidText: "时间格式不正确，例如：00:00"
            },{
                columnWidth: 0.5,
                xtype: 'timefield',
                name: 'time4',
                format: 'H:i',
                fieldLabel: '重启时间4',
                minValue: '00:00',
                maxValue: '23:59',
                increment: 10,
                value:'00:00',
                anchor: '100%',
                allowBlank: false,
                invalidText: "时间格式不正确，例如：00:00"
            }]
       }]
    }],
       
    baseFormData: {
        "tlvs[0].len": 4,//TCP接收超时时间
        "tlvs[0].type": 1,
        "tlvs[0].tag": 0x1010,
        
        "tlvs[1].len": 4,//设备心跳间隔
        "tlvs[1].type":1,
        "tlvs[1].tag": 0x1006
    },
    highFormData: {
        "tlvs[0].len": 8,//设备重启时间列表
        "tlvs[0].type": 2,
        "tlvs[0].tag": 0x2000
    }
});