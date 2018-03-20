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
            blankText: "学号不能为空",
            fieldLabel: "学号",
            columnWidth: 0.5,
            name: "userNumb",
            xtype: "textfield",
            emptyText: "请输入工号",
        }, {
            columnWidth: .5,
            fieldLabel: '身份证号',
            name: "sfzjh",
            xtype: 'textfield',
            emptyText: '请输入身份证号',
            blankText: "身份证号不能为空",
            vtype:'idCode'
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '用户名',
            name: "userName",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入用户名(最大16个字符)',
            blankText: "用户名不能为空",
            maxLength:16,
            vtype:'userName'  
        },{         
            fieldLabel: "出生日期",
            columnWidth: 0.5,
            name: "csrq",
            xtype: "datetimefield",
            dateType:'date',
            emptyText: "出生日期"
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "籍贯",
            columnWidth: 0.5,
            name: "jg",
            xtype: "basecombobox",
            ddCode: "XZQHM",
            emptyText: "籍贯",
        },{
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
            fieldLabel: "曾用名",
            columnWidth: 0.5,
            name: "cym",
            xtype: "textfield",
            emptyText: "曾用名"
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
        	xtype:"panel",
        	columnWidth: 0.5,
            layout:"column",
            fieldLabel:'是否独生子女',
            xtype:'radiogroup',
            fieldLabel : "是否独生子女", anchor:'95%',columns: 2 ,items:
            [{boxLabel: "是", name: 'sfdszn',inputValue: '是'},
            {boxLabel: "否", name: 'sfdszn',inputValue: '否'}]
        },{
        	 xtype:"panel",
        	 columnWidth: 0.5,
             layout:"column",
             fieldLabel:'是否流动人口',
             xtype:'radiogroup',
             fieldLabel : "是否流动人口", anchor:'95%',columns: 2 ,items:
             [{boxLabel: "是", name: 'sfldrk',inputValue: '是'},
             {boxLabel: "否", name: 'sfldrk',inputValue: '否'}]
        }]
    },{
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "现住址",
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
            	fieldLabel: "学籍号",
                width:'100%',
                grow: true,
                name: "xjh",
                xtype: "textfield",
                maxLength:30,
                emptyText: "学籍号"
            },{
                fieldLabel: "班号",
                width:'100%',
                grow: true,
                name: "classNumb",
                xtype: "textfield",
                maxLength:30,
                emptyText: "班号"
            },{
                fieldLabel: "特长",
                width:'100%',
                grow: true,
                name: "tc",
                xtype: "textfield",
                emptyText: "特长",
            },{
                fieldLabel: "英文姓名",
                width:'100%',
                grow: true,
                name: "ywxm",
                xtype: "textfield",
                emptyText: "英文姓名",
                maxLength:60,
                vtype:"alpha"
            },{
                fieldLabel: "姓名拼音",
                width:'100%',
                grow: true,
                name: "xmpy",
                xtype: "textfield",
                emptyText: "姓名拼音",
                maxLength: 60,
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