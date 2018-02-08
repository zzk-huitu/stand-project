Ext.define("core.baseset.studentdorm.view.MixDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.mixdormgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/mixDormList",
    model: "com.zd.school.build.allot.model.JwClassDormAllot",
    extParams: {
       filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'claiId'}]"
    },
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '未住满宿舍',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
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
        text: "主键",
        dataIndex: "uuid",
        field: {
            xtype: "textfield"
        },
        hidden: true
    },{
        flex:1,
        minWidth: 80,
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
        flex:1,
        minWidth: 80,
        text: "所属班级",
        dataIndex: "clainame",
        field: {
            xtype: "textfield"
        }
    }, {
        width: 75,
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
            }
        }
    }, {
        width: 75,
        text: "最大人数",
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
        width:80,
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