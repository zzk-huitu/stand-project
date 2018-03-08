
Ext.define("core.public.selectStudent.view.SelectStudentLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubselect.selectstulayout',
    controller: 'pubselect.selectstucontroller',
    /** 页面代码定义 */
    funCode: "selectuser_main",
    layout:'border',
    border:false,
    funData: {
        action: comm.get("baseUrl") + "/SysUser", //请求Action
        pkName: "uuid"
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype:'pubselect.selectstugrid',
        //width:600,
        flex:1,
        region: "center",
        margin:'5'
    }, {
        xtype: "pubselect.isselectstugrid",
        region: "east",
        width:260,
        margin:'5'
    }]
})