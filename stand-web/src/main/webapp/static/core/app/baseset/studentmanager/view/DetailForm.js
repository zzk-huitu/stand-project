Ext.define("core.baseset.studentmanager.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.studentmanager.detailform",
    layout: "form",
    autoHeight: true,
    frame: false,
    //bodyPadding: '0 10 10 0',

    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 100,
        labelAlign: "right"
    },
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    }, {
        xtype: "container",
        layout: "column",
        //labelAlign: "right",
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "姓名不能为空",
            fieldLabel: "姓名",
            columnWidth: 0.5,
            name: "xm",
            xtype: "textfield",
            emptyText: "请输入姓名",
            maxLength: 64,
            maxLengthText: "最多64个字符,汉字占2个字符",
        }, {
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "性别不能为空",
            fieldLabel: "性别",
            columnWidth: 0.5,
            name: "xbm",
            xtype: "basecombobox",
            ddCode: "XBM",
            emptyText: "请选择性别",
            maxLength: 1,
            maxLengthText: "最多1个字符,汉字占2个字符",
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "工号不能为空",
            fieldLabel: "工号",
            columnWidth: 0.5,
            name: "userNumb",
            xtype: "textfield",
            emptyText: "请输入工号",
        }, {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '身份证号',
            name: "sfzjh",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入身份证号',
            blankText: "身份证号不能为空",
            vtype:'idCode'
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "移动电话不能为空",
            fieldLabel: "移动电话",
            columnWidth: 0.5,
            name: "lxdh",
            xtype: "textfield",
            emptyText: "请输入移动电话",
            vtype:'phoneCode'
        }, {
            fieldLabel: "电子邮件",
            columnWidth: 0.5,
            name: "dzxx",
            xtype: "textfield",
            emptyText: "请输入电子邮件",
            maxLength: 32,
            maxLengthText: "最多32个字符,汉字占2个字符",
            vtype:'email'
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{         
            fieldLabel: "出生地",
            columnWidth: 0.5,
            name: "csdm",
            xtype: "basecombobox",
            ddCode: "XZQHM",
            emptyText: "请选择出生地",
        }, {            
            fieldLabel: "籍贯",
            columnWidth: 0.5,
            name: "jg",
            xtype:"textfield",
            emptyText: "请输入籍贯",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "国籍",
            columnWidth: 0.5,
            name: "gjdqm",
            xtype: "basecombobox",
            ddCode: "GJDQM",
            emptyText: "国籍",
        },{
        	beforeLabelTextTpl: comm.get("required"),
        	fieldLabel: "民族",
            columnWidth: 0.5,
            name: "mzm",
            xtype: "basecombobox",
            ddCode: "MZM",
            emptyText: "民族"
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "婚姻状况",
            columnWidth: 0.5,
            name: "hyzkm",
            xtype: "basecombobox",
            ddCode: "HYZKM",
            emptyText: "婚姻状况"
        },{
            fieldLabel: "港澳台侨外",
            columnWidth: 0.5,
            name: "gatqwm",
            xtype: "basecombobox",
            ddCode: "GATQWM",
            emptyText: "港澳台侨外",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "政治面貌",
            columnWidth: 0.5,
            name: "zzmmm",
            xtype: "basecombobox",
            ddCode: "ZZMMM",
            emptyText: "政治面貌"
        },{
            fieldLabel: "健康状况",
            columnWidth: 0.5,
            name: "jkzkm",
            xtype: "basecombobox",
            ddCode: "JKZKM",
            emptyText: "健康状况",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "信仰宗教",
            columnWidth: 0.5,
            name: "xyzjm",
            xtype: "basecombobox",
            ddCode: "XYZJM",
            emptyText: "信仰宗教"
        },{
            fieldLabel: "血型",
            columnWidth: 0.5,
            name: "xxm",
            xtype: "basecombobox",
            ddCode: "XXM",
            emptyText: "血型",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "户口所在地",
            columnWidth: 0.5,
            name: "hkszd",
            xtype: "basecombobox",
            ddCode: "XZQHM",
            emptyText: "户口所在地"
        },{
            fieldLabel: "户口性质",
            columnWidth: 0.5,
            name: "hkxzm",
            xtype: "basecombobox",
            ddCode: "HKLBM",
            emptyText: "户口性质",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "学历",
            columnWidth: 0.5,
            name: "xlm",
            xtype: "basecombobox",
            ddCode: "XLM",
            emptyText: "学历"
        },{
            fieldLabel: "编制类别",
            columnWidth: 0.5,
            name: "bzlbm",
            xtype: "basecombobox",
            ddCode: "ZXXBZLB",
            emptyText: "编制类别",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "来校年月",
            columnWidth: 0.5,
            name: "lxny",
            xtype: "textfield",
            emptyText: "来校年月"
        },{
            fieldLabel: "从教年月",
            columnWidth: 0.5,
            name: "cjny",
            xtype: "textfield",
            emptyText: "从教年月",
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: "现住址",
            allowBlank: false,
            columnWidth: 1,
            name: "xzz",
            xtype: "textfield",
            emptyText: "请输入现住址",
            maxLength: 128,
            maxLengthText: "最多128个字符,汉字占2个字符",
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            //width:450,
            columnWidth:1, 
            xtype: "container",
            layout: "vbox",
            labelAlign: "right",
            items: [{
                fieldLabel: "档案编号",
                width:'100%',
                grow: true,
                name: "dabh",
                xtype: "textfield",
                emptyText: "档案编号"
            },{
                fieldLabel: "档案文本",
                width:'100%',
                grow: true,
                name: "dawb",
                xtype: "textfield",
                emptyText: "档案文本",
            },{
            	fieldLabel: "出生日期",
                width:'100%',
                grow: true,
                name: "csrq",
                xtype: "datetimefield",
                emptyText: "出生日期",
            },{
                fieldLabel: "电子信箱",
                width:'100%',
                grow: true,
                name: "dzxx",
                xtype: "textfield",
                emptyText: "电子信箱",
            },{
                fieldLabel: "特长",
                width:'100%',
                grow: true,
                name: "tc",
                xtype: "textfield",
                emptyText: "特长",
            },{
                fieldLabel: "照片地址", //用于表单提交时，提交此数据
                name: "zp",
                xtype: "textfield",
                hidden: true
            },{                    
                width:'100%',
                xtype: 'filefield',
                fieldLabel: '照片',
                fileUpload: true,
                name: 'file',
                buttonText:"选择照片",
                emptyText :'支持文件格式：PNG | JPG | JPEG',
                maxLength: 128,
                //maxLengthText: "最多128个字符,汉字占2个字符",
            }]
        },{
            xtype: "container",
            width:180,                  //这里设置的具体的宽度，那么上边的容器设置的columnWidth就会自动减少可用距离
            margin:'0 0 0 10', 
            labelAlign: "right",
            items: [{
                width:'100%',
                height:240,
                xtype:'image',
                ref:'newsImage',
                style: {
                    background: '#f5f5f5',
                    border: '1px solid #e1e1e1'
                },
                src: '',
            }]
        }]
    }]


});