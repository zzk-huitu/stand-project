Ext.define("core.baseset.studentdorm.view.DormNotAllotGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.dormnotallotgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classStuNotAllotlist",
    model: "com.zd.school.student.studentclass.model.JwClassstudent",
    extParams: {
        whereSql: " where studentId not in (select A.stuId from BaseStudentDorm as A where A.isDelete=0) and isDelete=0",
    },
    al: false,
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '未分配宿舍学生列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '手动分配宿舍',
            ref: 'dormFp',
            iconCls: '',
            titleAlign:'right',
        },{
            xtype: 'button',
            text: '自动分配宿舍',
            ref: 'dormzdFp',
            iconCls: 'table_add'
        }]
    },
    columns: {
         defaults:{
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            width: 66,
            text: '序号',
            align: 'center'
        }, {
            text: "学生主键",
            dataIndex: "studentId",
            hidden: true
        }, {
            flex : 1,
            minWidth:100,
            text: "学生学号",
            dataIndex: "userNumb",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
            text: "学生姓名",
            dataIndex: "xm",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
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
            width:100,
            text: "班级名称",
            dataIndex: "className",
            field: {
                xtype: "textfield"
            }
    }]
    }
});