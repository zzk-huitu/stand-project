Ext.define("core.system.permission.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.system.permission.detailform",
    layout: "form", //从上往下布局
    autoHeight: true,
    frame: false,
   
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 105,
        labelAlign: "right"
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    },{
        fieldLabel: "菜单ID",
        name: "menuId",
        xtype: "textfield",
        hidden: true
    },{       
        fieldLabel: "菜单名称",       
        name: "menuText",
        xtype: "textfield",
        readOnly:true
    },{
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "权限名称不能为空",        
        fieldLabel: "权限名称",    
        name: "perName",
        xtype: "textfield",

        emptyText: "请输入权限名称",
        maxLength:36,
        maxLengthText:"最多36个字符,汉字占2个字符",    
    },{    
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "权限接口前缀不能为空",  
        fieldLabel: "权限接口前缀",
        name: "perAuthCode",
        xtype: "textfield",

        emptyText: "后端接口的Auth值，如：SYSUSER_add，前缀为SYSUSER",
        maxLength:36,
        maxLengthText:"最多36个字符,汉字占2个字符", 
    },{
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "权限接口后缀不能为空",        
        fieldLabel: "权限接口后缀",
        name: "perAuth",
        xtype: "textfield",

        emptyText: "后端接口的Auth值，如：SYSUSER_add，后缀为add",
        maxLength:36,
        maxLengthText:"最多36个字符,汉字占2个字符",    
    },{
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "按钮别名不能为空",        
        fieldLabel: "按钮别名",
        name: "perBtnName",
        xtype: "textfield",

        emptyText: "前端按钮的ref值，如：gridAdd_Tab",
        maxLength:36,
        maxLengthText:"最多36个字符,汉字占2个字符",    
    },{                
        fieldLabel: "备注",
        name: "perRemark",
        xtype: "textfield",
        emptyText: "请输入相关备注信息",
        maxLength:100,
        maxLengthText:"最多100个字符,汉字占2个字符",    
    }]
});