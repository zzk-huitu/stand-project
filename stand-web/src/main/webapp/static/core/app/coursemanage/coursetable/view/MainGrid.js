Ext.define("core.coursemanage.coursetable.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.coursemanage.coursetable.maingrid",
	dataUrl: comm.get("baseUrl") + "/CourseArrange/list", //数据获取地址
	model: "com.zd.school.jw.arrangecourse.model.JwCourseArrange", //对应的数据模型

    menuCode:"COURSETABLE",

    al:false,
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
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
            text: '导入课程',
            ref: 'gridImport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
        }, {
            xtype: 'button',
            text: '下载导入模版',
            ref: 'gridDownExcel',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
//            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },'->'/*,{
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
        }*/],
  
    },   
    defSort: [{
        property: 'teachTime',
        direction: 'ASC'
    },],
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
            dataIndex: "schoolYear",
            flex:1,
        }, {
            text: "学期",
            dataIndex: "schoolTerm",
            columnType: "basecombobox", //列类型
            ddCode: "XQ", //字典代码      
            flex:1,   
        },{
            text: "节次",
            dataIndex: "teachTime",
            flex:1,
        },{
            text: "周一",
            dataIndex: "courseName01",
            flex:1,
        },{
            text: "周二",
            dataIndex: "courseName02",
            flex:1,
        },{
            text: "周三",
            dataIndex: "courseName03",
            flex:1,
        },{
            text: "周四",
            dataIndex: "courseName04",
            flex:1,
        },{
            text: "周五",
            dataIndex: "courseName05",
            flex:1,
        }]
    }
});