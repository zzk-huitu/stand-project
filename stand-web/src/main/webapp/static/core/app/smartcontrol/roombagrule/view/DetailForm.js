var combostore = Ext.create('Ext.data.Store', {
    fields: ['id', 'isEnable'],
    data: [
        [1, '启用'],
        [0, '禁用']
    ]
});

Ext.define("core.smartcontrol.roombagrule.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.smartcontrol.roombagrule.detailform",

    fieldDefaults: { // 统一设置表单字段默认属性
        xtype : 'textfield',
        labelSeparator: '：', // 分隔符
        labelWidth:130,
        labelAlign : 'right',
        msgTarget: 'qtip',
    },

    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    },  {
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "规则名称",
        name: "roomRuleName",
        xtype: "textfield",
        emptyText: "请输入班级名称",  
        allowBlank: false, 
        maxLength: 100,
        maxLengthText: "最多100个字符",
    },{
        beforeLabelTextTpl: comm.get('required'),
        xtype: 'timefield',
        format: 'H:i:s',
        value: '00:00:00',
        minValue: '00:00:00',
        maxValue: '23:59:00',
        increment: 10,
        anchor: '100%',
        invalidText: "时间格式不正确，例如：00:00",
        fieldLabel: "允许关电开始时间",
        name: "shutDownStart",
        allowBlank: false,
        editable:false,
        blankText: "允许关电开始时间不能为空"
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: 'timefield',
        format: 'H:i:s',
        value: '23:50:00',
        minValue: '00:00:00',       
        maxValue: '23:50:00',
        increment: 10,
        anchor: '100%',
        invalidText: "时间格式不正确，例如：00:00",
        fieldLabel: "允许关电结束时间",
        name: "shutDownEnd",
        allowBlank: false,
        editable:false,
        blankText: "允许关电结束时间不能为空"
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "basecombobox",
        ddCode: "WYEKZFS",
        name: 'noMoneyMode',
        value: '1',
        fieldLabel: "无余额控制方式",
        emptyText: '请选择...',
        editable: false,
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "basecombobox",
        ddCode: "KFMS",
        value: '1',
        name: 'deDuctionMode',
        fieldLabel: "扣费模式",
        emptyText: '请选择...',
        editable: false,
    }, {
        beforeLabelTextTpl: comm.get('required'),
        fieldLabel: "报警金额",
        name: "warnvalue",
        value: 100,
        xtype: "numberfield",
        allowDecimals: true,
    }, {
        beforeLabelTextTpl: comm.get('required'),
        fieldLabel: "扣费金额",
        value: 5,
        name: "deDuctionValue",
        xtype: "numberfield",
        allowDecimals: true,
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "combobox",
        store: combostore,
        fieldLabel: "状态",
        value: 0,
        displayField: 'isEnable',
        valueField: 'id',
        name: "isEnable",
        triggerAction: 'all',
        emptyText: '请选择...',
        editable: false,
        mode: 'local'
    }]
});