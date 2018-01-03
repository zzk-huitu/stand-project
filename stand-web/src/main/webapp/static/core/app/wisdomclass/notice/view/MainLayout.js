Ext.define("core.wisdomclass.notice.view.MainLayout", {
	extend: "core.base.view.BasePanel",
	alias: 'widget.wisdomclass.notice.mainlayout',

	requires: [
		"core.wisdomclass.notice.controller.MainController",       
    ],
    controller:'wisdomclass.notice.maincontroller',
    
	funCode: "notice_main", //主窗体标识
	detCode: 'notice_detail', //详细窗口标识
	detLayout: 'wisdomclass.notice.detaillayout', //详细窗口别名
	border: false,

	/*标注这个视图控制器的别名，以此提供给window处使用*/
    otherController:'wisdomclass.notice.othercontroller',
    
	//funData用来定义一些常规的参数
	funData: {
		action: comm.get('baseUrl') + "/OaNotice", //请求controller
		pkName: "uuid", //主键
		//默认的初始值设置
		defaultObj: {
            isCheck:"0",
            noticeType:"01",
            emergency:"01",
            sendWx:"1",         

            beginDate:new Date(),
            endDate:Ext.Date.add(new Date(), Ext.Date.DAY, 7)      
		},
		tabConfig: {         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
			titleField:'noticeTitle',
            addTitle: '添加通知公告',
            editTitle: '编辑通知公告',
            detailTitle: '通知公告详情'
        }
	},
	layout: 'border',

	/*设置最小宽度，并且自动滚动*/
    minWidth: 1200,
    scrollable: 'x',



	items: [{
		xtype: "wisdomclass.notice.maintree",
		region: "west",
		width:200,
		split : true,
        collapsible:true,          
	}, 
	{
		xtype: "wisdomclass.notice.maingrid",
		region: "center",		
		title:null,		
	}]
})