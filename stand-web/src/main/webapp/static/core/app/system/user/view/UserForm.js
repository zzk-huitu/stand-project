Ext.define("core.system.user.view.UserForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.system.user.userform",
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
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "默认密码",
        name: "userPwd",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "排序号",
        name: "orderIndex",
        hidden: true
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
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
        }, {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '真实姓名',
            name: "xm",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入真实姓名(最大36个字符)',
            blankText: "真实姓名不能为空",
            maxLength:36,
            vtype:'xm' 
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "basecombobox",
            fieldLabel: "性别",
            name: "xbm",
            ddCode: "XBM",
            allowBlank: false,
            emptyText: "请选择性别",
            blankText: "性别不能为空",
            value:0
        },{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: '工号/学号',
            name: "userNumb",
            xtype: 'textfield',
            allowBlank: false,
            emptyText: '请输入工号/学号(最大16个字符)',
            blankText: "工号/学号不能为空",
            maxLength:16,
            vtype:'userNumb'  
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [ {
            columnWidth: .5,
            beforeLabelTextTpl: "",
            fieldLabel: '身份证件号',
            name: "sfzjh",
            xtype: 'textfield',
            allowBlank: true,         
            vtype:'idCode'
        },{
            columnWidth: .5,
            beforeLabelTextTpl: "",
            fieldLabel: '移动电话',
            name: "mobile",
            xtype: 'textfield',
            allowBlank: true,
            vtype:'phoneCode'
        }]
    },{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [ {
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "basecombobox",
            fieldLabel: "身份",
            name: "category",
            ddCode: "CATEGORY",
            allowBlank: false,
            blankText: "身份不能为空",
            listeners:{
                change:function( filed, newValue, oldValue, eOpts ){
                    var form=filed.up("form");                      
                    var formBase=form.getForm();
                    var zxxbzlbField = formBase.findField("zxxbzlb");
                    if(newValue==1){                                    
                        zxxbzlbField.show();                                   
                    }else {
                        zxxbzlbField.hide();                                              
                    }
                }
            }

        },{
            columnWidth: .5,            
            xtype: "basecombobox",
            fieldLabel: "编制",
            name: "zxxbzlb",
            ddCode: "ZXXBZLB",
            hidden:true
        }]
    }, /*{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            xtype: "textfield",
            fieldLabel: "部门ID",
            name: "deptId",
            hidden: true
        }, {
            xtype: "textfield",
            fieldLabel: "岗位ID",
            name: "jobId",
            hidden: true
        }, *//*{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            //xtype: "textfield",
            fieldLabel: "所属部门",
            name: "deptName",
            allowBlank: false,
            blankText: "所属部门不能为空",
            //readOnly: true,
            xtype: "basetreefield",
            ddCode: "DEPTTREE",
            rootId: "ROOT",
            configInfo: {
                multiSelect: false,
                fieldInfo: "deptName~deptId,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc"
            } //
        },*/ /*{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "basefuncfield",
            funcController: "core.systemset.jobinfo.controller.jobinfoController", //该功能主控制器
            funcPanel: "jobinfo.mainlayout", //该功能显示的主视图
            funcTitle: "岗位选择", //查询窗口的标题
            configInfo: {
                fieldInfo: "jobId~jobName,uuid~jobName",
                whereSql: " and isDelete='0' ",
                orderSql: " order by jobCode ",
                muiltSelect: true //是否多选
            },
            fieldLabel: '所属岗位',
            name: "jobName",
            allowBlank: true,
            blankText: "所属岗位不能为空"
        }]
    },*/{
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: .5,            
            xtype: "basecombobox",
            fieldLabel: "政治面貌",
            name: "zzmmm",
            ddCode: "ZZMMM"
        }, {
            columnWidth: .5,
            xtype: "datetimefield",
            dateType:'date',
            fieldLabel: "出生日期",
            name: "csrq",
            maxValue:new Date()
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: .5,
            beforeLabelTextTpl: "",
            fieldLabel: '电子邮箱',
            name: "dzxx",
            xtype: 'textfield',
            allowBlank: true,           
            vtype:'email'
        },{
            columnWidth: .5,
            beforeLabelTextTpl: comm.get("required"),
            xtype: "basecombobox",
            fieldLabel: "账号状态",
            name: "state",
            ddCode: "ACCOUNTSTATE",
            allowBlank: false,
            blankText: ""
        }]
    }, {
        xtype: 'container',
        layout: "column", // 从左往右的布局
        items: [ {
            columnWidth: .5,
            fieldLabel: "主部门岗位",
            name: "deptJob",
            xtype: "basetreefield",
            funcPanel:"deptJobfuncpanel",
            ddCode: "DEPTJOBTREE",
            rootId: "ROOT",
            configInfo: {
                multiSelect: false,
                controller : "system.user.othercontroller",
                fieldInfo: "deptJob~deptId,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url: comm.get('baseUrl') + "/SysDeptjob/getDeptJobTree",
           },
        }, {
            fieldLabel: "部门岗位ID",
            columnWidth: 0.5,
            name: "deptId",
            xtype: "textfield",
            hidden:true
        }]
    }]


});