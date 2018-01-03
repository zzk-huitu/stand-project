Ext.define("core.wisdomclass.classmotto.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.classmotto.detailform",
    autoHeight: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 120,
        labelAlign: "right"
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        fieldLabel: "班级名称",
        name: "className",
        xtype: "textfield",
        emptyText: "请输入班级名称",
        maxLength: 36,
        maxLengthText: "最多36个字符,汉字占2个字符",
        readOnly:true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "班训内容不能为空",        
        fieldLabel: "班训",
        name: "classMotto",
        xtype: "textfield",
        emptyText: "请输入班训内容",
        maxLength: 50,
        maxLengthText: "最多50个字符"
    }]
});