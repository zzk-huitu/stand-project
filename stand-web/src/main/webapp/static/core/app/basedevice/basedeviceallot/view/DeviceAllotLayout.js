Ext.define("core.basedevice.basedeviceallot.view.DeviceAllotLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basedeviceallot.deviceallotlayout',
    layout: {
        type: 'border',
//        pack: 'start',
//        align: 'stretch'
    },
    funData: {
        action: comm.get('baseUrl') + "/BasePtTerm", //请求Action
        pkName: "uuid",
        modelName: "com.zd.school.control.device.model.PtTerm", //实体全路径
        defaultObj: {
            roomId:"",
            leaf:true
        },
    },
    
    items: [{
        xtype: "basedevice.basedeviceallot.roominfotree2",
        width: 300,
        region: "west",
    }, {
        width: 550,
        xtype: "basedevice.basedeviceallot.deviceallotgrid",
        region: "center",
    }, {
        flex: 1,
        xtype: "basedevice.basedeviceallot.devicesysgrid",
        region: "east",
    }]
})