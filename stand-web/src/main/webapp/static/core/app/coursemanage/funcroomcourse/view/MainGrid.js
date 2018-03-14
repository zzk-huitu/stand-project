Ext.define("core.coursemanage.funcroomcourse.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.coursemanage.funcroomcourse.maingrid",
	dataUrl: comm.get("baseUrl") + "/FuncRoomCourse/list", //数据获取地址
	model: "com.zd.school.jw.arrangecourse.model.JwFuncroomcourse", //对应的数据模型

    menuCode:"FUNCROOMCOURSE",

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
            titleAlign:"center",
            align:'center',
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
            text: "节次",
            dataIndex: "teachTime",
            width:100,
            renderer: function(value) {
                return "第"+value+"节";
            }
        },{
            text: "星期一",
            dataIndex: "className01",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期一";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期二",
            dataIndex: "className02",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期二";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期三",
            dataIndex: "className03",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期三";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期四",
            dataIndex: "className04",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期四";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期五",
            dataIndex: "className05",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期五";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期六",
            dataIndex: "className06",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期六";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            text: "星期七",
            dataIndex: "className07",
            flex:1,
            renderer: function(value, metaData) {
                var title = "星期七";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }]
    }
});