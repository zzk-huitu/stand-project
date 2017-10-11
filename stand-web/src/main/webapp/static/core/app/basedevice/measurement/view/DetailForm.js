Ext.define("core.basedevice.measurement.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.measurement.detailform",
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
        xtype: "numberfield",
        allowDecimals: true,
        fieldLabel: "费率",
        name: "measure",
        allowBlank: false,
        blankText: "计量数（脉冲数/升）"
    }, {
        fieldLabel: "备注",
        name: "notes",
        xtype: "textarea",
        maxLength: 200,
    }]
});