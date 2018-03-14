Ext.define("core.wisdomclass.classteacher.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.wisdomclass.classteacher.maingrid",
	dataUrl: comm.get("baseUrl") + "/ClassTeacher/list", //数据获取地址
	model: "com.zd.school.jw.eduresources.model.JwClassteacher", //对应的数据模型

    menuCode:"CLASSTEACHER",

    al:false,
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'button',
            text: '设置班主任',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
        }, {
            xtype: 'button',
            text: '解除设置',
            ref: 'gridOut',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-minus-circle',
            disabled:false,
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
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
        property: 'className',
        direction: 'ASC'
    },{
        property: 'category',
        direction: 'DESC'
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
        }, {
            text: "教师工号",
            dataIndex: "gh",
            flex:1,
        }, {
            text: "教师姓名",
            dataIndex: "xm",
            flex:1,
        },{
            text: "开始担任时间",
            dataIndex: "beginTime",
            flex:1,
            renderer: function(value) {
                var date = new Date(value);
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                return year+"-"+month+"-"+day;
            }
        }, {
            text: "正/副班主任",
            dataIndex: "category",
            flex:1,
            renderer: function(value) {
                switch (value) {
                    case 0:
                        return '正';
                        break;
                    case 1:
                        return '副';
                        break;
                }
            }
        }]
    }
});