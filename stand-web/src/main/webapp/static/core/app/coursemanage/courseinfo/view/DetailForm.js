Ext.define("core.coursemanage.courseinfo.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.courseinfo.detailform",
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 120,     //label 的寬度
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        xtype: "textfield",
        name: "schoolId",
        hidden: true
    }, {
        fieldLabel: "学校名称",
        name: "schoolName",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get('required'),
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "basecombobox",
        fieldLabel: "课程编码",
        name: "courseCode",
        ddCode: "ZXXKC",
        listeners: {
            change: function(e) {
                var form = e.up("form");
                form.getForm().findField('courseName').setValue(e.rawValue);
            }
        }
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "课程名称",
        name: "courseName",
        allowBlank: false,
        blankText: "课程名称不能为空",
        maxLength: 30
    }, {
        xtype: "basecombobox",
        fieldLabel: "课程等级",
        name: "courseLevel",
        ddCode: "KCJB"
    }, {
        xtype: "basecombobox",
        fieldLabel: "课程类别",
        name: "courseType",
        ddCode: "KCLB"
    }, {
        xtype: "numberfield",
        fieldLabel: "总学时",
        name: "totalHour",
        minValue: 0,
        maxValue : 999,
        allowDecimals:false,
    }, {
        xtype: "numberfield",
        fieldLabel: "周学时",
        name: "weekHour",
        minValue: 0,
        maxValue : 99,
        allowDecimals:false,
    }, {
        xtype: "basecombobox",
        fieldLabel: "授课方式",
        name: "teachWay",
        ddCode: "SKFS"
    },{
        fieldLabel: "课程简介",
        name: "courseDesc",
        xtype: "textarea",
        emptyText: "请输入课程简介",
        maxLength: 512,
        height: 100,
        maxLengthText: "最多512个字符"
    }]
});