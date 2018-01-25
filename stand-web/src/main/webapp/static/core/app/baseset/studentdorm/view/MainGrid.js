Ext.define("core.baseset.studentdorm.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/list",
    model: "com.zd.school.build.allot.model.DormStudentDorm",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'claiId'}]"
    },
    al:false,
    menuCode:"BASESTUDENTDORM", //new：此表格与权限相关的菜单编码
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '一键分配宿舍',
            ref: 'onKeyallotDorm',
            iconCls: 'x-fa fa-plus-circle'
        }, {
            xtype: 'button',
            text: '宿舍分配',
            ref: 'dormAlllot',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '虚拟宿舍调整(换宿舍)',
            ref: 'dormAdjust',
            iconCls: 'x-fa fa-plus-circle',
        },{
            xtype: 'button',
            text: '推送消息',
            ref: 'dormTs',
            iconCls: 'x-fa fa-paper-plane',
        }, {
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o',
        }]
    },
    defSort: [{
        property: 'userNumb',
        direction: 'ASC'
    }],
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            flex: 1,
            minWidth:100,
            text: "班级名称",
            dataIndex: "claiName",
            field: {
                xtype: "textfield"
            }
        }, {
            flex: 1,
            minWidth:100,
            text: "学生名称",
            dataIndex: "xm",
            field: {
                xtype: "textfield"
            }
        }, {
            flex: 1,
            minWidth:100,
            text: "学号",
            dataIndex: "userNumb",
            field: {
                xtype: "textfield"
            }
        }, {
            text: "性别",
            dataIndex: "xbm",
            columnType: "basecombobox",
            ddCode: "XBM",
            width:80,
            align:'left'
        },{
            width:100,
            text: "宿舍名称",
            dataIndex: "roomName",
            field: {
                xtype: "textfield"
            }
        }, {
            width:75,
            text: "床号",
            dataIndex: "bedNum",
            field: {
                xtype: "textfield"
            }
        }, {
            width:75,
            text: "柜号",
            dataIndex: "arkNum",
            field: {
                xtype: "textfield"
            }
        }, {
            width:150,
            text: "入住时间",
            dataIndex: "inTime",
            field: {
                xtype: "textfield"
            }
        }
        ]

    }
});