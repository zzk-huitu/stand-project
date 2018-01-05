Ext.define("core.smartcontrol.watermeter.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.smartcontrol.watermeter.detailform",

    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        fieldLabel: "班级ID",
        name: "claiId",
        hidden: true
    },{
        xtype:'container',
        layout:'column',
        items:[{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "numberfield",
            allowDecimals: true,
            fieldLabel: "费率",
            name: "measure",
            allowBlank: false,
            blankText: "计量数（脉冲数/升）"
        },{
            columnWidth: 0.5,
            xtype: "label",
            html: "&nbsp;<font style='color: rgb(196, 68, 68); font-weight: 400;font-size: 14px;line-height: 30px;padding-left: 10px;'>计量数（脉冲数/升）</font>",
        }]
    }, {
        fieldLabel: "备注",
        name: "notes",
        xtype: "textarea",
        maxLength: 100,
    }]
});