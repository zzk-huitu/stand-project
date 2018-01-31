Ext.define("core.smartcontrol.roombagrule.view.DormAllotFinishGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.roombagrule.dormallotfinishgrid",
    //title: "平均扣费人员列表",
    dataUrl: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/userList",
    model: "com.zd.school.build.allot.model.DormStudentDorm",
    extParams: {
        whereSql: "  and isDelete='0'",
    },
    selModel:null,
    noPagging: true,
    tbar: null,
    al: false,
    remoteSort:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '平均扣费人员列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px'
            }
        }],
    }, 

    columns: [{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    }, {
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "学生学号",
        dataIndex: "userNumb",
        flex:1,
        minWidth:80,
    }, {
        text: "学生姓名",
        dataIndex: "xm",
        flex:1,
        minWidth:80,
    },{
        text: "房间名称",
        dataIndex: "roomName",
        flex:1,
        minWidth:80,
        renderer: function(value, metaData) {
            var title = "房间名称";
            metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';
            return value;
        }
    }]
})