Ext.define("core.basedevice.irdevice.view.TreeForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.irdevice.treeform",
    layout: "form",
    autoHeight: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
    },
    items: [{
        fieldLabel: '主键',
        name: "uuid",
        hidden: true
    }, {
        fieldLabel: '等级',
        name: "level",
        hidden: true
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            xtype: "textfield",
            fieldLabel: "上级ID",
            name: "parentNode",
            hidden: true
        }, {
            columnWidth: 1,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "textfield",
            fieldLabel: "上级",
            name: "upbrandname",
            readOnly: true
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: 1,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "textfield",
            fieldLabel: "名称",
            name: "brandname",
            allowBlank: false,
            emptyText: '名称',
            blankText: "名称不能为空",
            maxLength: 50,
        }]
    }]
});