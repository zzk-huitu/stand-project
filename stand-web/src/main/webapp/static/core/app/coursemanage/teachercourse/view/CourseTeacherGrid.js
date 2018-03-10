Ext.define("core.coursemanage.teachercourse.view.CourseTeacherGrid", {
    extend: "core.base.view.BaseGrid",
	alias: "widget.coursemanage.teachercourse.courseteachergrid",
	dataUrl: comm.get("baseUrl") + "/TeacherBase/listCourseTeacher", //数据获取地址
	model: "com.zd.school.teacher.teacherinfo.model.TeaTeacherbase", //对应的数据模型


    al:false,
	//工具栏操作按钮
    panelTopBar:null, 
    panelButtomBar:null,
    selModel: {
        type: "checkboxmodel",   
        headerWidth:40,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        mode:'single',
    },
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '课程主讲教师',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px'
            }
        }]
    },

    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },{
        property: 'userNumb',
        direction: 'ASC'
    }],

	//扩展参数
	extParams: {
       
    },

	columns: {        
        defaults:{
            titleAlign:"center",
            align:'center'
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
    		text: "主键",
    		dataIndex: "uuid",
    		hidden: true
    	},{
            text: "工号",
            dataIndex: "userNumb",
            flex:1,   
        }, {
            text: "姓名",
            dataIndex: "xm",
            flex:1,   
        },{
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox", //列类型
            ddCode: "XBM", //字典代码 
            width:70  
        }]
    }
});