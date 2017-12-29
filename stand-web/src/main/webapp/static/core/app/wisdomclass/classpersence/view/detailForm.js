Ext.define("core.wisdomclass.classpersence.view.detailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.classpersence.detailform",
    autoHeight: true,

    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 120,
        labelAlign: "right"
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        fieldLabel: "班级ID",
        name: "claiId",
        hidden: true
    }, {
        fieldLabel: "班级名称",
        name: "className",
        xtype: "textfield",
        emptyText: "请输入班级名称",
        maxLength: 36,
        maxLengthText: "最多36个字符,汉字占2个字符",
        readOnly:true
    },{
        fieldLabel: "标题",
        name: "title",
        xtype: "textfield",
        emptyText: "请输入标题",
        maxLength: 36,
        maxLengthText: "最多36个字符,汉字占2个字符",
    }, {
        xtype:'container',
        layout : "column", // 从左往右的布局
        items: [{
            width:100,
            text: '文件：',
            xtype: 'label',
            height:100,
            style: {
                textAlign:'right'
            }
        },{
            columnWidth : 1,
            
            xtype:'uploadpanel',
            addFileBtnText : '选择文件...',  
            uploadBtnText : '上传',  
            removeBtnText : '移除所有',  
            cancelBtnText : '取消上传',  
            file_size_limit : 200,//MB  
            upload_url : comm.get('baseUrl') + "/EccClasselegant/doUpload",  
            delete_url : comm.get('baseUrl') + "/EccClasselegant/doDeleteFile", 
            width:550,
            height:150,
            margin:'0 0 0 5'
        }]
    }]
});