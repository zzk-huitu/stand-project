Ext.define("core.coursemanage.coursetable.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.coursemanage.coursetable.maingrid",
	dataUrl: comm.get("baseUrl") + "/CourseArrange/list", //数据获取地址
	model: "com.zd.school.jw.arrangecourse.model.JwCourseArrange", //对应的数据模型

    menuCode:"COURSETABLE",

    al:false,
    columnLines: true, //展示竖线
    viewConfig: {   //用于ext.view的任何配置选项。
        stripeRows: true,             
    },
    
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
        },{
            xtype: 'button',
            text: '启用',
            ref: 'gridSetUse',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'   
        }, {
            xtype: 'button',
            text: '禁用',
            ref: 'gridSetUnUse',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'   
        },,{
            xtype: 'tbtext', 
            html:'（班级中每节次的课程只能启用一条）',
            style:{
                color:'red'
            }
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
        property: 'extField05',
        direction: 'DESC'
    },{
        property: 'teachTime',
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
            text: "班级",
            dataIndex: "className",
            flex:2,
            minWidth:100,
        },  /*{
            text: "学年",
            dataIndex: "schoolYear",
            flex:1,
        }, {
            text: "学期",
            dataIndex: "schoolTerm",
            columnType: "basecombobox", //列类型
            ddCode: "XQ", //字典代码      
            flex:1,   
        },*/{
            text: "节次",
            dataIndex: "teachTime",
            width:70,
            renderer: function(value) {
                return "第"+value+"节";
            }
        },{
            text: "周一",
            dataIndex: "courseName01",
            flex:1,
            minWidth:70,
        },{
            text: "周二",
            dataIndex: "courseName02",
            flex:1,
            minWidth:70,
        },{
            text: "周三",
            dataIndex: "courseName03",
            flex:1,
            minWidth:70,
        },{
            text: "周四",
            dataIndex: "courseName04",
            flex:1,
            minWidth:70,
        },{
            text: "周五",
            dataIndex: "courseName05",
            flex:1,
            minWidth:70,
        },{
            text: "更新时间",
            dataIndex: "updateTime",
            width:150,
        },{
            text:"是否启用",
            dataIndex:'extField05',
            width:100,
            renderer: function(value) {
                return (value == '1') ? '<font color=green>已启用</font>' : '<font color=red>未启用</font>';
            }
        }]
    }
});