Ext.define("core.system.permission.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.system.permisson.mainlayout",
    /** 引入必须的文件 */
    requires: [
        'core.system.permission.controller.MainController'
    ],
    /** 关联此视图控制器 */
    controller: 'system.permission.maincontroller',

    /** 页面代码定义 */
    funCode: "permission_main",
    detCode: "permission_detail",
    detLayout: "system.permission.detaillayout",

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController: 'system.permission.othercontroller',

    
    funData: {
        action: comm.get("baseUrl") + "/SysMenuPermission", //请求Action    
        pkName: "uuid",   
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'perName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加权限',
            editTitle:'编辑权限',
            detailTitle:'权限详情'
        }
    },
    
    layout: 'border',
    border: false,
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',

    items: [{
            xtype: "system.permission.menutree",
            //title:'班级列表',
            region: "west",
            width: 300,
            //height:300,
            split: true,
            collapsible:true,    
            // style: {
            //     border: '1px solid #ddd'
            // },
            frame: false
        }, {
            xtype: "system.permission.maingrid",
            region: "center",
            flex: 1,
            // style: {
            //     border: '1px solid #ddd'
            // }
        }]
});
