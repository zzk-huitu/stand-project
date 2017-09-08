Ext.define("core.system.dept.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    
    alias: 'widget.system.dept.mainlayout',

    requires: [    
        "core.system.dept.controller.MainController",
        "core.system.dept.view.DeptLayout",
        "core.system.dept.view.DeptGrid",
        "core.system.dept.view.DeptForm",
        "core.system.dept.store.DeptStore",
        "core.system.dept.store.CourseStore"
    ],
    
    controller: 'system.dept.maincontroller',
    otherController:'system.dept.othercontroller',
    
    funCode: "deptinfo_main",
    detCode: "deptinfo_detail",
    detLayout: "system.dept.detaillayout",
    funData: {
        action: comm.get('baseUrl') + "/BaseOrg", //请求controller路径       
        pkName: "uuid", //主键id    
        defaultObj: {
            orderIndex: 1
        },
		tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'text',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
		    addTitle:'添加下级',
		    editTitle:'编辑',
		    AddBrotherTitle:'添加同级'
		}
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,

    items: [{
        xtype: "system.dept.deptgrid",
        
    }]
})