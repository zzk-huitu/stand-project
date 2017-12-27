Ext.define("core.wisdomclass.redflag.view.MainQueryPanel", {
    extend: "core.base.view.BaseQueryForm",
    alias: "widget.wisdomclass.redflag.mainquerypanel",
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
            name: "className",
            fieldLabel: "班级名称",
            queryType: "textfield",
        },{
            columnWidth:0.25,
            fieldLabel: "开始日期",
            xtype: "basequeryfield",
            queryType: "datetimefield",
            name: "beginDate",
            operationType:">=",
            format: "Y-m-d",
        }, {
            columnWidth:0.25,
            fieldLabel: "结束日期",
            xtype: "basequeryfield",
            queryType: "datetimefield",
            name: "endDate",
            operationType:"<=",
            format: "Y-m-d",
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