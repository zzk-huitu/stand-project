
Ext.define("core.system.dept.view.SelectUserLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.dept.selectuserlayout',
    funCode: "selectuser_detail",
    border: false,
    //funData用来定义一些常规的参数
    funData: {
        action: comm.get('baseUrl') + "/sysuser", //请求controller
        whereSql: "", //表格查询条件
        orderSql: "", //表格排序条件
        filter: "", //表格过滤条件
        pkName: "uuid", //主键
        //默认的初始值设置
        defaultObj: {
        }
    },
    controller: 'system.dept.othercontroller',
    layout: 'border',
    items: [{
        xtype:'system.dept.selectusergrid',
        width:650,
        region: "west",
        margin:'5'
    }, {
        xtype: "system.dept.isselectusergrid",
        region: "center",
        margin:'5'
    }]
})