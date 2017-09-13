Ext.define("core.baseset.campus.view.MainQueryPanel", {
    extend: "core.base.view.BaseQueryForm",
    alias: "widget.baseset.campus.mainquerypanel",
    layout: "form",
    frame: false,
    height: 100,

    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        labelAlign: "right",
        width: '100%'
    },

    items: [{
        xtype: "container",
        layout: "column",
        items: [{
            columnWidth: 0.25,
            xtype: "basequeryfield",
            name: "campusName",
            fieldLabel: "校区名称",
            queryType: "textfield",
        }, {
            columnWidth: 0.25,
            xtype: "basequeryfield",
            name: "campusCode",
            fieldLabel: "校区编码",
            queryType: "textfield",
        }]
    }],
    buttonAlign: "center",
    buttons: [{
        text: '查询',
        ref: 'gridSearchFormOk',
        iconCls: 'x-fa fa-search',
        formBind: true, //只要表单数据正常的时候，才会允许查询
    }, {
        text: '重置',
        ref: 'gridSearchFormReset',
        iconCls: 'x-fa fa-undo'
    }]
});