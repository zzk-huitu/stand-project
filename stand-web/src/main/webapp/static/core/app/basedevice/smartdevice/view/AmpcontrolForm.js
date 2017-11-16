Ext.define("core.basedevice.smartdevice.view.AmpcontrolForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.smartdevice.ampcontrolform",
    autoScroll: true,
    items :[ {
       xtype: "fieldset",
       title: '开关基础参数',
       layout:'form',
       width:'99%',
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

            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                name:'tlvs[0].valInt',
                ref: 'tlvsvalInt',
                fieldLabel: '心跳间隔',
                xtype: 'numberfield',
                value: 60,
                maxValue: 300,
                minValue: 1,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>秒（取值范围1-300）</font>"
            }]
        },{
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                name:'tlvs[2].valInt',
                fieldLabel: '接线类型',
                xtype: 'basecombobox',
                name: 'tlvs[2].valInt',
                ref: 'tlvsva2Int',
                ddCode: "JXLX",            
                allowBlank: false,
                value: "1",
            }, /*{
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>次（取值范围1-300）</font>"
            }*/]
        }]
    },{
        xtype: "container",
        layout: "column", // 从左往右的布局    
        width:'99%',
        items:[{
            ref: 'lItems1',
            margin:"5 5 5 0",
            columnWidth: 0.5,
            xtype: "fieldset",
            title: '1路开关',
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
                xtype: "textfield"
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: "设备类型",
                    allowBlank: false,
                    name: 'type',
                    xtype: "basecombobox",
                    ddCode: "SWITCHTERMTYPE",
                    value: '1'
                },{
                    columnWidth: 0.5,                
                    xtype: "checkboxfield",
                    name: "on",
                    fieldLabel: "是否启用",
                }]
            },{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time0',
                    format: 'H:i',
                    fieldLabel: '定时时间1',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status0',
                    columnWidth: 0.5,
                    //width:200,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items1.status0',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items1.status0',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time1',
                    format: 'H:i',
                    fieldLabel: '定时时间2',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status1',
                    columnWidth: 0.5,                
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items1.status1',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items1.status1',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time2',
                    format: 'H:i',
                    fieldLabel: '定时时间3',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status2',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items1.status2',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items1.status2',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time3',
                    format: 'H:i',
                    fieldLabel: '定时时间4',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status3',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items1.status3',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items1.status3',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: 'textarea',
                name: 'notes',
                fieldLabel: '描述',
            }]
        },{
            ref: 'lItems2',
            margin:"5 0 5 5",
            columnWidth: 0.5,
            xtype: "fieldset",
            title: '2路开关',
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
                xtype: "textfield"
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: "设备类型",
                    allowBlank: false,
                    name: 'type',
                    xtype: "basecombobox",
                    ddCode: "SWITCHTERMTYPE",
                    value: '1'
                },{
                    columnWidth: 0.5,                
                    xtype: "checkboxfield",
                    name: "on",
                    fieldLabel: "是否启用",
                }]
            },{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time0',
                    format: 'H:i',
                    fieldLabel: '定时时间1',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status0',
                    columnWidth: 0.5,
                    //width:200,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items2.status0',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items2.status0',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time1',
                    format: 'H:i',
                    fieldLabel: '定时时间2',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status1',
                    columnWidth: 0.5,                
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items2.status1',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items2.status1',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time2',
                    format: 'H:i',
                    fieldLabel: '定时时间3',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status2',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items2.status2',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items2.status2',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time3',
                    format: 'H:i',
                    fieldLabel: '定时时间4',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status3',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items2.status3',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items2.status3',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: 'textarea',
                name: 'notes',
                fieldLabel: '描述',
            }]
        },{
            ref: 'lItems3',
            margin:"5 5 0 0",
            columnWidth: 0.5,
            xtype: "fieldset",
            title: '3路开关',
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
                xtype: "textfield"
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: "设备类型",
                    allowBlank: false,
                    name: 'type',
                    xtype: "basecombobox",
                    ddCode: "SWITCHTERMTYPE",
                    value: '1'
                },{
                    columnWidth: 0.5,                
                    xtype: "checkboxfield",
                    name: "on",
                    fieldLabel: "是否启用",
                }]
            },{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time0',
                    format: 'H:i',
                    fieldLabel: '定时时间1',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status0',
                    columnWidth: 0.5,
                    //width:200,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items3.status0',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items3.status0',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time1',
                    format: 'H:i',
                    fieldLabel: '定时时间2',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status1',
                    columnWidth: 0.5,                
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items3.status1',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items3.status1',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time2',
                    format: 'H:i',
                    fieldLabel: '定时时间3',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status2',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items3.status2',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items3.status2',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time3',
                    format: 'H:i',
                    fieldLabel: '定时时间4',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status3',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items3.status3',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items3.status3',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: 'textarea',
                name: 'notes',
                fieldLabel: '描述',
            }]
        },{
            ref: 'lItems4',
            margin:"5 0 0 5",
            columnWidth: 0.5,
            xtype: "fieldset",
            title: '4路开关',
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
                xtype: "textfield"
            },
            items: [{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    fieldLabel: "设备类型",
                    allowBlank: false,
                    name: 'type',
                    xtype: "basecombobox",
                    ddCode: "SWITCHTERMTYPE",
                    value: '1'
                },{
                    columnWidth: 0.5,                
                    xtype: "checkboxfield",
                    name: "on",
                    fieldLabel: "是否启用",
                }]
            },{
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time0',
                    format: 'H:i',
                    fieldLabel: '定时时间1',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status0',
                    columnWidth: 0.5,
                    //width:200,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items4.status0',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items4.status0',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time1',
                    format: 'H:i',
                    fieldLabel: '定时时间2',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status1',
                    columnWidth: 0.5,                
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items4.status1',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items4.status1',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time2',
                    format: 'H:i',
                    fieldLabel: '定时时间3',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status2',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items4.status2',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items4.status2',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: "container",
                layout: "column", // 从左往右的布局
                items: [{
                    columnWidth: 0.5,
                    xtype: 'timefield',
                    name: 'time3',
                    format: 'H:i',
                    fieldLabel: '定时时间4',
                    minValue: '00:00',
                    maxValue: '23:59',
                    increment: 10,
                    value: '00:00',
                    allowBlank: false,
                    anchor: '100%',
                    invalidText: "时间格式不正确，例如：00:00"
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: '状态',
                    //name: 'status3',
                    columnWidth: 0.5,
                    vertical: true,
                    items: [{
                        boxLabel: '关',
                        inputValue: 0,
                        name: 'items4.status3',
                        checked: true
                    }, {
                        boxLabel: '开',
                        name: 'items4.status3',
                        inputValue: 1,
                    }]
                }]
            }, {
                xtype: 'textarea',
                name: 'notes',
                fieldLabel: '描述',
            }]
        }]
    },{
       xtype: "fieldset",
       title: '批量设置此类设备',
       layout:'form',
       width:'99%',
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
        "tlvs[0].len": 2, //心跳间隔时间
        "tlvs[0].type": 1,
        "tlvs[0].tag": 0x1006,
        "tlvs[1].len": 56, //定时开关时间表
        "tlvs[1].type": 9,
        "tlvs[1].tag": 0xC001,
        "tlvs[2].len": 1, //接线类型
        "tlvs[2].type": 1,
        "tlvs[2].tag": 0xC007,
    }
});