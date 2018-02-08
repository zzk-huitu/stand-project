Ext.define("core.baseset.studentdorm.view.ClassDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.classdormgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classDormlist",
    model: "com.zd.school.build.allot.model.JwClassDormAllot",
    extParams: {
       filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'claiId'}]"
    },
    multiSelect: false,
    noPagging: true,
    al: false,
    selModel: {
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '班级宿舍列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                padding: '8px 5px'
            }
        }, '->',{
            xtype: 'button',
            text: '添加班级宿舍',
            ref: 'addClassDorm',
            iconCls: 'x-fa fa-plus-circle',
        }]
    },
      columns: {
         defaults:{
            titleAlign:"center"
        },
        items:[{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    },{
        text: "宿舍id",
        dataIndex: "uuid",
        field: {
            xtype: "textfield"
        },
        hidden: true
    }, {
        text: "班级id",
        dataIndex: "claiId",
        field: {
            xtype: "textfield"
        },
        hidden: true
    }, {
        flex : 1,
        minWidth:75,
        text: "宿舍名称",
        dataIndex: "dormName",
        field: {
            xtype: "textfield"
        },
        renderer: function(value, metaData) {
            var title = "宿舍名称";
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';
            return value;
        }
    }, {
        width:75,
        text: "宿舍类型",
        dataIndex: "dormType",
        renderer: function(value) {
            switch (value) {
                case '1':
                    return '<font color=red>男宿舍</font>';
                    break;
                case '2':
                    return '<font color=green>女宿舍</font>';
                    break;
                case '3':
                    return '<font color=blue>不限</font>';
                    break;
            }
        }
    }, {
        width:60,
        text: "床位数",
        dataIndex: "dormBedCount",
        field: {
            xtype: "textfield"
        }
    }, {
        width: 75,
        text: "入住人数",
        dataIndex: "stuCount",
        field: {
            xtype: "textfield"
        }
    }, {
        width:75,
        text: "混班宿舍",
        dataIndex: "ismixed",
        renderer: function(value) {
            switch (value) {
                case '1':
                    return '<font color=red>是</font>';
                    break;
                default:
                    return '<font color=green>否</font>';
                    break;
            }
        }
    }]
    }
});