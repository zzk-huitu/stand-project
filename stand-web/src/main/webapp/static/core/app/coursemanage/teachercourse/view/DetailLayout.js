Ext.define("core.coursemanage.teachercourse.view.DetailLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.coursemanage.teachercourse.detaillayout',
	funCode: "teachercourse_detail",
	funData: {
		action: comm.get('baseUrl') + "/CourseTeacher", //请求Action	
		pkName: "uuid",
		defaultObj: {
		}
	},
	
	/*关联此视图控制器*/
	controller: 'coursemanage.teachercourse.detailcontroller',

	 /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,


    layout: {
		type: 'hbox',
		align: 'stretch'
	},
	bodyStyle:{
		background:'#ececec'
	},
    items : [{
		xtype: 'coursemanage.teachercourse.deptcoursetree',
		width:200,
		split:true,
	}, {
		minWidth: 300,
		flex:1,
		xtype: 'coursemanage.teachercourse.courseteachergrid',
		split:true,	
	}, {
		xtype: "container",
		bodyStyle:{
			background:'#ececec'
		},
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		items: [{
			xtype: "form",
			height: 150,
			tbar:{
		        xtype:'toolbar',
		        items: [{
		            xtype: 'tbtext',
		            html: '任课学期学年',
		            style: {
		                fontSize: '16px',
		                color: '#C44444',
		                fontWeight:800,
		                lineHeight:'32px'
		            }
		        }]
		    },
			//title: "任课学期",
			fieldDefaults: { // 统一设置表单字段默认属性
				labelSeparator: "：", // 分隔符
				msgTarget: "qtip",
				labelWidth: 60,
				labelAlign: "right"
			},
			items: [{
				beforeLabelTextTpl: comm.get('required'),
				xtype: "textfield",
				fieldLabel: "学年",
				name: "studyYear",
				allowBlank: false,
				value: comm.get("studyYear"),
				emptyText: '学年', //指定的是文本框中的文字
				blankText: "学年不能为空",
				hidden: true
			}, {
				beforeLabelTextTpl: comm.get('required'),
				xtype: "textfield",
				fieldLabel: "学年",
				name: "studyYearName",
				allowBlank: false,
				value: comm.get("studyYeahname"),
				emptyText: '学年', //指定的是文本框中的文字
				blankText: "学年不能为空",
				readOnly: true
			}, {
				beforeLabelTextTpl: comm.get('required'),
				xtype: "basecombobox",
				fieldLabel: "学期",
				name: "semester",
				ddCode: "XQ",
				allowBlank: false,
				//value: comm.get("semester"),	在打开界面时设定，触发change事件
				emptyText: '请选择学期',
				blankText: "学期不能为空",
				
			}]
		}, {
			xtype: "coursemanage.teachercourse.deptclasstree",
			flex: 1,
			margin:'10 0 0 0'
		}],
		width: 250,
		split:true,
		autoScroll: true
	}, {
		xtype: 'coursemanage.teachercourse.selectedteachergrid',
		split:true,
		minWidth: 300,
		flex:1,
	}] 


})