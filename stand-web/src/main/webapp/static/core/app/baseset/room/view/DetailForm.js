var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'roomNet'],
    data: [
        ["0", '有网络'],
        ["1", '无网络']
    ]
});

Ext.define("core.baseset.room.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.room.detailform",
    layout: "form", //从上往下布局
    autoHeight: true,
    frame: false,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 100,
        labelAlign: "right"
    },
    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "区域ID",
        name: "areaId",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "区域名称",
        name: "areaName",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "房间编号",
        name: "roomCode",
        allowBlank: false,
        emptyText: '请输入房间编号（建议格式：楼栋号­-楼层号 +2位房间序号）',
        blankText: "房间编号不能为空",
        maxLength: 32,
    },{
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "门牌号1",
        name: "extField01",
        allowBlank: false,
        emptyText: '请输入门牌号1',
        blankText: "门牌号1不能为空",
        maxLength: 1000,
    }, {
        xtype: "textfield",
        fieldLabel: "门牌号2",
        name: "extField02"
    }, {
        xtype: "textfield",
        fieldLabel: "门牌号3",
        name: "extField03"
    }, {
        xtype: "textfield",
        fieldLabel: "门牌号4",
        name: "extField04"
    }, {
        xtype: "textfield",
        fieldLabel: "门牌号5",
        name: "extField05"
    }, {
        xtype: "combobox",
        store: combostore,
        fieldLabel: "网络状态",
        displayField: 'roomNet',
        valueField: 'id',
        name: "roomNet",
        value: "0",
        triggerAction: 'all',
        emptyText: '请选择...',
        blankText: '请选择网络状态',
        editable: false,
        mode: 'local'
    }, {
        xtype: "textarea",
        fieldLabel: "房间描述",
        name: "roomDesc"
    }]
});