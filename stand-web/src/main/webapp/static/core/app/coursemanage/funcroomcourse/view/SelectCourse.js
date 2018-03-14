Ext.define("core.coursemanage.funcroomcourse.view.SelectCourse", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.funcroomcourse.selectcourse",
    dataUrl: comm.get('baseUrl') + "/FuncRoomCourse/getCourseByClass",
    model: "com.zd.school.jw.arrangecourse.model.JwCourseArrange",
    al: false,
    noPagging: true,
    columnLines: true, //展示竖线
    viewConfig: {   //用于ext.view的任何配置选项。
        stripeRows: true,             
    },
    selModel: {},
    extParams: {

    },
    defSort: [{
        property: 'teachTime',
        direction: 'ASC'
    }],
    //工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'tbtext',
            html: '选择课程（单击添加）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'tbtext', 
            html:'过滤课程：'
        },{
            xtype:'textfield',
            name:'courseName',
            funCode: 'girdFastSearchText',
            emptyText: '课程名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    },
    columns: {        
        defaults:{
            titleAlign:"center",
            align:'center'
        },
        items: [/*{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },*/{
            text: "节次",
            dataIndex: "teachTime",
            width:100,
            renderer: function(value) {
                return "第" + value + "节";
            }
        }, {
            text: "星期一",
            dataIndex: "courseName01",
            flex:1
        }, {
            text: "星期二",
            dataIndex: "courseName02",
            flex:1
        }, {
            text: "星期三",
            dataIndex: "courseName03",
            flex:1
        }, {
            text: "星期四",
            dataIndex: "courseName04",
            flex:1
        }, {
            text: "星期五",
            dataIndex: "courseName05",
            flex:1
        }, {
            text: "星期六",
            dataIndex: "courseName06",
            flex:1
        }, {
            text: "星期七",
            dataIndex: "courseName07",
            flex:1
        }]
    }
});