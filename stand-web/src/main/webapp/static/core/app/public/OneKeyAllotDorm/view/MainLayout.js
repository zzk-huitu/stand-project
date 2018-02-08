Ext.define("core.public.OneKeyAllotDorm.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubonkeyallotdorm.mainlayout',
    controller: 'pubselect.dormdefinecontroller',
    funCode: "pubonkeyallotdorm_main",
    funData: {
        action: comm.get("baseUrl") + "/BaseStudentDorm", //请求Action
        pkName: "uuid"
    },
    minWidth:1200,
    scrollable:'x',
    layout: 'border',
    items: [{
        xtype: "pubonkeyallotdorm.boydormdefinetree",
        region: "west",
        margin:'5',
        width: 220,
        hidden:true
    },{
        xtype: "pubonkeyallotdorm.girldormdefinetree",
        region: "west",
        margin:'5',
        width: 220,
        hidden:true
    },{
        xtype: "pubonkeyallotdorm.studormareatree",
        region: "west",
        margin:'5',
        width: 220,
        hidden:true
    },{
        xtype: "pubonkeyallotdorm.selectdormgrid",
        region: "center",
        margin:'5',
    }, {
        xtype: "pubonkeyallotdorm.isselectdormgrid",
        region: "east",
        margin:'5',
        width: 450
    }]
})