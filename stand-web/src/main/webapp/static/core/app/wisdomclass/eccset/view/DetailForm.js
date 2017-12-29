Ext.define("core.wisdomclass.eccset.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.eccset.detailform",
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
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "规则名称不能为空",
        fieldLabel: "规则名称",
        name: "ruleName",
        xtype: "textfield",
        emptyText: "请输入规则名称",
        maxLength: 36,
        maxLengthText: "最多36个字符,汉字占2个字符"
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: 1,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: "考勤模式",
            allowBlank: false,
            xtype: 'radiogroup',
            id: 'radcheckMode',
            name: 'checkMode',
            columns: 3, //3列
            items: [{
                boxLabel: '半天考勤',
                name: 'checkMode',
                inputValue: '1',
            }, {
                boxLabel: '全天考勤 ',
                inputValue: '2',
                name: 'checkMode'
            }, {
                boxLabel: '节次考勤',
                inputValue: '3',
                name: 'checkMode',
                checked: true
            }]
        }]
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "签到提前分钟不能为空",
        fieldLabel: "签到提前分钟",
        name: "inBefore",
        xtype: "numberfield",
        emptyText: "请输入签到提前分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "迟到分钟不能为空",
        fieldLabel: "迟到分钟",
        name: "beLate",
        xtype: "numberfield",
        emptyText: "请输入迟到分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "缺勤分钟不能为空",
        fieldLabel: "缺勤分钟",
        name: "absenteeism",
        xtype: "numberfield",
        emptyText: "请输入缺勤分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: 0.3,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: "是否需要签退",
            xtype: "checkbox",
            name: "needCheckout",
        }, {
            columnWidth: 0.7,
            xtype: "label",
            html: "<font color=red,size=12>(打勾表示需要)</font>",
        }]
    }, {
        fieldLabel: "签退提前分钟",
        name: "outBefore",
        xtype: "numberfield",
        emptyText: "请输入签退提前分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        fieldLabel: "早退分钟",
        name: "leaveEarly",
        xtype: "numberfield",
        emptyText: "请输入早退分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        fieldLabel: "签退延迟分钟",
        name: "outLate",
        xtype: "numberfield",
        emptyText: "请输入签退延迟分钟",
        maxLength: 5,
        maxLengthText: "最多5个字符,汉字占2个字符",
        allowDecimals:false,
    }, {
        fieldLabel: "规则说明",
        name: "ruleDesc",
        xtype: "textfield",
        emptyText: "请输入规则说明",
        maxLength: 255,
        height: 100,
        maxLengthText: "最多255个字符,汉字占2个字符",
        allowDecimals:false,
    }]
});