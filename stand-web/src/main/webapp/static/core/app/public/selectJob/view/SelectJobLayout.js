
Ext.define("core.public.selectJob.view.SelectJobLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.pubselect.selectjoblayout',
    controller: 'pubselect.selectjobcontroller',
    /** 页面代码定义 */
    funCode: "selectjob_main",
    layout:'border',
    border:false,
    funData: {
        action: comm.get("baseUrl") + "/SysJob", //请求Action
        pkName: "uuid"
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype:'pubselect.selectjobgrid',
        //width:600,
        flex:1,
        region: "center",
        margin:'5'
    }, {
        xtype: "pubselect.isselectjobgrid",
        region: "east",
        width:500,
        margin:'5'
    }]
})