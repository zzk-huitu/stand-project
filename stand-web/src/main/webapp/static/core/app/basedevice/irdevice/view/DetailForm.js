Ext.define("core.basedevice.irdevice.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.irdevice.detailform",
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
        xtype: "textfield",
        fieldLabel: "上级ID",
        name: "parentNode",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "等级",
        name: "level",
        hidden: true
    }, {
        columnWidth: .5,
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "所属品牌",
        name: "brandname",
        allowBlank: false,
        xtype: "basetreefield",
        rootId: "ROOT",
        configInfo: {
            multiSelect: false,
            fieldInfo: "brandname~parentNode,text~id",
            url: comm.get('baseUrl') + "/BasePtIrDeviceBrand/treelist",
        }
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "产品型号",
        name: "productModel",
        allowBlank: false,
        emptyText: '产品型号',
        blankText: "产品型号不能为空",
        maxLength: 100
    }, {
        xtype: "textarea",
        fieldLabel: "备注",
        name: "notes",
        maxLength: 1000
    }]
});