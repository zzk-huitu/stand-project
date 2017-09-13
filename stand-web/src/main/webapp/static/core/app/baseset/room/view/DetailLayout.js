Ext.define("core.baseset.room.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.room.detaillayout',
    funCode: "room_roomdetail",
    funData: {
        action: comm.get('baseUrl') + "/BaseRoominfo", //请求Action
        whereSql: "", //表格查询条件
        whereSql: "", //表格查询条件
        orderSql: "", //表格排序条件
        pkName: "uuid",
        defaultObj: {
            orderIndex: 1,
            roomType:'3'
            
        }
    },
    
    /*设置最小宽度，并且自动滚动*/
    minWidth:1200,
    scrollable:true,
    
    layout: 'fit',
    bodyPadding: 2,
    items: [{
        xtype: "baseset.room.detailform"
    }]
})