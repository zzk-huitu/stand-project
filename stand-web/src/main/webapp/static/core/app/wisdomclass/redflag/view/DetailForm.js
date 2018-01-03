Ext.define("core.wisdomclass.redflag.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.redflag.detailform",

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
        fieldLabel: "班级ID",
        name: "claiId",
        xtype: "textfield",
        hidden: true
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        ref:"flagContainer",
        items: [{
            flex: 1,
            columnWidth:0.5,
            fieldLabel: "班级名称",
            name: "className",
            xtype: "textfield",
            readOnly:true
        }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
                flex: 1,
                columnWidth:0.5,
                fieldLabel: "红旗类型",
                name: "redflagType",
                xtype: "basecombobox",
                ddCode:"REDFLAG"
            }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            flex: 1,
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "开始日期不能为空",
            fieldLabel: "开始日期",
            name: "beginDate",
            xtype: "datetimefield",
            dateType: 'date',
            format: "Y-m-d",
            emptyText: "请输入开始日期",
            vtype:'beginDate',
            compareField:'endDate',
        }, {
            flex: 1,
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "结束日期不能为空",
            fieldLabel: "结束日期",
            name: "endDate",
            xtype: "datetimefield",
            dateType: 'date',
            format: "Y-m-d",
            emptyText: "请输入结束日期",
            vtype:'endDate',
            compareField:'beginDate',
        }]
    }]
});