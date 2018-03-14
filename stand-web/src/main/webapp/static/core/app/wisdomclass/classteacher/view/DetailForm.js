var combostore = new Ext.data.ArrayStore({
  fields: ['id', 'category'],
  data: [
    [0, '正'],
    [1, '副']
  ]
});

Ext.define("core.wisdomclass.classteacher.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.wisdomclass.classteacher.detailform",

    fieldDefaults: { // 统一设置表单字段默认属性
        xtype : 'textfield',
        labelSeparator: '：', // 分隔符
        labelWidth:120,
        labelAlign : 'right',
        msgTarget: 'qtip',
    },

    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    },{
        xtype: "textfield",
        fieldLabel: "班级ID",
        name: "claiId",
        hidden: true
    },{
        xtype: "textfield",
        fieldLabel: "教师id",
        name: "tteacId",
        hidden: true
    },{
        beforeLabelTextTpl: comm.get('required'),
        fieldLabel: "开始担任时间",
        name: "beginTime",
        allowBlank: false,
        blankText: "开始担任不能为空",
        xtype: "datetimefield",
        dateType:'date',
        editable:false,
        value: new Date(),
    }, {
        columnWidth:0.5,
        beforeLabelTextTpl: comm.get('required'),
        allowBlank: false,
        xtype: "basefuncfield",
        refController: "", //该功能主控制器，这里重新指定为当前视图的控制器了
        funcPanel: "pubselect.selectuserlayout", //该功能显示的主视图
        formPanel: "wisdomclass.classteacher.detailform",   //指定当前表单的别名，方便其他地方能找到这个表单组件
        funcGrid:'pubselect.isselectusergrid',
        funcTitle: "选择教师", //查询窗口的标题
        configInfo: {
            width: 1110,
            height: 650,
            fieldInfo: "xm~tteacId,xm~uuid",
            whereSql: " ",
            orderSql: " ",
            muiltSelect: false //是否多选
        },
        fieldLabel: "教师姓名",
        emptyText: "教师姓名",
        blankText: "教师姓名不能为空",
        name: "xm"        
    },{        
        beforeLabelTextTpl: comm.get('required'),
        xtype: "combobox",
        store: combostore,
        fieldLabel: "正/副班主任",
        displayField: 'category',
        valueField: 'id',
        name: "category",
        triggerAction: 'all',
        emptyText: '请选择...',
        blankText: '请选择正/副班主任',
        allowBlank: false,
        editable: false,
        mode: 'local'
    }]
});