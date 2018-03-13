Ext.define("core.coursemanage.specialcourseattend.selectterm.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.coursemanage.specialcourseattend.selectterm.mainlayout",
    layout: "border",
    funCode: "roomterminal_main",
      /** 关联此视图控制器 */
    controller: 'coursemanage.specialcourseattend.selectterm.maincontroller',
    funData: {
        action: comm.get("baseUrl") + "/OaInfoterm", //请求Action
        pkName: "uuid",
        width: 500,
        height: 350,
        defaultObj: {
        },
    },
    minWidth:1000,
    scrollable:'x',
    items: [{
        xtype: "roomterminal.roomtree",
        region: "west",
        split: true,
        width:200
    }, {
        xtype: "roomterminal.selecttermgrid",
        region: "center",
        margin:'5 5 5 0',
    }, {
        xtype: "roomterminal.isselecttermgrid",
        region: "east",
        width: 400,
        margin:'5 0 5 0',
    }]
})