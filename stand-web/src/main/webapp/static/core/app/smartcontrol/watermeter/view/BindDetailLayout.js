

Ext.define("core.smartcontrol.watermeter.view.BindDetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.smartcontrol.watermeter.binddetaillayout',
    funCode: "watermeter_binddetail",
    funData: {
        action: comm.get('baseUrl') + "/BasePtRoomBagRule", //请求Action  
        pkName: "uuid",
        defaultObj: {
        }
    },
    
    /*关联此视图控制器*/
    controller: 'smartcontrol.watermeter.detailcontroller',

     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [{
        xtype: "smartcontrol.watermeter.roominfotree",
        width: 250,
        //split:true,
        style:{
            borderRight:'6px solid #ececec'
        },
    }, {
        xtype: "smartcontrol.watermeter.devicegrid",
        flex:1,
        minWidth:350,
        //split:true,
        style:{
            borderRight:'6px solid #ececec'
        },
    }, {
        xtype: "smartcontrol.watermeter.deviceselsectgrid",
        width:360,
        //split:true,
        style:{
            borderRight:'6px solid #ececec'
        },
    }]

})