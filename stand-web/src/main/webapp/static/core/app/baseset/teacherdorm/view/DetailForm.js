Ext.define("core.baseset.teacherdorm.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.teacherdorm.detailform",
    autoHeight: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 110,
        labelAlign: "right"
    },
    items: [{
        xtype: "textfield",
        fieldLabel: 'ID',
        name: "uuid",
        hidden:true
    },{ 
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "房间名称",
            name: "roomName",
            allowBlank: false,
            blankText: "房间名称不能为空",
            readOnly:true
    },{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "床号",
            name: "bedCount",
            allowBlank: false,
            blankText: "房间名称不能为空",
         }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "柜号",
            name: "arkCount",
            allowBlank: false,
            blankText: "房间名称不能为空",
        },{
            name: "dormId",
            xtype: 'textfield',
            hidden: true
        },{
            name: "roomId",
            xtype: 'textfield',
            hidden: true
        },{
            name: "tteacId",
            xtype: 'textfield',
            hidden: true
        },{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "工号",
            name: "userNumb",
            allowBlank: false,
            blankText: "房间名称不能为空",
            readOnly:true
        }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: "姓名",
            name: "sendCheckName",
            allowBlank: false,
            xtype: "basefuncfield",
            formPanel:'baseset.teacherdorm.detailform',
            funcController: "core.public.selectuser.controller.MainController", //该功能主控制器
            funcPanel: "public.selectuser.mainlayout", //该功能显示的主视图
            funcTitle: "人员查询", //查询窗口的标题
            configInfo: {
                fieldInfo: "tteacId~sendCheckName~userNumb,uuid~xm~userNumb",
                whereSql: " and isDelete='0' ",
                muiltSelect: false, //是否多选
                width:1300,
                height:650
            }
        },{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            fieldLabel: "入住时间",
            name: "inTime",
            allowBlank: false,
            blankText: "入住时间不能为空",
            xtype: "datetimefield",
            value: new Date(),
        }]
    }]
});