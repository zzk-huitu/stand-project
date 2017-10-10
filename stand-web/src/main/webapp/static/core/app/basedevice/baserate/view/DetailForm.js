var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'priceStatus'],
    data: [
        ["0", '启用'],
        ["1", '禁用']
    ]
});

var combostore1 = new Ext.data.ArrayStore({
    fields: ['id', 'categroy'],
    data: [
        ["0", '水控'],
        ["1", '电控']
    ]
});
Ext.define("core.basedevice.baserate.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.baserate.detailform",
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 100,     //label 的寬度
    },
    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    },{
    	beforeLabelTextTpl: comm.get('required'),
        xtype: "combobox",
        store: combostore1,
        fieldLabel: "类别",
        displayField: 'categroy',
        valueField: 'id',
        name: "categroy",
        triggerAction: 'all',
        emptyText: '请选择...',
        blankText: '请选择类别',
        editable: false,
        mode: 'local'
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "名称",
        name: "priceName",
        allowBlank: false,
        emptyText: '名称',
        blankText: "名称不能为空"
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "numberfield",
        allowDecimals:true,
        fieldLabel: "费率",
        name: "priceValue",
        allowBlank: false,
        blankText: "费率不能为空"
    }, {
        xtype: "combobox",
        store: combostore,
        fieldLabel: "状态",
        displayField: 'priceStatus',
        valueField: 'id',
        name: "priceStatus",
        value: "0",
        triggerAction: 'all',
        emptyText: '请选择...',
        blankText: '请选择状态',
        editable: false,
        mode: 'local'
    }, {
        fieldLabel: "备注",
        name: "priceNotes",
        xtype: "textarea",
        maxLength:500
    }]
});