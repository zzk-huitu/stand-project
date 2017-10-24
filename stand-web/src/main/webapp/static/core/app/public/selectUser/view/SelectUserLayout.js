
Ext.define("core.public.selectUser.view.SelectUserLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubselect.selectuserlayout',
    controller: 'pubselect.selectusercontroller',
    /** 页面代码定义 */
    funCode: "selectuser_main",
    layout:'border',
    border:false,
    funData: {
        action: comm.get("baseUrl") + "/BaseTeacherDrom", //请求Action
        pkName: "uuid"
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype:'pubselect.selectusergrid',
        //width:600,
        flex:1,
        region: "center",
        margin:'5'
    }, {
        xtype: "pubselect.isselectusergrid",
        region: "east",
        width:480,
        margin:'5'
    }]
})