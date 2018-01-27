Ext.define("core.basedevice.smartdevice.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: 'widget.basedevice.smartdevice.mainlayout',
    
    requires: [   
    	"core.basedevice.smartdevice.controller.MainController",       
    ],
    /** 关联此视图控制器 */
    controller: 'basedevice.smartdevice.maincontroller',
    /** 页面代码定义 */
    funCode: "smartdevice_main",
    detCode: "smartdevice_detail",
    detLayout: "basedevice.smartdevice.detaillayout",
    /*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'basedevice.smartdevice.othercontroller',

    layout:'fit',
    border:false,
    funData: {
        action: comm.get('baseUrl') + "/BasePtTerm", //请求Action 
        pkName: "uuid",
        defaultObj: {},
        tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
            titleField:'termName',   //指定这个模块，主表格界面的名称的字段名，用于显示在tab标签页上面
        	addTitle:'添加参数',
        	editTitle:'编辑参数',
        	detailTitle:'参数详情'
        }
    },
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',
    layout:'border',
    
    items: [{
        split: true,
        xtype: "basedevice.smartdevice.roominfotree",
        region: "west",
        width: 250
    }, {
        xtype: "basedevice.smartdevice.maingrid",
        region: "center"
    }]
})