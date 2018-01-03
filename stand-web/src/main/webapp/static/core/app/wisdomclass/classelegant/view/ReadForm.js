Ext.define("core.wisdomclass.classelegant.view.ReadForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.classelegant.readform",

    layout: "form", //从上往下布局

   
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        fieldLabel: "班级名称",
        readOnly:true ,
        name: "className",
        xtype: "textfield",
        emptyText: "",
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        fieldLabel: "风采标题",
        readOnly:true ,
        name: "title",
        xtype: "textfield",
        emptyText: "",
    },{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            width:100,
            text: '文件列表：',
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
            emptyText: '暂无文件',
            store: {
                type: "wisdomclass.classelegant.filestore"               
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
            height: 300,
            margin: '0 0 0 5'
        }]
    }]
});