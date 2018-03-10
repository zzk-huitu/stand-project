Ext.define("core.coursemanage.teachercourse.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.coursemanage.teachercourse.maingrid",
	dataUrl: comm.get("baseUrl") + "/CourseTeacher/list", //数据获取地址
	model: "com.zd.school.jw.arrangecourse.model.JwCourseteacher", //对应的数据模型

    menuCode:"TEACHERCOURSE",

    al:false,
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },{
            xtype: 'button',
            text: '替换老师',
            ref: 'gridReplaceTea',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分 
            iconCls: 'x-fa fa-pencil-square'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'xm',
            funCode: 'girdFastSearchText',
            emptyText: '请输入教师名称'
        },{
            xtype:'textfield',
            name:'courseName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入课程名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
  
    },   
    defSort: [{
        property: 'studyYear',
        direction: 'DESC'
    },{
        property: 'semester',
        direction: 'DESC'
    },{
        property: 'className',
        direction: 'ASC'
    }],
    panelButtomBar:{},
	//扩展参数
	extParams: {
       
    },

	columns: {        
        defaults:{
            titleAlign:"center"
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
            text: "老师主键",
            dataIndex: "tteacId",
            hidden: true
        }, {
            text: "年级ID",
            dataIndex: "graiId",
            hidden: true
        }, {
            text: "学年",
            dataIndex: "studyYearName",
            flex:1,
        }, {
            text: "学期",
            dataIndex: "semester",
            columnType: "basecombobox", //列类型
            ddCode: "XQ", //字典代码      
            flex:1,   
        }, {
            text: "班级",
            dataIndex: "className",
            flex:1,
        }, {
            text: "工号",
            dataIndex: "userNumb",
            flex:1,
        }, {
            text: "教师",
            dataIndex: "xm",
            flex:1,
            renderer: function(v,metaData,record) {
                if (v) {
                    return v;
                } else {
                    return record.data.groupName;
                }
            }
        }, {
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox", //列类型
            ddCode: "XBM", //字典代码
            width:70   
        }, {
            text: "课程",
            dataIndex: "courseName",
            flex:1,
        }]
    }
});