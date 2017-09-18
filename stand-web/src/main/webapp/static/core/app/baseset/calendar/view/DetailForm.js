var isafgernoons = Ext.create('Ext.data.Store', {
    fields: ['isafgernoon', 'name'],
    data : [
        {"isafgernoon":0, "name":"上午"},
        {"isafgernoon":1, "name":"下午"},
        {"isafgernoon":2, "name":"晚上"}
    ]
})

Ext.define("core.baseset.calendar.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.calendar.detailform",
    fieldDefaults: { // 统一设置表单字段默认属性
        xtype : 'textfield',
        labelSeparator: '：', // 分隔符
        labelWidth:80,
        labelAlign : 'right',
        msgTarget: 'qtip',
    },

    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    }, {
        xtype: "textfield",
        fieldLabel: "校历ID",
        name: "canderId",
        hidden: true
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            xtype: "textfield",
            fieldLabel: "目录名称",
            name: "canderName",
            readOnly: true
        }, {
                columnWidth:0.5,
                xtype: "textfield",
                fieldLabel: "校区名称",
                name: "campusName",
                readOnly: true
        }]
    }, {
        xtype: "container",
        layout: "column",
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "combobox",
            itemId:'isafgernoonCombo',
            store: isafgernoons,
            fieldLabel: "时辰",
            name: "isafgernoon",
            queryMode: 'local',
            displayField: 'name',
            valueField: 'isafgernoon',
            value:0,
            editable:false

        }, {
            columnWidth: 0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "textfield",
            fieldLabel: "节次名称",
            name: "jcName",
            allowBlank: false,
            emptyText: '节次名称',
            blankText: "节次名称不能为空"
        }]
    }, {
        xtype: "container",
        layout: "column",
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: 'timefield',
            name: 'beginTime',
            format:'H:i',
            fieldLabel: '开始时间',
            minValue: '6:00',
            maxValue: '23:55',
            increment: 5,
            anchor: '100%',
            allowBlank: false,
            editable:false,
            vtype:'startTime',
            compareField:'endTime',

            // listeners: {
            //     change: function(field, newValue, oldValue) {
            //         var objForm = field.up("form");
            //         var formObj = objForm.getForm();
            //         var dateUtil = Ext.create("core.util.DateUtil");
            //         var messageUtil = Ext.create('core.util.MessageUtil');
                    
            //         //获取结束时间
            //         var endTime = formObj.findField("endTime").getValue();
            //         if (!Ext.isEmpty(endTime)) {
            //             var endTime=new Date(endTime);
            //             var dBegin = new Date(newValue);
            //             if(Date.parse(dBegin) >= Date.parse(endTime)){
            //                 messageUtil.Warning("开始时间要早于结束时间，请重新设置");
            //                 field.setValue("");
            //                 return;
            //             }
            //         }
            //     }
            // }
    }, {
            columnWidth: 0.5,
            xtype: 'timefield',
            name: 'endTime',
            format:'H:i',
            fieldLabel: '结束时间',
            minValue: '6:00',
            maxValue: '23:55',
            increment: 5,
            anchor: '100%',
            editable:false,
            vtype:'endTime',
            compareField:'beginTime',
            /*listeners: {
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
        }]
    }]
});