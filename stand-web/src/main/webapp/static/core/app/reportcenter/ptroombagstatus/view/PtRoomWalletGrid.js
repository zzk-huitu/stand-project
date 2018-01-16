Ext.define("core.reportcenter.ptroombagstatus.view.PtRoomWalletGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.ptroomwalletgrid",
    dataUrl: comm.get('baseUrl') + "/PtBag/roombaglist",
    model: "com.zd.school.control.device.model.PtRoomBags",
    animCollapse: true,
    collapsible: true,
    noPagging: true, 
    al:true,
   // title: "房间钱包",
   panelTopBar:{
    xtype:'toolbar',
    items: [{
        xtype: 'tbtext',
        html: '房间钱包',
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:800,
            lineHeight:'30px',
        }
    }]
},
    panelButtomBar:{},
    defSort:[],
    columns:{        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
         text : "主键",
         dataIndex: "uuid",
         hidden: true
     },{
        text : "房间ID",
        dataIndex: "roomId",
        flex:1,
        minWidth:120
    },{
        text : "房间余额",
        dataIndex: "roomValue",
        width:150
    },{
        text : "房间总用",
        dataIndex: "roomTotalUsed",
        width:150
    },{
        text : "房间总充",
        dataIndex: "roomTotalRecharge",
        width:150
    },{
        text : "水总用",
        dataIndex: "waterTotalused",
        width:150
    },{
        text : "水改变时间",
        dataIndex: "waterUpdateTime",
        width:150
    },{
        text : "电总用",
        dataIndex: "ecTotalUsed",
        width:150
    },{
        text : "电改变时间",
        dataIndex: "ecUpdateTime",
        width:150
    }]
    },

});