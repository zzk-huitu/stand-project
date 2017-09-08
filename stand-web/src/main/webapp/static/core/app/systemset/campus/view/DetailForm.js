Ext.define("core.systemset.campus.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.systemset.campus.detailform",
    layout: "form",
    autoHeight: true,
    frame: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
    },
    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    }, /*{
        //xtype: "textfield",
        xtype: "basefuncfield",
        funcController: "core.systemset.schoolinfo.controller.SchoolController", //该功能主控制器
        funcPanel: "schoolinfo.mainlayout", //该功能显示的主视图
        funcTitle: "学校选择", //查询窗口的标题
        configInfo: {
            fieldInfo: "schoolId~schoolName,uuid~schoolName",
            whereSql: " and isDelete='0' ",
            orderSql: " order by schoolCode ",
            muiltSelect: false //是否多选
        },
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "所属学校",
        name: "schoolName",
        hidden: false,
        allowBlank: false,
    }*/, {
        xtype: "textfield",
        fieldLabel: "学校主键",
        name: "schoolId",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "版本号",
        name: "version",
        hidden: true
    }, {
        xtype: "numberfield",
        fieldLabel: "排序字段",
        name: "orderIndex",
        hidden: false
    }, {
        beforeLabelTextTpl: comm.get("required"),
        xtype: "textfield",
        fieldLabel: "校区名称",
        name: "campusName",
        allowBlank: false,
        maxLength: 32,
        emptyText: '校区名称(最大32个字符)',
        blankText: "校区名称不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "校区编码",
        name: "campusCode",
        allowBlank: true,
        maxLength: 32,
        emptyText: '校区编码(最大32个字符)',
        blankText: "校区编码不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "校区地址",
        name: "campusAddr",
        allowBlank: true,
        maxLength: 128,
        emptyText: '校区地址(最大128个字符)',
        blankText: "校区地址不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "邮政编码",
        name: "zipCode",
        allowBlank: true,
        maxLength: 6,
        vtype: "zipCode",
        vtypeText: "邮政编码为6位数字",
        emptyText: '邮政编码(6位数字)',
        blankText: "邮政编码不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "校区联系电话",
        name: "campusPhone",
        allowBlank: true,
        maxLength: 30,
        emptyText: '校区联系电话(最大30个字符)',
        blankText: "校区联系电话不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "校区传真电话",
        name: "campusFax",
        allowBlank: true,
        maxLength: 30,
        emptyText: '校区传真电话(最大30个字符)',
        blankText: "校区传真电话不能为空"
    }, {
        xtype: "textfield",
        fieldLabel: "校区负责人号",
        name: "campusHead",
        allowBlank: true,
        maxLength: 10,
        emptyText: '负责人工号(最大10个字符)',
        blankText: "负责人工号不能为空"
    }]
});