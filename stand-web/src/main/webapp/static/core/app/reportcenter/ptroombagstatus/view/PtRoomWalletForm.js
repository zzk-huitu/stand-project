Ext.define("core.reportcenter.ptroombagstatus.view.PtRoomWalletForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.reportcenter.ptroombagstatus.ptroomwalletform",
    layout: "form",
    autoHeight: true,
    bodyPadding: '0 10 10 0',

    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 130,
        labelAlign: "right"
    },
    items: [{
            xtype: "textfield",
            fieldLabel: "主键",
            name: "uuid",
            hidden: true
        }, {
            xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: .5,
                fieldLabel: "房间名称",
                name: "roomName",
                id:"roomName1",
                xtype: "textfield",
                labelStyle:"font-size:16px;font-weight:bold;",
                fieldStyle:"border:0px;background:none;font-size:18px;color:red;font-weight:bold;"

            }]
        }, {
            xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: .333,
                fieldLabel: "房间余额",
                name: "roomValue",
                id:"roomValue1",
                xtype: "textfield",
                labelStyle:"font-size:16px;font-weight:bold;",
                fieldStyle:"border:0px;background:none;font-size:16px;color:red;font-weight:bold;"
            },{
                columnWidth: .333,
                fieldLabel : "房间总使用金额",
                name: "roomTotalUsed",
                id:"roomTotalUsed1",
                xtype: "textfield",
                labelStyle:"font-size:16px;font-weight:bold;",
                fieldStyle:"border:0px;background:none;font-size:16px;color:red;font-weight:bold;"
        },{
            columnWidth: .333,
            fieldLabel : "房间总充值金额",
            name: "roomTotalRecharge",
            id:"roomTotalRecharge1",
            xtype: "textfield",
            labelStyle:"font-size:16px;font-weight:bold;",
            fieldStyle:"border:0px;background:none;font-size:16px;color:red;font-weight:bold;"
        }]
        },{xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
            columnWidth: .333,
            fieldLabel : "总用水金额",
            name: "waterTotalused",
            id:"waterTotalused1",
            xtype: "textfield",
            labelStyle:"font-size:16px;font-weight:bold;",
            fieldStyle:"border:0px;background:none;font-size:16px;color:red;font-weight:bold;"
        },{
            columnWidth: .4,
            fieldLabel : "最后用水时间",
            name: "waterUpdateTime",
            id:"waterUpdateTime1",
            xtype: "textfield",
            labelStyle:"font-size:16px;font-weight:bold;",
            fieldStyle:"border:0px;background:none;font-size:16px;"
        }]
        },{xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
            columnWidth: .333,
            fieldLabel : "总用电金额",
            name: "ecTotalUsed",
            id:"ecTotalUsed1",
            xtype: "textfield",
            labelStyle:"font-size:16px;font-weight:bold;",
            fieldStyle:"border:0px;background:none;font-size:16px;color:red;font-weight:bold;"
        },{
            columnWidth: .4,
            fieldLabel : "最后用电时间",
            name: "ecUpdateTime",
            id:"ecUpdateTime1",
            xtype: "textfield",
            labelStyle:"font-size:16px;font-weight:bold;",
            fieldStyle:"border:0px;background:none;font-size:16px;"
        }]
        }]
});