Ext.define("core.basedevice.baserate.view.DkMainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.baserate.dkmainlayout',
    layout: {
        type: 'hbox',
    },
    items: [{
        xtype: "basedevice.baserate.roominfotree",
        width: 300,
        height: 470
    }, {
        xtype: "basedevice.baserate.skdatagrid",
        flex: 2,
        height: 470
    }, {
        xtype: "basedevice.baserate.skdatagridtwo",
        flex: 2,
        height: 470
    }]
})