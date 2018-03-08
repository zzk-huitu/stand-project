Ext.define("core.coursemanage.teachercourse.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.teachercourse.detailform",

    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    },/* {
        fieldLabel: "班级ID",
        name: "claiId",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "班级名称",
        name: "className",
        xtype: "textfield",
        emptyText: "请输入班级名称",  
        allowBlank: false,    
        readOnly:true
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: "风采标题",
        name: "title",
        xtype: "textfield",
        emptyText: "请输入风采标题",
        allowBlank: false,
        maxLength: 18,
        maxLengthText: "最多18个字符",
    }*/]
});