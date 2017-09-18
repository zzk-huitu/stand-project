Ext.define("core.system.dept.view.DetailLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.dept.detaillayout',
    funCode: "deptinfo_detail",
    funData: {
        action: comm.get('baseUrl') + "/SysOrg", //请求controller路径
        pkName: "uuid", //主键id    
        defaultObj: {
            orderIndex: 1
        }
    },
    
     /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "system.dept.detailform"
    }]
})