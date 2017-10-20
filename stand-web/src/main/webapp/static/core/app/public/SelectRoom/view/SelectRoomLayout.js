
Ext.define("core.public.SelectRoom.view.SelectRoomLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubselect.selectroomlayout',
    controller: 'pubselect.selectroomcontroller',
    /** 页面代码定义 */
    funCode: "selectroom_main",
    layout:'border',
    border:false,
    funData: {
        action: comm.get("baseUrl") + "/BuildRoominfo", //请求Action
        pkName: "uuid"
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1200,
    scrollable:true,
    items: [{
        xtype:'pubselect.selectroomgrid',
        //width:600,
        flex:1,
        region: "center",
        margin:'5'
    }, {
        xtype: "pubselect.isselectroomgrid",
        region: "east",
        width:480,
        margin:'5'
    }]
})