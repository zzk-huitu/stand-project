Ext.define("core.baseset.dictionary.view.CenterLayout", {
    extend: "Ext.panel.Panel",
    alias: 'widget.baseset.dictionary.centerlayout',
    layout: "border",
    border:false,
    items: [{
        xtype: "baseset.dictionary.itemgrid",
        region: "center"
    }]
})