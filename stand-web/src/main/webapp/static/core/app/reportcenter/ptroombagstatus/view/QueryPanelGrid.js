Ext.define("core.reportcenter.ptroombagstatus.view.QueryPanelGrid", {
    extend: "core.base.view.BaseQueryForm",
    alias: "widget.reportcenter.ptroombagstatus.querypanelgrid",
    layout: "form",
    frame: false,
    height: 100,
    items: [{
        xtype: "container",
        layout: "column",
        items: [{
            columnWidth:0.3,
            labelWidth: 50,
            xtype: "basequeryfield",
            name: "userNumb",
            fieldLabel: "学号",
            queryType: "textfield",
        }, {
            columnWidth:0.3,
            labelWidth: 50,
            xtype: "basequeryfield",
            name: "xm",
            fieldLabel: "姓名",
            queryType: "textfield",
        },{
            width:70,
            xtype:'button',
            text: '查询',
            ref: 'gridSearchFormOk',
            iconCls: 'x-fa fa-search',
            formBind: true, //只要表单数据正常的时候，才会允许查询
            margin:'0 10 0 10'
        }, {
            width:70,
            xtype:'button',
            text: '重置',
            ref: 'gridSearchFormReset',
            iconCls: 'x-fa fa-undo'
        }]
    }],
    /*
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
    }]*/
});