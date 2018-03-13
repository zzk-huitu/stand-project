Ext.define("core.coursemanage.coursetable.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.coursemanage.coursetable.detailform",

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
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '班级',
        name: "className",
        allowBlank: false,
        emptyText: '请输入班级名(最大16个字符)',
        blankText: "班级名不能为空",
        xtype: "basetreefield",
        ddCode: "DEPTTREE",
        rootId: "ROOT",
        configInfo: {
             multiSelect: false,
             fieldInfo: "className~claiId,text~id",
             whereSql: " and isDelete='0' ",
             orderSql: " order by parentNode,orderIndex asc",
             url: comm.get('baseUrl') + "/BaseStudentDorm/classtreelist",
           } 
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '节次',
        name: "teachTime",
        xtype: 'numberfield',
        allowBlank: false,
        emptyText: '请输入节次(最大为9)',
        blankText: "节次不能为空",
        minValue: 1,
        maxValue : 9,
        value :1,
        allowDecimals:false,
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '周一',
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "combobox",
        name: "courseName01",
        store: {
            type: 'coursemanage.coursetable.coursestore',
        //.......这里可以写传入这个store的其他参数
        //model:'core.good.signup.model.SignupGridModel',
        },
        editable: false,
        displayField: "courseName",
        valueField: "courseName",
        listeners: {
            change: function(e) {
              var form = e.up("form");
              form.getForm().findField('courseId01').setValue(e.value["0"]);
             }
          }
    },{
        xtype: "textfield",
        fieldLabel: "课程ID1",
        name: "courseId01",
        hidden: true
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '周二',
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "combobox",
        name: "courseName02",
        store: {
            type: 'coursemanage.coursetable.coursestore',
        //.......这里可以写传入这个store的其他参数
        //model:'core.good.signup.model.SignupGridModel',
        },
        editable: false,
        displayField: "courseName",
        valueField: "courseName",
        listeners: {
            change: function(e) {
              var form = e.up("form");
              form.getForm().findField('courseId02').setValue(e.value["0"]);
             }
         }
    },{
        xtype: "textfield",
        fieldLabel: "课程ID2",
        name: "courseId02",
        hidden: true
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '周三',
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "combobox",
        name: "courseName03",
        store: {
            type: 'coursemanage.coursetable.coursestore',
        //.......这里可以写传入这个store的其他参数
        //model:'core.good.signup.model.SignupGridModel',
        },
        editable: false,
        displayField: "courseName",
        valueField: "courseName",
        listeners: {
            change: function(e) {
               var form = e.up("form");
               form.getForm().findField('courseId03').setValue(e.value["0"]);
              }
          }
    },{
        xtype: "textfield",
        fieldLabel: "课程ID3",
        name: "courseId03",
        hidden: true
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '周四',
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "combobox",
        name: "courseName04",
        store: {
            type: 'coursemanage.coursetable.coursestore',
        //.......这里可以写传入这个store的其他参数
        //model:'core.good.signup.model.SignupGridModel',
        },
        editable: false,
        displayField: "courseName",
        valueField: "courseName",
        listeners: {
            change: function(e) {
               var form = e.up("form");
               form.getForm().findField('courseId04').setValue(e.value["0"]);
             }
         }
    },{
        xtype: "textfield",
        fieldLabel: "课程ID4",
        name: "courseId04",
        hidden: true
    },{
        beforeLabelTextTpl: comm.get("required"),
        fieldLabel: '周五',
        allowBlank: false,
        blankText: "课程编码不能为空",
        xtype: "combobox",
        name: "courseName05",
        store: {
            type: 'coursemanage.coursetable.coursestore',
        //.......这里可以写传入这个store的其他参数
        //model:'core.good.signup.model.SignupGridModel',
        },
        editable: false,
        displayField: "courseName",
        valueField: "courseName",
        listeners: {
           change: function(e) {
              var form = e.up("form");
              form.getForm().findField('courseId05').setValue(e.value["0"]);
             }
        }
    },{
        xtype: "textfield",
        fieldLabel: "课程ID5",
        name: "courseId05",
        hidden: true
    },]
});