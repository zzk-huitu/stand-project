Ext.define("core.system.menu.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.menu.detaillayout',
    funCode: "menu_detail",
    funData: {
        action: comm.get('baseUrl') + "/SysMenu", //请求controller路径
        pkName: "uuid", //主键id    
        defaultObj: {
            orderIndex: 1
        }
    },
    
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    
    items: [{
        xtype: "system.menu.menuform"
    }]
})