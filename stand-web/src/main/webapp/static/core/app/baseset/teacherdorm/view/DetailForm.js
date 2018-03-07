Ext.define("core.baseset.teacherdorm.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.teacherdorm.detailform",
    autoHeight: true,
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: "：", // 分隔符
        msgTarget: "qtip",
        labelWidth: 100,
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
            fieldLabel: "入住时间",
            name: "inTime",
            allowBlank: false,
            blankText: "入住时间不能为空",
            xtype: "datetimefield",
            value: new Date(),
        }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
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
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel: "姓名",
            name: "sendCheckName",
            allowBlank: false,
            xtype: "basefuncfield",//指定使用的组件
            formPanel:'baseset.teacherdorm.detailform',//当前表单视图
            refController: "baseset.teacherdorm.othercontroller", //该功能主控制器
            funcPanel: "pubselect.selectuserlayout", //该功能显示的主视图
            funcGrid:"pubselect.isselectusergrid",//指定从哪个表格获取数据，与muiltSelect=true 共同使用
            funcTitle: "人员查询", //查询窗口的标题
            configInfo: {
                fieldInfo: "tteacId~sendCheckName~userNumb,uuid~xm~userNumb",//指定字段的对应关系
                muiltSelect: true, //是否多选
                width:1100,
                height:500,
             //   whereSql: ' and xmb = "1" '
            }
        },{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "工号",
            name: "userNumb",
            allowBlank: false,
            blankText: "工号不能为空",
            readOnly:true
        }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "床号",
            name: "bedCount",
            allowBlank: false,
            blankText: "床号不能为空",
         },{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "柜号",
            name: "arkCount",
            allowBlank: false,
            blankText: "柜号不能为空",
        }]
    }]
});