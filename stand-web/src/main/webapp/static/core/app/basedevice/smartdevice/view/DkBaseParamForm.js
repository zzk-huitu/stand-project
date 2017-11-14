var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'pay'],
    data: [
        [0, '预付费'],
        [1, '后付费']
    ]
});

Ext.define("core.basedevice.smartdevice.view.DkBaseParamForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.smartdevice.dkbaseparamform",
    //autoScroll: false,
    items :[ {
       xtype: "fieldset",
       title: '电控基础参数',
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
                columnWidth: 0.4,
                name:'tlvs[0].valInt',
                fieldLabel: '心跳间隔：',
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
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                fieldLabel: '通讯超时：',
                name:'tlvs[1].valInt',
                xtype: 'numberfield',
                value: 5000,
                maxValue: 60000,
                minValue: 5000,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>毫秒 （取值范围5000-60000）</font>"               
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                fieldLabel: '记录间隔：',
                xtype: 'numberfield',
                name:'tlvs[2].valInt',
                value: 1,
                minValue: 1,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>分</font>"     
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                fieldLabel: '报警电量：',
                xtype: 'numberfield',
                name:'tlvs[3].valInt',
                value: 500,
                minValue: 500,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>* 0.01度</font>"           
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                fieldLabel: '最大电量：',
                xtype: 'numberfield',
                name:'tlvs[4].valInt',
                value: 1000000,
                minValue: 1000000,
                maxValue:99999999,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>度</font>"                   
            }]
        }, {
            xtype: "container",
            layout: "column", // 从左往右的布局
            items: [{
                columnWidth: 0.4,
                fieldLabel: '限制电流：',
                name:'tlvs[5].valInt',
                xtype: 'numberfield',
                value: 1,
                minValue: 1,
                allowBlank: false,
                allowDecimals: false
            }, {
                columnWidth: 0.6,
                xtype: "label",
                html: "<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>安</font>"        
            }]
        }, {
            width:300,
            xtype: "combobox",
            store: combostore,
            fieldLabel: "状态",
            displayField: 'pay',
            valueField: 'id',
            name: "tlvs[6].valInt",
            value: 0,
            triggerAction: 'all',
            emptyText: '请选择...',
            blankText: '请选择',
            editable: false,
            allowBlank: false,
            mode: 'local'
        }]
    }, {
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
        "tlvs[0].len":2,
        "tlvs[0].type":1,
        "tlvs[0].tag":0x1006,
        
        "tlvs[1].len":2,//通讯超时：
        "tlvs[1].type":1,
        "tlvs[1].tag":0x1010,
        
        "tlvs[2].len":2,
        "tlvs[2].type":1,
        "tlvs[2].tag":0x8015,
        
        "tlvs[3].len":2,
        "tlvs[3].type":1,
        "tlvs[3].tag":0x8000,
        
        "tlvs[4].len":4,//最大电量
        "tlvs[4].type":1,
        "tlvs[4].tag":0x8001,
        
        "tlvs[5].len":2,//限制电流
        "tlvs[5].type":1,
        "tlvs[5].tag":0x8003,
        
        "tlvs[6].len":1,
        "tlvs[6].type":1,
        "tlvs[6].tag":0x8002
    }
});