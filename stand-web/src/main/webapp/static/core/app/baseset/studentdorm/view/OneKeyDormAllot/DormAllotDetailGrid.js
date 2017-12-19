Ext.define("core.baseset.studentdorm.view.DormAllotDetailGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.dormallotdetailgrid",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/onKeyList",
    model: "com.zd.school.build.allot.model.DormStudentDorm",
    extParams: {
        whereSql:''
    },
    selModel:null,
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '当前数据信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }]
    },
    columns:{
        defaults:{
            titleAlign:"center",
            align:"center"
        },
        items: [{
                width:100,
                text: "男生数量",
                dataIndex: "nanCount",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "女生数量",
                dataIndex: "nvCount",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "<font color=red>合计总人数</font>",
                dataIndex: "stuCount",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "男生所需床位",
                dataIndex: "nanDormBed",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "女生所需床位",
                dataIndex: "nvDormBed",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "<font color=red>合计所需床位</font>",
                dataIndex: "sxDormBed",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "男生有效宿舍",
                dataIndex: "nanDorm",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "女生有效宿舍",
                dataIndex: "nvDorm",
                field: {
                    xtype: "textfield"
                }
            }, {
                width:100,
                text: "混班有效宿舍",
                dataIndex: "hunDorm",
                field: {
                    xtype: "textfield"
                }
            }, {
                flex:1,
                minWidth:100,
                text: "<font color=red>合计有效宿舍</font>",
                dataIndex: "yxDorm",
                field: {
                    xtype: "textfield"
                }
            }
        ]

    }
});