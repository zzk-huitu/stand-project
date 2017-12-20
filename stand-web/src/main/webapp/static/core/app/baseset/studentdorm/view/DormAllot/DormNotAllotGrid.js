Ext.define("core.baseset.studentdorm.view.DormNotAllotGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.dormnotallotgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classStuNotAllotlist",
    model: "com.zd.school.student.studentclass.model.JwClassstudent",
    extParams: {
        whereSql: " where studentId not in (select A.stuId from BaseStudentDorm as A where A.isDelete=0) and isDelete=0",
    },
    al: false,
    noPagging: false,
    pageDisplayInfo:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '未分配宿舍学生',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '手动分配',
            ref: 'dormFp',
            iconCls: 'x-fa fa-plus-circle',
            titleAlign:'right',
        },{
            xtype: 'button',
            text: '自动分配',
            ref: 'dormzdFp',
            iconCls: 'x-fa fa-plus-circle'
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
        }, {
            text: "学生主键",
            dataIndex: "userId",
            hidden: true
        }, {
            flex : 1,
            minWidth:80,
            text: "学生学号",
            dataIndex: "userNumb",
            field: {
                xtype: "textfield"
            }
        }, {
            flex : 1,
            minWidth:80,
            text: "学生姓名",
            dataIndex: "xm",
            field: {
                xtype: "textfield"
            }
        }, {
            width:60,
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