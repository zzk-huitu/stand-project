var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'name'],
    data: [
        ['0', '禁用'],
        ['1', '启用']
       
    ]
});

Ext.define("core.basedevice.smartdevice.view.SkBaseParamForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.smartdevice.skbaseparamform",
    autoScroll: true,
    items :[ {
        xtype: "fieldset",
        title: '水控基础参数',
        layout:'hbox',
        width:'99%',
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        // defaults:{
        //     width:'100%',
        //     margin:"10 5 0 5",
        //     xtype: "textfield"            
        // },
        items: [{           
            margin:"5 5 5 0",
            flex: 1.5,
            xtype: "fieldset",
            height:280,
            title: null,
            layout:'form',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:400,
                border: '#ececec 1px solid'
            },
            defaults:{
                width:'100%',
                margin:"10 5 0 5",
                xtype: "textfield",
                labelWidth:100
            },
            items: [{
                fieldLabel: "工作模式",
                allowBlank: false,
                name: 'tlvs[3].valInt',
                xtype: "basecombobox",
                ddCode: "GZMODEL",
                value: '0',
                listeners:{
                    select:'onChangeWorkPattern' 
                },
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '单次限量',
                    xtype: 'numberfield',
                    name: 'tlvs[9].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    bind:{
                       html: "{workPatternType.value}"
                    },
                   
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '当天限量',
                    name: 'tlvs[10].valInt',
                    xtype: 'numberfield',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    bind:{
                       html: "{workPatternType.value}"
                    },
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    fieldLabel: '预扣费金额',
                    xtype: 'numberfield',
                    columnWidth: 0.8,
                    name: 'tlvs[6].valInt',
                    value: 0.00,
                    minValue: 0.00,
                    decimalPrecision: 2,
                    allowBlank: false,
                    allowDecimals: true
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>分</font>"
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                columns: 2,
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '最小计费单位',
                    xtype: 'numberfield',
                    name: 'tlvs[4].valInt',
                    value: 1,
                    minValue: 1,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    bind:{
                       html: "{workPatternType.value}"
                    },
                }]
            }, {
                xtype: "combobox",
                store: combostore,
                fieldLabel: "启用自动锁卡",
                displayField: 'name',
                valueField: 'id',
                name: "tlvs[13].valInt",
                value: '0',
                triggerAction: 'all',
                emptyText: '请选择...',
                blankText: '请选择',
                editable: false,
                mode: 'local'
            }]
        },{           
            margin:"5 5 5 0",
            flex: 1.5,
            xtype: "fieldset",
            height:280,
            title: null,
            layout:'form',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:400,
                border: '#ececec 1px solid'
            },
            defaults:{
                width:'100%',
                margin:"10 5 0 5",
                xtype: "textfield",
                labelWidth:80
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '一阶费率',
                    xtype: 'numberfield',
                    name: 'tlvs[14].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>%</font>"
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '二阶费率',
                    xtype: 'numberfield',
                    name: 'tlvs[15].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>%</font>"
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '三阶费率',
                    xtype: 'numberfield',
                    name: 'tlvs[16].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>%</font>"
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '一阶限制值',
                    xtype: 'numberfield',
                    name: 'tlvs[17].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>秒</font>"
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    fieldLabel: '二阶限制值',
                    xtype: 'numberfield',
                    name: 'tlvs[18].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.2,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>秒</font>"
                }]
            }]
        },{           
            margin:"5 5 5 0",
            flex: 2.5,
            xtype: "fieldset",
            height:280,
            title: null,
            layout:'form',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:400,
                border: '#ececec 1px solid'
            },
            defaults:{
                width:'100%',
                margin:"10 5 0 5",
                xtype: "textfield",
                labelWidth:100
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: .5,
                    fieldLabel: '心跳间隔',
                    name: 'tlvs[0].valInt',
                    xtype: 'numberfield',
                    value: 60,
                    maxValue: 300,
                    minValue: 1,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: .5,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>秒（取值范围1-300）</font>"                    
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: .5,
                    fieldLabel: '通讯超时',
                    xtype: 'numberfield',
                    value: 5000,
                    name: 'tlvs[1].valInt',
                    maxValue: 60000,
                    minValue: 5000,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: .5,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>毫秒（取值范围5000-60000）</font>"                  
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: '时间间隔',
                    xtype: 'numberfield',
                    value: 0,
                    name: "tlvs[7].valInt",
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.5,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>分钟（两次消费的时间间隔）</font>"  
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: '最大刷卡次数',
                    xtype: 'numberfield',
                    name: 'tlvs[8].valInt',
                    value: 0,
                    minValue: 0,
                    allowBlank: false,
                    allowDecimals: false
                }, {
                    columnWidth: 0.5,
                    xtype: "label",
                    html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>次（每天最大刷卡次数）</font>"  
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.8,
                    xtype: "combobox",
                    store: combostore,
                    fieldLabel: "启用卡机绑定",
                    displayField: 'name',
                    valueField: 'id',
                    name: "tlvs[12].valInt",
                    value: '0',
                    triggerAction: 'all',
                    emptyText: '请选择...',
                    blankText: '请选择',
                    editable: false,
                    mode: 'local'
                }]
            }]
        }]
    },{
        width:'99%',
        xtype: "fieldset",
        title: '允许卡类（卡费率单位为：分）',
        layout:'column',
        height: 420,
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        defaults:{
            width:'100%',
            margin:"10 5 0 5",
            xtype: "textfield",
            labelWidth:100
        },
        items: [{
            width:100,
            xtype: "button",
            text: "全选（反选）",
            ref: "checkall",        
        },{
            xtype:'container',
            layout:'hbox',
            items:[{
                margin:"0 0 0 10",
                xtype: 'checkboxgroup',
                ref:'sKBaseParamForm_lblOperationBehaviors1',
                width:70,
                columns: 1,
                vertical: true,
                items: [],
                listeners: {
                    render: function(component) {
                        for (var i = 1; i <= 8; i++) {
                            var checkbox = new Ext.form.Checkbox({
                                boxLabel: i + '类卡', //"Title"指的是返回的名字.
                                width: 70,
                                height: 42,
                                name: 'tlvs[11].valStr',
                                checked: true
                            });
                            component.items.add(checkbox);
                        }
                    }
                }
            },{
                xtype: 'container',
                ref:'termparam.KrateForm1',
                vertical: true,
                flex:1,
                items: [],
                listeners: {
                    render: function(view, opt) {                   
                        for (var i = 1; i <= 8; i++) {
                            var numberField = new Ext.form.NumberField({
                                labelAlign: 'right',
                                width: 80,
                                height: 25,
                                name: 'tlvs[5].valStr',
                                allowDecimals: false, //不允许输入小数
                                nanText: "请输入有效数字", //无效数字提示
                                allowBlank: false,
                                allowNegative: false //不允许输入负数
                            });
                            view.items.add(numberField);
                        }
                    }
                }
            },{
                margin:"0 0 0 50",
                xtype: 'checkboxgroup',
                ref:'sKBaseParamForm_lblOperationBehaviors2',
                width:70,
                columns: 1,
                vertical: true,
                items: [],
                listeners: {
                    render: function(component) {
                        for (var i = 9; i <= 16; i++) {
                            var checkbox = new Ext.form.Checkbox({
                                boxLabel: i + '类卡', //"Title"指的是返回的名字.
                                width: 70,
                                height: 42,
                                name: 'tlvs[11].valStr',
                                checked: true
                            });
                            component.items.add(checkbox);
                        }
                    }
                }
            },{
                xtype: 'container',
                ref:'termparam.KrateForm2',
                vertical: true,
                flex:1,
                items: [],
                listeners: {
                    render: function(view, opt) {                   
                        for (var i = 9; i <= 16; i++) {
                            var numberField = new Ext.form.NumberField({
                                labelAlign: 'right',
                                width: 80,
                                height: 25,
                                name: 'tlvs[5].valStr',
                                allowDecimals: false, //不允许输入小数
                                nanText: "请输入有效数字", //无效数字提示
                                allowBlank: false,
                                allowNegative: false //不允许输入负数
                            });
                            view.items.add(numberField);
                        }
                    }
                }
            },{
                margin:"0 0 0 50",
                xtype: 'checkboxgroup',
                ref:'sKBaseParamForm_lblOperationBehaviors3',
                width:70,
                columns: 1,
                vertical: true,
                items: [],
                listeners: {
                    render: function(component) {
                        for (var i = 17; i <= 24; i++) {
                            var checkbox = new Ext.form.Checkbox({
                                boxLabel: i + '类卡', //"Title"指的是返回的名字.
                                width: 70,
                                height: 42,
                                name: 'tlvs[11].valStr',
                                checked: true
                            });
                            component.items.add(checkbox);
                        }
                    }
                }
            },{
                xtype: 'container',
                ref:'termparam.KrateForm3',
                vertical: true,
                flex:1,
                items: [],
                listeners: {
                    render: function(view, opt) {                   
                        for (var i = 17; i <= 24; i++) {
                            var numberField = new Ext.form.NumberField({
                                labelAlign: 'right',
                                width: 80,
                                height: 25,
                                name: 'tlvs[5].valStr',
                                allowDecimals: false, //不允许输入小数
                                nanText: "请输入有效数字", //无效数字提示
                                allowBlank: false,
                                allowNegative: false //不允许输入负数
                            });
                            view.items.add(numberField);
                        }
                    }
                }
            },{
                margin:"0 0 0 50",
                xtype: 'checkboxgroup',
                ref:'sKBaseParamForm_lblOperationBehaviors4',
                width:70,
                columns: 1,
                vertical: true,
                items: [],
                listeners: {
                    render: function(component) {
                        for (var i = 25; i <= 32; i++) {
                            var checkbox = new Ext.form.Checkbox({
                                boxLabel: i + '类卡', //"Title"指的是返回的名字.
                                width: 70,
                                height: 42,
                                name: 'tlvs[11].valStr',
                                checked: true
                            });
                            component.items.add(checkbox);
                        }
                    }
                }
            },{
                xtype: 'container',
                ref:'termparam.KrateForm4',
                vertical: true,
                flex:1,
                items: [],
                listeners: {
                    render: function(view, opt) {                   
                        for (var i = 25; i <= 32; i++) {
                            var numberField = new Ext.form.NumberField({
                                labelAlign: 'right',
                                width: 80,
                                height: 25,
                                name: 'tlvs[5].valStr',
                                allowDecimals: false, //不允许输入小数
                                nanText: "请输入有效数字", //无效数字提示
                                allowBlank: false,
                                allowNegative: false //不允许输入负数
                            });
                            view.items.add(numberField);
                        }
                    }
                }
            }]
        }]
    },{
       width:'99%',
       xtype: "fieldset",
       title: '批量设置此类设备',
       layout:'form',
       style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:400,
            border: '#097db5 1px solid'
        },
        defaults:{
            width:'100%',
            margin:"10 5 0 5",
            xtype: "textfield",
            labelWidth:100
        },
        items:[{
            xtype: 'radiogroup',
            ref:'termRadio',
            fieldLabel: '批量设置',
            columns: 6,
            vertical: true,
            items: [            
                { boxLabel: '不批量设置', name: 'termRadio', inputValue: 0,checked: true , width:100 },        
                { boxLabel: '本楼层', name: 'termRadio', inputValue: 4},   //以下4个数据，对应QYLX区域类型的编号
                { boxLabel: '本楼栋', name: 'termRadio', inputValue: 3},
                { boxLabel: '本校区', name: 'termRadio', inputValue: 2},
                { boxLabel: '本学校', name: 'termRadio', inputValue: 1},
               // { boxLabel: '指定设备', name: 'termRadio', inputValue: 5}
            ],
            listeners:{
                // change:function( filed, newValue, oldValue, eOpts ){
                //     var form=filed.up("form");                      
                //     var formBase=form.getForm();
                //     var termField = formBase.findField("termNames");
                    
                //     if(newValue.termRadio==5){                                    
                //         termField.show();                                   
                //     }else {
                //         termField.hide();                                              
                //     }
                //     //console.log(newValue);
                // }
            }
            
        }/*,{
            fieldLabel: "指定设备",
            name: "termIds",
            xtype: "textfield",
            hidden: true
        }, {
            hidden:true,
            xtype: "basefuncfield",         
            funcPanel: "public.selectGateway.selectgatewaylayout", //该功能显示的主视图
            funcGrid:'public.selectGateway.isselectgatewaygrid',    //指定多选时，获取数据的表格别名
            //refController:'system.dept.othercontroller',             //指定弹出的window引用的控制器，方便方法重写。 若不需要重写，则不配置此项
            formPanel: "basedevice.smartdevice.highparamform",   //指定当前表单的别名，方便其他地方能找到这个表单组件
            funcTitle: "设备选择", //查询窗口的标题
            configInfo: {
                width:1250,
                height:600,
                fieldInfo: "termIds~termNames,uuid~termIds",
                whereSql: " and isDelete='0' ",
                //orderSql: " order by jobCode ",
                muiltSelect: true //是否多选
            },
            fieldLabel: '选择设备',
            name: "termNames",
            allowBlank: true,
            emptyText: "选择需要设置的设备",
        }*/]
    }],

    baseFormData: {
        "tlvs[0].len": 4, //心跳间隔时间 OK
        "tlvs[0].type": 1,
        "tlvs[0].tag": 0x1006,
        "tlvs[1].len": 2, //通讯超时时间 OK
        "tlvs[1].type": 1,
        "tlvs[1].tag": 0x1010,
        "tlvs[3].len": 1, //水控工作模式 OK
        "tlvs[3].type": 1,
        "tlvs[3].tag": 0x1023,
        "tlvs[4].len": 2, //最小计费单位 OK 
        "tlvs[4].type": 1,
        "tlvs[4].tag": 0x1024,
        "tlvs[5].len": 64, //32类卡扣费费率 OK
        "tlvs[5].type": 5,
        "tlvs[5].tag": 0x7000,
        "tlvs[6].len": 4, //预扣费模式下预扣费金额 OK 
        "tlvs[6].type": 1,
        "tlvs[6].tag": 0x2002,
        "tlvs[7].len": 4, //消费刷卡间隔 OK
        "tlvs[7].type": 1,
        "tlvs[7].tag": 0x2003,
        "tlvs[8].len": 4, //日消费刷卡限次 OK
        "tlvs[8].type": 1,
        "tlvs[8].tag": 0x2004,
        "tlvs[9].len": 4, //单次消费限量 OK
        "tlvs[9].type": 1,
        "tlvs[9].tag": 0x2005,
        "tlvs[10].len": 4, //日消费限量 OK
        "tlvs[10].type": 1,
        "tlvs[10].tag": 0x2006,
        "tlvs[11].len": 4, //允许使用的卡类 OK
        "tlvs[11].type": 4,
        "tlvs[11].tag": 0x2007,
        "tlvs[12].len": 1, //卡机绑定标记 OK
        "tlvs[12].type": 1,
        "tlvs[12].tag": 0x2008,
        "tlvs[13].len": 1, //黑名单自动锁卡使能 OK
        "tlvs[13].type": 1,
        "tlvs[13].tag": 0x2009,
        "tlvs[14].len": 4, //一阶费率 OK
        "tlvs[14].type": 1,
        "tlvs[14].tag": 0x2010,
        "tlvs[15].len": 4, //二阶费率 OK
        "tlvs[15].type": 1,
        "tlvs[15].tag": 0x2011,
        "tlvs[16].len": 4, //三阶费率 OK
        "tlvs[16].type": 1,
        "tlvs[16].tag": 0x2012,
        "tlvs[17].len": 4, //一阶限制值 OK
        "tlvs[17].type": 1,
        "tlvs[17].tag": 0x2013,
        "tlvs[18].len": 4, //二阶限制值 OK
        "tlvs[18].type": 1,
        "tlvs[18].tag": 0x2014,
    }
});