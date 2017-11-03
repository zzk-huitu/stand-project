Ext.define("core.basedevice.basedeviceallot.view.DeviceAllotLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.basedeviceallot.deviceallotlayout',
    layout:'border',
    border: false,
    
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
    	split: true,//对模块分开的线条
        xtype: "basedevice.basedeviceallot.roominfotree2",
        width: comm.get("clientWidth") * 0.15,
        region: "west",
    }, {
    	 flex:1,
    	split: true,
        xtype: "basedevice.basedeviceallot.deviceallotgrid",
        region: "center",
    }, {
    	split: true,
    	width: comm.get("clientWidth") * 0.31,
    	xtype: "basedevice.basedeviceallot.devicesysgrid",
        region: "east",
    }]
})