Ext.define("core.baseset.teachermanager.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.teachermanager.detailform",
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
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "真实姓名不能为空",
            fieldLabel: "真实姓名",
            columnWidth: 0.5,
            name: "xm",
            xtype: "textfield",
            emptyText: "请输入姓名(最多36个字符,汉字占2个字符)",
            maxLength: 36,
            maxLengthText: "最多36个字符,汉字占2个字符",
        }, {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '用户名',
            name: "userName",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入用户名(最大16个字符)',
            blankText: "用户名不能为空",
            maxLength:16,
            maxLengthText: "最多16个字符",
            vtype:'userName'  
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "性别不能为空",
            fieldLabel: "性别",
            columnWidth: 0.5,
            name: "xbm",
            xtype: "basecombobox",
            ddCode: "XBM",
            emptyText: "请选择性别",
        }, {
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "工号不能为空",
            fieldLabel: "工号",
            columnWidth: 0.5,
            name: "userNumb",
            xtype: "textfield",
            emptyText: "请输入工号(最多16个字符)",
            maxLength:16,
            maxLengthText: "最多16个字符",
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '身份证号',
            name: "sfzjh",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入身份证号',
            blankText: "身份证号不能为空",
            vtype:'idCode'
        }, {
            fieldLabel: "移动电话",
            columnWidth: 0.5,
            name: "lxdh",
            xtype: "textfield",
            vtype:'phoneCode'
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "编制类别",
            columnWidth: 0.5,
            name: "bzlbm",
            xtype: "basecombobox",
            ddCode: "ZXXBZLB"
        }, {
            columnWidth: .5,
            fieldLabel: "主部门岗位",
            name: "deptJob",
            funcPanel:"teachermanagerdeptJobfuncpanel",
            xtype: "basetreefield",
            ddCode: "DEPTJOBTREE",
            rootId: "ROOT",
            configInfo: {
                multiSelect: false,
                controller : "baseset.teachermanager.othercontroller",
                fieldInfo: "deptJob~deptId,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url: comm.get('baseUrl') + "/SysDeptjob/getDeptJobTree",
           } 
        }, {
            fieldLabel: "部门岗位ID",
            columnWidth: 0.5,
            name: "deptId",
            xtype: "textfield",
            hidden:true
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "学历",
            columnWidth: 0.5,
            name: "xlm",
            xtype: "basecombobox",
            ddCode: "XLM"
        }, {
            fieldLabel: "政治面貌",
            columnWidth: 0.5,
            name: "zzmmm",
            xtype: "basecombobox",
            ddCode: "ZZMMM"
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "来校年月",
            columnWidth: 0.5,
            name: "lxny",
            xtype: "datetimefield",
            maxValue:new Date(),
            dateType:'date'
        }, {
            fieldLabel: "从教年月",
            columnWidth: 0.5,
            name: "cjny",
            xtype: "datetimefield",
            maxValue:new Date(),
            dateType:'date'
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
            ddCode: "HYZKM"
        }, {
            fieldLabel: "健康状况",
            columnWidth: 0.5,
            name: "jkzkm",
            xtype: "basecombobox",
            ddCode: "JKZKM"
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "出生日期",
            columnWidth: 0.5,
            name: "csrq",
            xtype: "datetimefield",
            dateType:'date',
            maxValue:new Date()
        }, {         
            fieldLabel: "出生地",
            columnWidth: 0.5,
            name: "csdm",
            xtype: "basecombobox",
            ddCode: "XZQHM"
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
            ddCode: "GJDQM"
        },{
            fieldLabel: "港澳台侨外",
            columnWidth: 0.5,
            name: "gatqwm",
            xtype: "basecombobox",
            ddCode: "GATQWM"
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "信仰宗教",
            columnWidth: 0.5,
            name: "xyzjm",
            xtype: "basecombobox",
            ddCode: "XYZJM"
        }, {
            fieldLabel: "血型",
            columnWidth: 0.5,
            name: "xxm",
            xtype: "basecombobox",
            ddCode: "XXM"
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
            ddCode: "XZQHM"
        }, {
            fieldLabel: "户口性质",
            columnWidth: 0.5,
            name: "hkxzm",
            xtype: "basecombobox",
            ddCode: "HKLBM"
        }]
    }, {
        xtype: "container",
        layout: "column",
        labelAlign: "right",
        items: [{
            fieldLabel: "现住址",
            columnWidth: 1,
            name: "xzz",
            xtype: "textfield",
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
                maxLength: 10,
                maxLengthText: "最多10个字符,汉字占2个字符"
            }, {
                fieldLabel: "档案文本",
                width:'100%',
                grow: true,
                name: "dawb",
                xtype: "textfield",
                maxLength: 128,
                maxLengthText: "最多128个字符,汉字占2个字符"
            },  {               
                fieldLabel: "电子邮件",
                width:'100%',
                grow: true,
                name: "dzxx",
                xtype: "textfield",
                maxLength: 32,
                maxLengthText: "最多32个字符,汉字占2个字符",
                vtype:'email'
            }, {
                fieldLabel: "民族",
                width:'100%',
                grow: true,
                name: "mzm",
                xtype: "basecombobox",
                ddCode: "MZM"
            }, {
                fieldLabel: "特长",
                width:'100%',
                grow: true,
                name: "tc",
                xtype: "textfield",
                maxLength: 128,
                maxLengthText: "最多128个字符,汉字占2个字符"
            }, {
                fieldLabel: "照片地址", //用于表单提交时，提交此数据
                name: "zp",
                xtype: "textfield",
                hidden: true
            }, {                    
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
        }, {
            xtype: "container",
            width:180,                  //这里设置的具体的宽度，那么上边的容器设置的columnWidth就会自动减少可用距离
            height:240,
            margin:'0 0 0 10', 
            labelAlign: "right",
            style: {
                background: '#f5f5f5',
                border: '1px solid #e1e1e1'
            },
            items: [{
                width:'100%',   
                height:238,            
                xtype:'image',
                ref:'photoImage',            
                src: '',
            }]
        }]
    }]


});