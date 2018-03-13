Ext.define("core.coursemanage.specialcourseattend.setTimesForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.specialcourseattend.settimesform",
    //title: "字典信息",
    fieldDefaults: { //统一设置表单字段默认属性
        labelSeparator: '：', //分隔符
        labelWidth: 100, //标签宽度
        msgTarget: 'qtip',
        width: 400,
        labelAlign: 'right'
    }, //
    items: [{
        fieldLabel: "主键",
        name: "uuid",
        xtype: "textfield",
        hidden: true
    },{
        fieldLabel: "titleId",
        name: "titleId",
        xtype: "textfield",
        hidden: true
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "周星期几不能为空",
        fieldLabel: "周星期几",
        name: "weekDay",
        xtype: "numberfield",
        value:'1',
        maxLength:1,
        minValue:1,
        maxValue:7
    },  {
        fieldLabel: "选课开始日期",
        name: "beginDate",
        xtype: "datetimefield",
        dateType:'date',
        vtype:"beginDate",
        compareField:"endDate"
       
    },  {
        fieldLabel: "选课结束日期",
        name: "endDate",
        xtype: "datetimefield",
        dateType:'date',
        vtype:"endDate",
        compareField:"beginDate"
    },  {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "开始时间不能为空",
        fieldLabel: "开始时间",
        name: "beginTime",
        editable: false,
        xtype: "basefuncfield",
        formPanel: 'coursemanage.specialcourseattend.settimesform',
        refController: "coursemanage.specialcourseattend.othercontroller", //该功能主控制器
        funcPanel: "baseset.calendar.mainlayout", //该功能显示的主视图
        funcTitle: "作息时间查询", //查询窗口的标题
        configInfo: {
            fieldInfo: "beginTime~endTime,beginTime~endTime",
            whereSql: " and isDelete='0' ",
            muiltSelect: false, //是否多选
            width: 1200,
            height: 600,
            showTbar:false
        },
        format:'H:i',
      /*  vtype:'startTime',
        compareField:'endTime',*/

     /*   listeners: {
            change: function(field, newValue, oldValue) {
                var objForm = field.up("form");
                var formObj = objForm.getForm();
                var dateUtil = Ext.create("core.util.DateUtil");
                var messageUtil = Ext.create('core.util.MessageUtil');

                //获取结束时间
                var endTime = formObj.findField("endTime").getValue();
                if (!Ext.isEmpty(endTime)) {
                    var endTime=new Date(endTime);
                    var dBegin = new Date(newValue);
                    if(Date.parse(dBegin) >= Date.parse(endTime)){
                        messageUtil.Warning("开始时间要早于结束时间，请重新设置");
                        field.setValue("");
                        return;
                    }
                }
            }
        }*/
    },  {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "结束时间不能为空",
        fieldLabel: "结束时间",
        name: "endTime",
        editable: false,
        xtype: "basefuncfield",
        formPanel: 'coursemanage.specialcourseattend.settimesform',
        refController: "coursemanage.specialcourseattend.othercontroller", //该功能主控制器
        funcPanel: "baseset.calendar.mainlayout", //该功能显示的主视图
        funcTitle: "作息时间查询", //查询窗口的标题
        configInfo: {
            fieldInfo: "beginTime~endTime,beginTime~endTime",
            whereSql: " and isDelete='0' ",
            muiltSelect: false, //是否多选
            width: 1200,
            height: 600,
            showTbar:false
        },
        format:'H:i',
      /*  vtype:'endTime',
        compareField:'beginTime',*/
  /*      listeners: {
            change: function(field, newValue, oldValue) {
                var objForm = field.up("form");
                var formObj = objForm.getForm();
                var dateUtil = Ext.create("core.util.DateUtil");
                var messageUtil = Ext.create('core.util.MessageUtil');

                //获取开始时间
                var beginTime = formObj.findField("beginTime").getValue();
                if (!Ext.isEmpty(beginTime)) {
                    var beginTime=new Date(beginTime);
                    var dend = new Date(newValue);
                    if(Date.parse(dend) <= Date.parse(beginTime)){
                        messageUtil.Warning("开始时间要早于结束时间，请重新设置");
                        field.setValue("");
                        return;
                    }
                }
            }
        }*/
    }, {
        beforeLabelTextTpl: comm.get("required"),
        allowBlank: false,
        blankText: "第几节课不能为空",
        fieldLabel: "第几节课",
        name: "teachTime",
        xtype: "numberfield",
        value:'',
    }]
});