Ext.define("core.baseset.room.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.room.mainlayout',
    requires: [
    	"core.baseset.room.controller.MainController",
        "core.baseset.room.view.AreaGrid", 
        "core.baseset.room.view.AreaDetailLayout",
        "core.baseset.room.view.AreaForm",
        "core.baseset.room.view.DetailLayout", 
        "core.baseset.room.view.MainGrid", 
        "core.baseset.room.view.DetailForm", 
        "core.baseset.room.view.BatchRoomForm"
    ],
    
    controller: 'baseset.room.maincontroller',
    otherController:'baseset.room.othercontroller',
    
    funCode: "room_main",
    detCode: 'room_areadetail',
    detLayout: 'baseset.room.detaillayout',
    det1Layout: 'baseset.room.batchroomdetaillayout',
    border: false,
    funData: {
        action: comm.get('baseUrl') + "/BaseRoominfo", //请求Action
        whereSql: "", //表格查询条件
        orderSql: "", //表格排序条件
        filter:"",
        pkName: "uuid",
        defaultObj: {
            orderIndex: 1,
            roomNet:"0"
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roomName',
        	addTitle:'添加房间',
        	editTitle:'编辑房间',
        	detailTitle:'房间详情',
        	batchaddTitle:'批量添加房间',
        }
    },    
    layout: 'border',
    
    /*设置最小宽度，并且自动滚动*/
    minWidth:1200,
    scrollable:'x',
    
    items: [{
        collapsible: true,
        split: true,
        xtype: "baseset.room.areagrid",
        region: "west",
        // style:{
        //     border: '1px solid #ddd'
        // },
        width: 450
    }, {
        xtype: "baseset.room.maingrid",
        // style:{
        //     border: '1px solid #ddd'
        // },
        region: "center"
    }]
})