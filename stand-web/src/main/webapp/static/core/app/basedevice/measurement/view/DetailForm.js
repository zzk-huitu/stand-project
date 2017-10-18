Ext.define("core.basedevice.measurement.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.measurement.detailform",
    fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        msgTarget: 'qtip',
        labelAlign: "right",
        labelWidth: 100,     //label 的寬度
    },
    items: [{
        xtype: "textfield",
        fieldLabel: "主键",
        name: "uuid",
        hidden: true
    },{
    	xtype: "container",
    	layout: "column", // 从左往右的布局
    	items: [{
    		columnWidth: 0.7,
    		beforeLabelTextTpl: comm.get('required'),
    		xtype: "numberfield",
    		allowDecimals: false,
    		fieldLabel: "计量数",
    		name: "measure",
    		allowBlank: false,
    		blankText: "计量数（脉冲数/升）"
    	},{
            columnWidth: 0.3,
            xtype: "label",
            html: "&nbsp;<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>单位：脉冲数/升</font>",
    	}]
    }, {
    	xtype: "container",
    	layout: "column", // 从左往右的布局
    	items: [{
    		columnWidth: 0.7,
    		fieldLabel: "备注",
    		name: "notes",
    		xtype: "textarea",
    		maxLength: 200,
    	},{
        	columnWidth: 0.3,
            xtype: "label",
            html: "&nbsp",
    		}]
    }]
});