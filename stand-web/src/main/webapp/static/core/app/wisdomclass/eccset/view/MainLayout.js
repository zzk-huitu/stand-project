Ext.define("core.wisdomclass.eccset.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.wisdomclass.eccset.mainlayout",
    funCode: "eccset_main",
    detCode: "eccset_detail",
    detLayout: "wisdomclass.eccset.detaillayout",
    /** 关联此视图控制器 */
    controller: 'wisdomclass.eccset.maincontroller',
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.eccset.othercontroller',
    funData: {
        action: comm.get("baseUrl") + "/ClassCheckrule", //请求Action
        pkName: "uuid",
        defaultObj: {
            inBefore: 30,
            beLate: 5,
            absenteeism: 10
        },
        tabConfig:{         
            titleField:'ruleName',  
            addTitle:'添加班牌',
            editTitle:'编辑班牌',
            detailTitle:'班牌详情'
        }
    },
    minWidth:1000,
    scrollable:true,
    items: [{
        xtype: "wisdomclass.eccset.maingrid",
    }]
})