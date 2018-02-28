Ext.define("core.baseset.campus.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.campus.detailform",
    autoHeight: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 120,     //label 的寬度
    },
    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    },/* {
        fieldLabel: "学校主键",
        name: "schoolId",
        xtype: "textfield",
        hidden: true
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            allowBlank: false,
            xtype: "basefuncfield",
            refController: "", //该功能主控制器，这里重新指定为当前视图的控制器了
            funcPanel: "baseset.schoolinfo.mainlayout", //该功能显示的主视图
            formPanel: "baseset.campus.detailform",   //指定当前表单的别名，方便其他地方能找到这个表单组件
            funcTitle: "学校选择", //查询窗口的标题
            configInfo: {
                width: 1110,
                height: 650,
                fieldInfo: "schoolId~schoolName,uuid~schoolName",
                whereSql: " and isDelete='0' and startUsing=1 ",
                orderSql: " order by createTime DESC ",
                muiltSelect: false //是否多选
            },
            fieldLabel: "所属学校",
            emptyText: "请选择所属学校",
            name: "schoolName"
        },{
            xtype: "textfield",
            fieldLabel: "版本号",
            name: "version",
            hidden: true
        }]
    }*/{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            fieldLabel: "学校主键",
            name: "schoolId",
            xtype: "textfield",
            hidden: true
        },{
            columnWidth:0.5,
            fieldLabel: "所属学校",
            name: "schoolName",
            xtype: "textfield",
            readOnly:true,
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        ref:"schoolContainer",
        hideen:true,
        items: [{
            columnWidth:0.5,
            xtype: "numberfield",
            fieldLabel: "排序字段",
            name: "orderIndex",
            allowDecimals: false,
            allowBlank: false,
            blankText: "排序字段不能为空",
        },{
            columnWidth: 0.5,
            xtype: "label",
            margin:'5 0 0 5 ',
            html: "<font color=red,size=12>（显示顺序,不能重复）</font>",
        }]
    }, {
        xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth:0.5,
                beforeLabelTextTpl: comm.get("required"),
                xtype: "textfield",
                fieldLabel: "校区名称",
                name: "campusName",
                allowBlank: false,
                maxLength: 32,
                emptyText: '校区名称(最大32个字符)',
                blankText: "校区名称不能为空"
            },{
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区编码",
                name: "campusCode",
                allowBlank: true,
                maxLength: 32,
                emptyText: '校区编码(最大32个字符)',
                blankText: "校区编码不能为空"
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [ {
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区地址",
                name: "campusAddr",
                allowBlank: true,
                maxLength: 128,
                emptyText: '校区地址(最大128个字符)',
                blankText: "校区地址不能为空"
            },{
               columnWidth:0.5,
               xtype: "textfield",
               fieldLabel: "邮政编码",
               name: "zipCode",
               allowBlank: true,
               maxLength: 6,
               vtype: "zipCode",
               vtypeText: "邮政编码为6位数字",
               emptyText: '邮政编码(6位数字)',
               blankText: "邮政编码不能为空"
           }]
       }, {
        xtype: "container",
            layout: "column", // 从左往右的布局
            items: [ {
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区联系电话",
                name: "campusPhone",
                allowBlank: true,
                maxLength: 30,
                emptyText: '校区联系电话(最大30个字符)',
                blankText: "校区联系电话不能为空"
            },{
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区传真电话",
                name: "campusFax",
                allowBlank: true,
                maxLength: 30,
                emptyText: '校区传真电话(最大30个字符)',
                blankText: "校区传真电话不能为空"
            }]
        },{
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区负责人号",
                name: "campusHead",
                allowBlank: true,
                maxLength: 10,
                emptyText: '负责人工号(最大10个字符)',
                blankText: "负责人工号不能为空"
            }]
        }]
    });