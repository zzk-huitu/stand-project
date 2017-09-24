Ext.define("core.system.role.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.system.role.mainlayout',

    requires: [    
        'core.system.role.controller.MainController',
        "core.system.role.view.MainGrid",
        'core.system.role.view.RoleUserGrid', 
        "core.system.role.view.DetailLayout",
        'core.system.role.view.DetailForm',
    ],
   
    controller:'system.role.maincontroller',
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'system.role.othercontroller',


    funCode: "role_main",
    detCode: 'role_detail',
    detLayout: 'system.role.detaillayout',
    funData: {
        action: comm.get('baseUrl') + "/SysRole", //请求Action
        pkName: "uuid",
        defaultObj: {
            orderIndex: 1,
            issystem: 1
        },
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'roleName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        	addTitle:'添加角色',
        	editTitle:'编辑角色',
        	detailTitle:'角色用户'
        }
    },
    layout:'fit',
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    
    items: [{        
        xtype: "system.role.maingrid"
        /*style:{
            border: '1px solid #ddd'
        },*/
    }]
})