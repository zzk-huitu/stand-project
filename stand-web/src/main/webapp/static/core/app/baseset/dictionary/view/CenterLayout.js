Ext.define("core.systemset.dictionary.view.CenterLayout", {
    extend: "Ext.panel.Panel",
    alias: 'widget.systemset.dictionary.centerlayout',
    layout: "border",
    border:false,
    items: [{
        xtype: "systemset.dictionary.itemgrid",
        region: "center"
    }]
})