Ext.define("core.coursemanage.teachercourse.view.SelectedTeacherGrid", {
	extend: "core.base.view.BaseGrid",
	alias : "widget.coursemanage.teachercourse.selectedteachergrid",
	//dataUrl: comm.get("baseUrl") + "/CourseTeacher/list", //数据获取地址
	model: "com.zd.school.jw.arrangecourse.model.JwCourseteacher", //对应的数据模型
	al:false,
	noPagging: true,
	remoteSort: false,

	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '任课教师',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px'
            }
        },'->',{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',    
            iconCls: 'x-fa fa-minus-circle'
        }],
  
    },   

	//排序字段及模式定义
	/*
	defSort: [{
		property: 'studyYear',
		direction: 'DESC'
	},{
		property: 'semester',
		direction: 'DESC'
	},{
		property: 'className',
		direction: 'ASC'
	}],*/
	extParams: {
		whereSql: ""
	},	

	columns: {        
        defaults:{
            titleAlign:"center"
        },
        items: [/*{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },*/{
    		text: "主键",
    		dataIndex: "uuid",
    		hidden: true
    	},{
			text : "班级ID",
			dataIndex : "claiId",
			hidden:true
		},{
			text : "课程ID",
			dataIndex : "courseId",
			hidden:true
		},{
			text : "教师ID",
			dataIndex : "tteacId",
			hidden:true
		},{
			text: "学年",
			dataIndex: "studyYearName",
			flex:1,
			minWidth:60,
		},{
			text: "学期",
			dataIndex: "semester",
	        columnType: "basecombobox", //列类型
	        ddCode: "XQ", //字典代码   
	        flex:1,
			minWidth:60,
		},{
			text: "班级",
			dataIndex: "className",
			flex:1,
			minWidth:60,
		},{
			text : "教师",
			dataIndex : "xm",
			flex:1,
			minWidth:60,
		},{
			text : "课程",
			dataIndex : "courseName",
			flex:1,
			minWidth:60,
		}]
    }

});