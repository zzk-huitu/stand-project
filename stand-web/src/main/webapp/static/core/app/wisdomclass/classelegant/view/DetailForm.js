Ext.define("core.wisdomclass.classelegant.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.classelegant.detailform",

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
    },{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            width:100,
            text: '文件：',
            xtype: 'label',
            height:100,
            margin:'5 0 0 0',
            style: {
                textAlign:'right',
                color: '#404040',
                fontWeight:400,
                fontSize: '13px'
            }
        },{
            columnWidth : 1,            
            xtype:'uploadpanel',
            addFileBtnText : '选择文件...',  
            uploadBtnText : '上传',  
            removeBtnText : '移除所有',  
            cancelBtnText : '取消上传',  
            file_size_limit : 200,//MB  
            upload_url : comm.get('baseUrl') + "/ClassElegant/doUpload",  
            delete_url : comm.get('baseUrl') + "/ClassElegant/doDeleteFile", 
            style: {
                border:'1px solid #ccc'
            },
            height:300,
            margin:'0 0 0 5'
        }] 
    }]
});