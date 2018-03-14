Ext.define("core.coursemanage.funcroomcourse.view.SelectedCourse", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.coursemanage.funcroomcourse.selectedcourse",
    dataUrl: "",
    //model: "com.zd.school.jw.arrangecourse.model.JwFuncroomcourse",
    al: false,
    noPagging: true,
    columnLines: true, //展示竖线
    viewConfig: {   //用于ext.view的任何配置选项。
        stripeRows: true,             
    },
    remoteSort:false,
    selModel: {},
    extParams: {

    },
    defSort: [{
        property: 'teachTime',
        direction: 'ASC'
    }],
    panelTopBar:{
        xtype:'toolbar',
        items: [ {
            xtype: 'tbtext',
            html: '已选择课程（双击删除）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px',
            }
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
        },  {
            text: "星期一",
            dataIndex: "className01",
            flex:1
        }, {
            text: "星期二",
            dataIndex: "className02",
            flex:1
        }, {
            text: "星期三",
            dataIndex: "className03",
            flex:1
        }, {
            text: "星期四",
            dataIndex: "className04",
            flex:1
        }, {
            text: "星期五",
            dataIndex: "className05",
            flex:1
        }, {
            text: "星期六",
            dataIndex: "className06",
            flex:1
        }, {
            text: "星期七",
            dataIndex: "className07",
            flex:1
        }]
    }
});