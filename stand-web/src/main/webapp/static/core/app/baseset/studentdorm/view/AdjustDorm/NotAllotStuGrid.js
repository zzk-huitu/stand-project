Ext.define("core.baseset.studentdorm.view.NotAllotStuGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.notallotstugrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classStuNotAllotlist",
    model: "com.zd.school.student.studentclass.model.JwClassstudent",
    extParams: {
      //  whereSql: " where studentId not in (select A.stuId from DormStudentDorm as A where A.isDelete=0) and isDelete=0",
    },
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '未分配宿舍的学生',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '手动分配',
            ref: 'handAllot',
            iconCls: 'x-fa fa-plus-circle',
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
        text: "学生主键",
        dataIndex: "userId",
        field: {
            xtype: "textfield"
        },
        hidden: true
    }, {
        flex:1,
        minWidth: 80,
        text: "姓名",
        dataIndex: "xm",
        field: {
            xtype: "textfield"
        }
    }, {
        width: 60,
        text: "性别",
        dataIndex: "xbm",
        renderer: function(value) {
            switch (value) {
                case '1':
                return '<font color=red>男</font>';
                break;
                case '2':
                return '<font color=green>女</font>';
                break;
            }
        }
    }, {
        flex:1,
        minWidth: 80,
        text: "所属班级",
        dataIndex: "className",
        field: {
            xtype: "textfield"
        }
    }]
}
});