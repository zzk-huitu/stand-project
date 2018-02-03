Ext.define("core.baseset.studentdorm.view.EmptyMixDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.emptymixdormgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/emptyMixDormList",
    model: "com.zd.school.build.allot.model.JwClassDormAllot",
    extParams: {
    },
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '人数为零的宿舍',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '删除宿舍',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-minus-circle',
            titleAlign:'right',
        },{
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
        minWidth: 100,
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
        minWidth: 100,
        text: "所属班级",
        dataIndex: "clainame",
        field: {
            xtype: "textfield"
        }
    }, {       
        text: "班级主键",
        dataIndex: "claiId",
        hidden: true
    }, {
        width: 80,
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
    } ]
}
});