Ext.define("core.wisdomclass.notice.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.notice.detailform",

    //layout:'hbox',

    items :[ {
        xtype: "fieldset",
        title: '公告内容',
        layout:'form',
        padding:"5 5 10 5",
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        defaults:{
            width:'100%',
            margin:"10 0 0 0",
            xtype: "textfield"
        },
        items:[{
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
        },  {
            xtype: 'container',
            layout: "column", // 从左往右的布局
            items:[{
                columnWidth: 1,
                beforeLabelTextTpl: comm.get("required"),
                allowBlank: false,
                blankText: "公告标题不能为空",
                fieldLabel: "公告标题",
                name: "noticeTitle",
                xtype: "textfield",
                emptyText: "请输入公告标题",
                maxLength: 64,
                maxLengthText: "最多64个文字"
            }]
        }, {
            xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: .5,
                beforeLabelTextTpl: comm.get("required"),
                allowBlank: false,
                blankText: "公告类型不能为空",
                fieldLabel: "公告类型",
                name: "noticeType",
                xtype: "basecombobox",
                ddCode: "NOTICETYPE",
                emptyText: "请选择公告类型",              
            }, {
                columnWidth: .5,
                beforeLabelTextTpl: comm.get("required"),
                allowBlank: false,
                blankText: "紧急程度不能为空",
                fieldLabel: "紧急程度",
                name: "emergency",
                xtype: "basecombobox",
                ddCode: "EMERGENCY",
                emptyText: "请选择紧急程度",
            }]
        }, {
            xtype: 'container',
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: .5,
                beforeLabelTextTpl: comm.get("required"),
                allowBlank: false,
                blankText: "生效日期不能为空",
                fieldLabel: "生效日期",
                name: "beginDate",
                xtype: "datetimefield",
                dateType: 'date',
                emptyText: "请选择生效日期",               
            }, {
                columnWidth: .5,
                beforeLabelTextTpl: comm.get("required"),
                allowBlank: false,
                blankText: "中止日期不能为空",
                fieldLabel: "中止日期",
                name: "endDate",
                xtype: "datetimefield",
                dateType: 'date',
                emptyText: "请选择中止日期",
            }]
        },{
            xtype: 'container',
            layout: "column", // 从左往右的布局
            ref:'ueditorContainer',
            minHeight: 360,    
            items: [{
                beforeLabelTextTpl: comm.get("required"),
                fieldLabel: "公告正文",
                //allowBlank: false, 
                //blankText: "公告正文不能为空",
                columnWidth: 1,
                name: "noticeContent",
                xtype: "ueditor",
                height: 300,                
                listeners: {
                    change: function () {
                        var me = this;
                        me.isChanged = true;
                    }
                }
            }]
        },{
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
                    fontSize: '13px'
                }
            },{
                columnWidth : 1,            
                xtype:'uploadpanel',
                addFileBtnText : '选择附件...',  
                uploadBtnText : '上传',  
                removeBtnText : '移除所有',  
                cancelBtnText : '取消上传',  
                file_size_limit : 10,//MB  
                upload_url : comm.get('baseUrl') + "/OaNotice/doUpload",  
                delete_url : comm.get('baseUrl') + "/OaNotice/doDeleteFile", 
                style: {
                    border:'1px solid #ccc'
                },
                height:200,
                margin:'0 0 0 5'
            }] 
        }]
    }, {
        
        xtype: "fieldset",
        title: '发送设置',
        layout:'form',
        //padding:"5 5 10 5",
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        defaults:{
            width:'100%',
            margin:"10 5 0 5",
            xtype: "textfield"
        },
        items: [{
            xtype: 'radiogroup',
            ref:'deptRadio',
            fieldLabel: '通知部门',
            columns: 3,
            vertical: true,
            items: [
                { boxLabel: '所有部门', name: 'deptRadio', inputValue: 1, width:100},
                { boxLabel: '指定部门', name: 'deptRadio', inputValue: 2, width:100},
                { boxLabel: '不通知', name: 'deptRadio', inputValue: 3, width:100, checked: true  },
            ],
            listeners:{
                change:function( filed, newValue, oldValue, eOpts ){
                    var form=filed.up("form");                      
                    var formBase=form.getForm();
                    var deptField = formBase.findField("deptNames");
                    
                    if(newValue.deptRadio==2){                                    
                        deptField.show();                                   
                    }else {
                        deptField.hide();                                              
                    }
                    //console.log(newValue);
                }
            }
        },{
            fieldLabel: "通知部门",
            name: "deptIds",
            xtype: "textfield",
            hidden: true
        }, {
            hidden: true,
            fieldLabel: "选择部门",
            name: "deptNames",      
            emptyText: "请选择公告通知的部门",
            xtype: "basetreefield",
            ddCode: "DEPTTREE",
            formPanel: 'wisdomclass.notice.detailform',
            model: "com.zd.school.plartform.comm.model.CommTreeChk",
            rootId: "ROOT",
            configInfo: {
                multiSelect: true,
                controller:"wisdomclass.notice.othercontroller",
                fieldInfo: "deptNames~deptIds,text~id",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url: comm.get('baseUrl') + "/SysOrg/chkTreeList",
            }

        },{
            xtype:'container',
            layout: "column",
            items:[{
                xtype: 'radiogroup',
                ref:'stuRadio',
                fieldLabel: '通知学生',
                width:400,
                columns: 3,
                vertical: true,
                items: [
                    { boxLabel: '所有学生', name: 'stuRadio', inputValue: 1 , width:100},
                    { boxLabel: '指定学生', name: 'stuRadio', inputValue: 2, width:100},
                    { boxLabel: '不通知', name: 'stuRadio', inputValue: 3,width:100, checked: true  },
                ],
                listeners:{
                    change:function( filed, newValue, oldValue, eOpts ){
                        var form=filed.up("form");                      
                        var formBase=form.getForm();
                        var stuField = formBase.findField("stuNames");
                        
                        if(newValue.stuRadio==2){                                    
                            stuField.show();                                   
                        }else {
                            stuField.hide();                                              
                        }
                        //console.log(newValue);
                    }
                }
            },{
                columnWidth: 0.3,
                margin:'0 0 0 10',
               // fieldLabel: "微信通知家长",
                name: "isNoticeParent",
                xtype: "checkboxfield",
                boxLabel  : '微信通知家长',
                inputValue: '1',

            }]
        },{
            fieldLabel: "选择学生",
            name: "stuIds",
            xtype: "textfield",
            hidden: true
        }, {
            hidden: true,
            fieldLabel: "选择学生",
            name: "stuNames",
            emptyText: "请选择公告通知的学生",
            xtype: "basefuncfield",
            emptyText: "请选择公告通知的学生",
            formPanel: 'wisdomclass.notice.detailform',
            refController: "wisdomclass.notice.othercontroller", //该功能主控制器
            funcPanel: "pubselect.selectuserlayout", //该功能显示的主视图
            funcTitle: "学生选择",     //查询窗口的标题
            funcGrid:'pubselect.isselectusergrid',  //指定从哪个表获取数据（与muiltSelect=true 共同使用）
            configInfo: {
                fieldInfo: "stuIds~stuNames,uuid~xm",
                //whereSql: " and isDelete='0' ",   //根据后台代码，来写 filter参数或whereSql参数
                //orderSql: " order by createTime Desc ",   //根据后台代码，来写 sort参数或orderSql参数
                filter:'[{"type":"string","value":"2","field":"category","comparison":""}]',
                muiltSelect: true, //是否多选
                width: 1000,
                height: 600
            }
        },{
            xtype: 'radiogroup',
            ref:'terminalRadio',
            fieldLabel: '通知终端',
            columns:3,
            vertical: true,
            items: [
                { boxLabel: '所有终端', name: 'terminalRadio', inputValue: '1',width:100 },
                { boxLabel: '指定终端', name: 'terminalRadio', inputValue: '2',width:100},
                { boxLabel: '不通知', name: 'terminalRadio', inputValue: '3',width:100,checked: true  },
            ],
            listeners:{
                change:function( filed, newValue, oldValue, eOpts ){
                    var form=filed.up("form");                      
                    var formBase=form.getForm();
                    var termField = formBase.findField("termNames");
                    
                    if(newValue.terminalRadio==2){                                    
                        termField.show();                                   
                    }else {
                        termField.hide();                                              
                    }
                    //console.log(newValue);
                }
            }
        },{
            fieldLabel: "选择终端",
            name: "termIds",
            xtype: "textfield",
            hidden: true
        }, {
            hidden: true,
            fieldLabel: "选择终端",
            name: "termNames",
            emptyText: "请选择终端",
            xtype: "basetreefield",
            ddCode: "TERMINALTREE",
            //funcPanel:'notice.mainlayout',
            formPanel: 'wisdomclass.notice.detailform', //指定当前表单，方便去获取此文本域值
            model: "com.zd.school.plartform.comm.model.CommTreeChk",    
            rootId: "ROOT",
            configInfo: {
                multiSelect: true,      //多选，true则会显示复选框    
                controller:"wisdomclass.notice.othercontroller",    //处理其他事件的控制器
                fieldInfo: "termNames~termIds,text~treeid",
                whereSql: " and isDelete='0' ",
                orderSql: " order by parentNode,orderIndex asc",
                url: comm.get('baseUrl') + "/OaNotice/getTerminalTtreeList",
            }
        },{
            fieldLabel: "通知角色",
            name: "roleIds",
            xtype: "textfield",
            hidden: true
        }, {
            fieldLabel: "通知角色",
            name: "roleNames",
           //xtype: "textfield",
            emptyText: "请选择公告通知的角色",
            xtype: "basefuncfield",
            formPanel: 'wisdomclass.notice.detailform',
            refController: "wisdomclass.notice.othercontroller", //该功能主控制器
            funcPanel: "pbselectRole.selectrolelayout", //该功能显示的主视图
            funcTitle: "角色选择", //查询窗口的标题
            funcGrid:'pbselectRole.isselectrolegrid',
            configInfo: {
                fieldInfo: "roleIds~roleNames,uuid~roleName",
                whereSql: " and 1=1 and isDelete='0' ",
                width: 1000,
                height: 600,
                muiltSelect: true //是否多选
            }
        },{
            fieldLabel: "通知教职工",
            name: "userIds",
            xtype: "textfield",
            hidden: true
        }, {
            fieldLabel: "通知教职工",
            name: "userNames",
            xtype: "basefuncfield",
            emptyText: "请选择公告通知的教职工",
            formPanel: 'wisdomclass.notice.detailform',
            refController: "wisdomclass.notice.othercontroller", //该功能主控制器
            funcPanel: "pubselect.selectuserlayout", //该功能显示的主视图
            funcTitle: "教职工选择",     //查询窗口的标题
            funcGrid:'pubselect.isselectusergrid',  //指定从哪个表获取数据（与muiltSelect=true 共同使用）
            configInfo: {
                fieldInfo: "userIds~userNames,uuid~xm",
                //whereSql: " and isDelete='0' ",   //根据后台代码，来写 filter参数或whereSql参数
                //orderSql: " order by createTime Desc ",   //根据后台代码，来写 sort参数或orderSql参数
                muiltSelect: true, //是否多选
                width: 1000,
                height: 600
            }
        }]
    }],

});