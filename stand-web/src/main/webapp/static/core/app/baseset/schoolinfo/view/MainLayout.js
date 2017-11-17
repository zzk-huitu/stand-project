

Ext.define("core.baseset.schoolinfo.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.baseset.schoolinfo.mainlayout',
    
    requires: [   
        "core.baseset.schoolinfo.controller.MainController"
    ],
    
    /** 关联此视图控制器 */
    controller: 'baseset.schoolinfo.maincontroller',
    /** 页面代码定义 */
    funCode: "schoolinfo_main",
    detCode: 'school_detail',
    detLayout: 'baseset.school.detaillayout',   
    

    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'baseset.schoolinfo.othercontroller',
 
    funData: {
        action: comm.get('baseUrl') + "/BaseSchool", //请求Action 
        pkName: "uuid",
        defaultObj: {
         },
       tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'schoolName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
            addTitle:'添加学校',
            editTitle:'编辑学校',
            detailTitle:'学校详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "baseset.schoolinfo.maingrid"
    }]
})