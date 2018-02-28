Ext.define("core.basedevice.baserate.view.DkMainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.baserate.dkmainlayout',
    minWidth:1000,
    scrollable:'x',
    layout:'border',
    funCode:"rateBinding_layout",
    items: [{
        region: "west",
        xtype: "basedevice.baserate.roominfotree",
        width: 250,
        margin:'5',
    }, {
        region: "center",
        xtype: "basedevice.baserate.skdatagrid",
        margin:'5',
    }, {
        region: "east",
        xtype: "basedevice.baserate.skdatagridtwo",
        width: 280,
        margin:'5' ,
    }]
})