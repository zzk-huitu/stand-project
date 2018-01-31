Ext.define("core.smartcontrol.roombagrule.view.DormAllotFinishGridTwo", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.roombagrule.dormallotfinishgridtwo",
     dataUrl: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/assignUserList",
    //title: "指定扣费人员列表",
    model: "com.zd.school.control.device.model.PtRoomBagsRuleBind",
    al: false,
    extParams: {
        whereSql: "  and isDelete='0'",
    },
    selModel:null,
    noPagging: true,
    remoteSort:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '指定扣费人员列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'32px'
            }
        },'->',{
            xtype: 'button',
            text: '指定扣费人员',
            ref:'gridAssign',
            iconCls: 'x-fa fa-hand-pointer-o',
            funCode:'girdFuntionBtn',
            //disabled:true
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
        text: "用户id",
        dataIndex: "userId",
        hidden: true
    },{
        text: "人员编号",
        dataIndex: "userNumb",
        flex:1,
        minWidth:80,
    }, {
        text: "姓名",
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