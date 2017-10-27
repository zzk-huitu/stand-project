Ext.define("core.basedevice.basedeviceallot.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.basedeviceallot.detailform",
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
    }, {
        beforeLabelTextTpl: comm.get('required'),
        xtype: "textfield",
        fieldLabel: "设备名称",
        emptyText: '设备名称',
        name: "termName"
    }, {
        columnWidth: .5,
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "所属房间",
        name: "roomName",
        allowBlank: false,
        xtype: "basetreefield",
        rootId: "ROOT",
        configInfo: {
            multiSelect: false,
            fieldInfo: "roomName~roomId,text~id",
            url: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
        }
    }, {
        xtype: "textfield",
        name: "roomId",
        hidden: true
    }]
});