var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'dhcp'],
    data: [
        [0, '启用'],
        [1, '禁用']
    ]
});
Ext.define("core.basedevice.basegateway.view.NetWorkForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.basegateway.networkform",
    items: [{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            fieldLabel: '本机IP',
            xtype: 'textfield',
            name: 'tlvs[0].valStr',
            allowBlank: false,
            regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            regexText: 'IP格式为：xxx.xxx.xxx.xxx'
        }, {
            columnWidth:0.5,
            fieldLabel: '网关',
            xtype: 'textfield',
            name: 'tlvs[1].valStr',
            allowBlank: false,
            regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            regexText: 'IP格式为：xxx.xxx.xxx.xxx'
        }]
    }, {   
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            fieldLabel: '服务器IP',
            xtype: 'textfield',
            name: 'tlvs[3].valStr',
            allowBlank: false,
            regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            regexText: '服务器IP格式为：xxx.xxx.xxx.xxx'
        }, {
            columnWidth:0.5,
            fieldLabel: 'SSID',
            xtype: 'textfield',
            disabled: true
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            fieldLabel: 'MAC',
            xtype: 'textfield',
            name: 'tlvs[6].valStr',
            regex: /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/,
            regexText: '服务器IP格式为：FF-FF-FF-FF-FF-FF'
        },{
            columnWidth:0.5,
            xtype: "combobox",
            store: combostore,
            fieldLabel: "DHCP",
            displayField: 'dhcp',
            valueField: 'id',
            name: "tlvs[5].valInt",
            value: 1,
            triggerAction: 'all',
            emptyText: '请选择...',
            blankText: '请选择',
            editable: false,
            mode: 'local'
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            fieldLabel: '掩码',
            xtype: 'textfield',
            name: 'tlvs[2].valStr',
            allowBlank: false,
            regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            regexText: '掩码格式为：xxx.xxx.xxx.xxx'
        }, { 
            columnWidth:0.5,
            fieldLabel: '服务器Port',
            xtype: 'numberfield',
            name: 'tlvs[4].valInt',
            value: 1,
            minValue: 1,
            maxValue: 65335,
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            fieldLabel: 'SSID密码',
            xtype: 'textfield',
            disabled: true
        }]
    }],


   
    formData: {
        "tlvs[0].len": 4, //设备IP地址  HostIP  0x3002  4
        "tlvs[0].type": 6,
        "tlvs[0].tag": 0x3002,
        "tlvs[1].len": 4, //设备网关地址  HostGW  0x3004  4
        "tlvs[1].type": 6,
        "tlvs[1].tag": 0x3004,
        "tlvs[2].len": 4, //设备子网掩码  HostMask        4
        "tlvs[2].type": 6,
        "tlvs[2].tag": 0x3005,
        "tlvs[3].len": 4, //服务器IP地址 ServerIP        4
        "tlvs[3].type": 6,
        "tlvs[3].tag": 0x3000,
        "tlvs[4].len": 2, //服务器端口   serverPort      2
        "tlvs[4].type": 1,
        "tlvs[4].tag": 0x3001,
        "tlvs[5].len": 1, //DHCP使能位 DhcpEnable      1
        "tlvs[5].type": 1,
        "tlvs[5].tag": 0x3008,
        "tlvs[6].len": 6, //设备MAC值  HostMac 0x3003  6
        "tlvs[6].type": 7,
        "tlvs[6].tag": 0x3003
    }
});