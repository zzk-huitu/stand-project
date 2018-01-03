Ext.define("core.wisdomclass.notice.view.ReadForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.notice.readform",

    layout: "form", //从上往下布局

    bodyPadding: '0 10 10 0',
   
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        fieldLabel: "是否需要审核",
        name: "isCheck",
        xtype: "textfield",
        hidden: true
    }, {
        fieldLabel: "是否发送微信",
        name: "sendWx",
        xtype: "textfield",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "公告标题不能为空",
        fieldLabel: "公告标题",
        readOnly:true ,
        name: "noticeTitle",
        xtype: "textfield",
        emptyText: "",
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            readOnly:true ,
            blankText: "公告类型不能为空",
            fieldLabel: "公告类型",
            name: "noticeType",
            xtype: "basecombobox",
            ddCode: "NOTICETYPE",
            emptyText: "请输入公告类型",
        }, {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            readOnly:true ,
            blankText: "紧急程度不能为空",
            fieldLabel: "紧急程度",
            name: "emergency",
            xtype: "basecombobox",
            ddCode: "EMERGENCY",
            emptyText: "请输入紧急程度",
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            readOnly:true  ,
            blankText: "生效日期不能为空",
            fieldLabel: "生效日期",
            name: "beginDate",
            xtype: "datetimefield",
            dateType: 'date',
            format: "Y-m-d",
            emptyText: "请选择生效日期",
        }, {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            readOnly:true   ,
            blankText: "中止日期不能为空",
            fieldLabel: "中止日期",
            name: "endDate",
            xtype: "datetimefield",
            dateType: 'date',
            format: "Y-m-d",
            emptyText: "请选择中止日期"
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "通知部门",
            name: "deptIds",
            xtype: "textfield",
            emptyText: "",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "通知部门",
            name: "deptNames",
            xtype: "textfield",
            readOnly:true
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "通知角色",
            name: "roleIds",
            xtype: "textfield",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "通知角色",
            name: "roleNames",
            xtype: "textfield",
            readOnly:true
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "通知教职工",
            name: "userIds",
            xtype: "textfield",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "通知教职工",
            name: "userNames",
            xtype: "textfield",
            readOnly:true
        }]
    },{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "通知学生",
            name: "stuIds",
            xtype: "textfield",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "通知学生",
            name: "stuNames",
            xtype: "textfield",
            readOnly:true
        }]
    },{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "通知终端",
            name: "termIds",
            xtype: "textfield",
            hidden: true
        }, {
            columnWidth: 1,
            fieldLabel: "通知终端",
            name: "termNames",
            xtype: "textfield",
            readOnly:true
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            width:100,
            text: '附件列表：',
            xtype: 'label',
            height:100,
            margin:'5 0 0 0',
            style: {
                textAlign:'right',
                color: '#404040',
                fontSize: '13px',
                fontWeight: 400
            }
        }, {
            columnWidth: 1,
            xtype: 'dataview',
            ref: 'fileView',
            border: 1,
            emptyText: '暂无附件',
            store: {
                type: "wisdomclass.notice.filestore"               
            },
            style: {
                background: '#fff',
                borderColor: '#b5b8c8',
                borderStyle: 'solid',
                overflow: 'overlay',
                padding: '1px 3px'
            },
            itemSelector: 'a',
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<a target="_blank" href="#" onclick="window.open(\'{fileUrl}\')" title="{name}" style="text-decoration: none;float:left;width:100px;height:80px;margin:8px 4px;display:block;text-align: center;color: #0e9fd6;font-weight: 400;" >',
                '<tpl switch="type.toUpperCase()">',
                '<tpl case=".JPG" case=".JPEG" case=".PNG" case=".GIF" case=".BMP">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/image.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".DOC" case=".DOCX">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/docx.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".XLS" case=".XLSX">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/xlsx.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".PPT" case=".PPTX">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/ppt.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".PDF">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/pdf.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".TXT">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/txt.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".RAR">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/rar.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".ZIP">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/zip.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".WAV" case=".WMA" case=".MP3">',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/music.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl case=".MPEG" case=".MOV" case=".AVI" case=".WMV" case=".MP4" >',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/movie.png" style="width:50px;height:50px;margin-top: 5px;">',
                '<tpl default>',
                '<img src="' + comm.get('baseUrl') + '/static/core/resources/images/fileTypeIcon/other.png" style="width:50px;height:50px;margin-top: 5px;">',
                '</tpl>',
                '<span style="display: block;height: 18px;font-size: 12px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{name}</span>',
                '</a>',
                '</tpl>'
            ),
            //width: 550,
            height: 100,
            margin: '0 0 0 5'
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        ref:'ueditorContainer',
        items: [{         //因为窗体不销毁，但是这个组件每次都销毁；所以这个组件要在控制器中，手动加入
            columnWidth: 1,
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            fieldLabel: '公告正文',
            blankText: "公告正文不能为空",
            name: "noticeContent",
            //id: 'newContent',
            xtype: "ueditor",
            ueditorConfig:{
                readonly:true
            },
            anchor: '-20',
            height: 380,
            listeners: {
                'change': function() {
                    var me = this;
                    me.isChanged = true;
                }
            }

        }]
    }]
});