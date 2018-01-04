var combostore = new Ext.data.ArrayStore({
    fields: ['id', 'priceStatus'],
    data: [
        ["0", '禁用'],
        ["1", '启用']
    ]
});

var combostore1 = new Ext.data.ArrayStore({
    fields: ['id', 'categroy'],
    data: [
        ["0", '水控'],
        ["1", '电控']
    ]
});
Ext.define("core.basedevice.baserate.view.DetailForm", {
	extend: "core.base.view.BaseForm",
    alias: "widget.basedevice.baserate.detailform",
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
        	columnWidth: 0.7,
        	xtype: "combobox",
        	store: combostore1,
        	fieldLabel: "类别",
        	displayField: 'categroy',
        	valueField: 'id',
        	name: "categroy",
        	triggerAction: 'all',
        	emptyText: '请选择...',
        	blankText: '请选择类别',
        	editable: false,
        	mode: 'local'
        	},{
        		 columnWidth: 0.3,
                 xtype: "label",
                 html: "&nbsp",
        	}]
    }, {
    	xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.7,
        	beforeLabelTextTpl: comm.get('required'),
        	xtype: "textfield",
        	fieldLabel: "名称",
        	name: "priceName",
        	allowBlank: false,
        	emptyText: '名称',
        	blankText: "名称不能为空",
            maxLength:18
        	},{
                columnWidth: 0.3,
                xtype: "label",
                html: "&nbsp",
            }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        columnWidth: 0.7,
        beforeLabelTextTpl: comm.get('required'),
        xtype: "numberfield",
        allowDecimals:true,
        fieldLabel: "费率",
        name: "priceValue",
        allowBlank: false,
        blankText: "费率不能为空"
        },{
            columnWidth: 0.3,
            xtype: "label",
            html: "&nbsp;<font style='color: rgb(196, 68, 68);font-size: 14px;font-weight:400;line-height: 30px;padding-left: 10px;'>(电控：金额/度)&nbsp&nbsp(水控：金额/升)</font>",
        }]
    }, {
        xtype: "container",
        layout: "column", // 从左往右的布局
        items: [{
        	columnWidth: 0.7,
        	xtype: "combobox",
        	store: combostore,
        	fieldLabel: "状态",
        	displayField: 'priceStatus',
        	valueField: 'id',
        	name: "priceStatus",
        	value: "0",
        	triggerAction: 'all',
        	emptyText: '请选择...',
        	blankText: '请选择状态',
        	editable: false,
        	mode: 'local'
        	},{
            columnWidth: 0.3,
            xtype: "label",
            html: "&nbsp",
        	}]
    }, {
    	xtype: "container",
    	layout: "column", // 从左往右的布局
    	items: [{
    		columnWidth: 0.7,
        	fieldLabel: "备注",
            emptyText: '请输入备注信息',
        	name: "priceNotes",
        	xtype: "textarea",
        	maxLength:500
    		},{
        	columnWidth: 0.3,
            xtype: "label",
            html: "&nbsp",
    		}]
    }]
});