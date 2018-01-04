Ext.define("core.baseset.roomdefine.view.DetailForm", {
    extend: "core.base.view.BaseForm",
    alias: "widget.baseset.roomdefine.detailform",
    
    sign:"add",
    items: [{
        xtype: "textfield",
        name: "uuid",
        hidden: true
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth: 0.5,
            beforeLabelTextTpl: comm.get("required"),
            fieldLabel:"房间类型",
            name: "roomType", //字段名
            xtype: "combobox",
            store:{
                type:'baseset.roomdefine.roomtypestore'
            },
            displayField: 'roomDefineType',
            valueField: 'code',
            value: "3",//默认选择教室类型
            emptyText: '请选择房间类型',
            blankText: '请选择一个房间类型',
            editable: false,
            mode: 'local',
            listeners: {
                change: function(combo, record, index) {
                    var baseform= combo.up("baseform");
                    var dormContainers=baseform.query("container[ref=dormContainer]"); 
                    var publiContainer=baseform.down("container[ref=publiContainer]"); 
                    for(i in dormContainers){
                        if (record == "1") {//如果是宿舍定义
                           dormContainers[i].setVisible(true);
                           publiContainer.setVisible(true);
                        } else { //如果是教室 ，实验室，功能室，办公室定义
                            dormContainers[i].setVisible(false);
                            publiContainer.setVisible(true);
                        }
                   }
                }
            }
        }, {
            beforeLabelTextTpl: comm.get("required"),
            allowBlank: false,
            blankText: "房间名称不能为空",
            columnWidth: 0.5,
            xtype: "textfield",
            fieldLabel: "房间名称",
            name: "roomName",
            maxLength: 32,
            emptyText: '请输入房间名称(最大32个字符)'
        }]
    }, {
        ref:'dormContainer',
        hidden:true,
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            fieldLabel: "宿舍类型",
            allowBlank: false,
            name: 'dormType',
            xtype: "basecombobox",
            ddCode: "DORMTYPE",
            value: '1'
        }, { 
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            fieldLabel: "宿舍类别",
            allowBlank: false,
            name: 'dormTypeLb',
            xtype: "basecombobox",
            ddCode: "DORMTYPELB",
            value: '1'
        }]
    }, {
        ref:'dormContainer',
        hidden:true,
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "numberfield",
            fieldLabel: "床位数",
            allowDecimals: false,
            maxValue: 8,
            value: 6,
            maxText: "单间宿舍只能分配8人",
            name: "dormBedCount",
            allowBlank: false,
            nanText: '床位数',
            emptyText: '床位数',
            blankText: "床位数不能为空",
            listeners: {
                blur: function(e) {
                    var form = e.up('form');
                    var dormBedCount = form.getForm().findField('dormBedCount').getValue();
                    form.getForm().findField('dormChestCount').setValue(dormBedCount);
                }
            }
        }, {
            columnWidth:0.5,
            beforeLabelTextTpl: comm.get('required'),
            xtype: "numberfield",
            fieldLabel: "柜子数",
            emptyText: '柜子数',
            value: 6,
            name: "dormChestCount"
        }]
      }, {
         ref:'dormContainer',
         hidden:true,
         xtype: "container",
         layout: "column", // 从左往右的布局
            items: [{
            columnWidth:0.5,
            xtype: "textfield",
            fieldLabel: "电话",
            regex: /^[0-9]*$/,
            regexText: '只能输入数字',
            name: "dormPhone",
            maxLength: 20,
        }, {
            columnWidth:0.5,
            xtype: "textfield",
            fieldLabel: "传真",
            regex: /^[0-9]*$/,
            regexText: '只能输入数字',
            name: "dormFax",
            maxLength: 20,
        }]
    }, {
        xtype: "container",
        ref:'publiContainer',
        items: [{
            xtype: "baseset.roomdefine.roomgrid",
            height: 400,
            style:{
                border:'1px solid #ddd'
            }
        }]
     }]
});
