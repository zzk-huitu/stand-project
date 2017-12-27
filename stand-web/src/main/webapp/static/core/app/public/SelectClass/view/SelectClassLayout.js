
Ext.define("core.public.SelectClass.view.SelectClassLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.public.SelectClass.selectclasslayout',
    controller: 'public.SelectClass.selectclasscontroller',
    
    /** 页面代码定义 */
    funCode: "selectclass_main",
    layout:'border',
    border:false,
    funData: {
        action: comm.get("baseUrl") + "/gradeClass", //请求Action
        pkName: "uuid"
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    items: [{
        xtype:'public.SelectClass.selectclassgrid',
        //width:600,
        flex:1,
        region: "center",
        margin:'5'
    }, {
        xtype: "public.SelectClass.isselectclassgrid",
        region: "east",
        width:600,
        margin:'5'
    }]
})