Ext.define("core.system.appupdate.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.system.appupdate.detailform",
    fileUpload: true,
    items: [{
        xtype: 'label',
        text: "支持文件格式：APK | IPA",
        margin:'20',
    }, {
        fieldLabel: '主键',
        xtype: "textfield",
        name: "uuid",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        xtype: 'filefield',
        fieldLabel: '文 件',
        fileUpload: true,
        name: 'file',
        allowBlank: false,
        blankText: '请上传文件',
        buttonText:"选择文件",
        width:700
    },{  
        xtype: "container",
        layout: "column",
        items: [{
         columnWidth:1,
         beforeLabelTextTpl: comm.get("required"),
         allowBlank: false,
         xtype: "textfield",
         fieldLabel: "APP标题",
         blankText : "APP标题不能为空",
         name: "appTitle",
         maxLength: 20,
         emptyText: '请输入APP标题(最大20个字符)'
       }]
    },{
        xtype: "container",
        layout: "column",
        items: [{
         columnWidth:1,
         beforeLabelTextTpl: comm.get("required"),
         xtype: "basecombobox",
         fieldLabel: "APP类型",
         name: "appType",
         ddCode: "APPTYPE",
         allowBlank: false,
         blankText : "APP类型不能为空",
        }]
    },{
        xtype: "container",
        layout: "column",
        items: [{
         columnWidth:1,
         beforeLabelTextTpl: comm.get('required'),
         allowBlank: false,
         emptyText: 'APP版本号',
         blankText: "APP版本号不能为空",
         fieldLabel: 'APP版本号',
         xtype: 'numberfield',
         name: "appVersion",
         minValue: 0,
         maxValue : 9999,
         allowDecimals:false,
       }]
    },{
        xtype: "container",
        layout: "column",
        items: [{
             columnWidth:1,
             beforeLabelTextTpl: "",
             allowBlank: true,
             xtype: "textarea",
             fieldLabel: "APP描述",
             name: "appIntro",
             maxLength: 100,
             maxLengthText: "最多100个字符",
         }]
    }],

});