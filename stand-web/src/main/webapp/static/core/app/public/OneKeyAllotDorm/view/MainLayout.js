Ext.define("core.public.OneKeyAllotDorm.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubonkeyallotdorm.mainlayout',
    controller: 'pubselect.dormdefinecontroller',
    funCode: "pubonkeyallotdorm_main",
    funData: {
        action: comm.get("baseUrl") + "/BaseRoomdefine", //请求Action
        pkName: "uuid"
    },
    minWidth:1200,
    scrollable:'x',
    layout: 'border',
    items: [{
        xtype: "pubonkeyallotdorm.dormdefintree",
        region: "west",
        margin:'5',
        width: 150
    }, {
        xtype: "pubonkeyallotdorm.selectdormgrid",
        region: "center",
        margin:'5',
    }, {
        xtype: "pubonkeyallotdorm.isselectdormgrid",
        region: "east",
        margin:'5',
        width: 570
    }]
})