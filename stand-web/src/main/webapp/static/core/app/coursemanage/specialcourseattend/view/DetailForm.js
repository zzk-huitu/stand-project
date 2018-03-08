Ext.define("core.coursemanage.specialcourseattend.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.specialcourseattend.detailform",
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 100,     //label 的寬度
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "考勤主题不能为空",
        fieldLabel: "考勤主题",
        name: "titleName",
        xtype: "textfield",
        emptyText: "请输入考勤主题",
        maxLength:36,
        maxLengthText:"最多36个字符,汉字占2个字符"
    },]
});