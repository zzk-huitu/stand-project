Ext.define("core.wisdomclass.notice.view.MainQueryPanel", {
	extend: "core.base.view.BaseQueryForm",
	alias: "widget.wisdomclass.notice.mainquerypanel",
	layout: "form",
	frame: false,
	height: 100,

	fieldDefaults: { // 统一设置表单字段默认属性
        labelSeparator: '：', // 分隔符
        labelWidth:100,
        labelAlign: "right",
        width:'100%'
    },   
   
	items: [{
		xtype: "container",
		layout: "column",
		items: [{
			columnWidth:0.25,
			xtype: "basequeryfield",	
			queryType: "datetimefield",
			dateType:'date',		//指定这个组件的格式，date或者datetime
			dataType:'date',		//指定查询设置filter时的进行判断的类型，date或者datetime
			operationType:">=",	
			name: "beginDate",
			fieldLabel: "生效日期",
		},{
			columnWidth:0.25,
			xtype: "basequeryfield",		
			queryType: "datetimefield",
			dateType:'date',
			dataType:'date',
			operationType:"<=",		//运算符
			name: "endDate",
			fieldLabel: "中止日期",
		},{
			columnWidth: 0.25,
			xtype: "basequeryfield",
			name: "noticeTitle",
			fieldLabel: "公告标题",
			queryType: "textfield",		
		},{
			columnWidth: 0.25,
			xtype: "basequeryfield",
			name: "noticeType",
			fieldLabel: "公告类型",
			queryType: "basecombobox",
			config: {
				ddCode: "NOTICETYPE"
			}
		}]
	}],
	buttonAlign: "center",
	buttons: [{
		xtype: 'button',
		text: '搜 索',
		ref: 'gridSearchFormOk',
		iconCls: 'x-fa fa-search',
	}, {
		xtype: 'button',
		text: '重 置',
		ref: 'gridSearchFormReset',
		iconCls: 'x-fa fa-undo',
	}]
});