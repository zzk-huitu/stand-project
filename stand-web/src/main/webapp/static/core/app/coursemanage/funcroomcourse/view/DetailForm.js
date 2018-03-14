Ext.define("core.coursemanage.funcroomcourse.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.funcroomcourse.detailform",

    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }]
});