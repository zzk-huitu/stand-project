Ext.define("core.public.selectuser.view.FilterPanel", {
	extend: "Ext.tab.Panel",
	alias: 'widget.public.selectuser.filterpanel',
	collapsible: true,
	activeTab: 0,
	enableTabScroll: true, //选项卡过多时，允许滚动
	closable : false,
	defaults: {
		autoScroll: true
	},
	items:[{
		xtype: 'tbtext',
		html: '人员过滤',
		style: {
			fontSize: '16px',
			color: '#C44444',
			fontWeight:800
		}
	},
	{
		items: [{
			title: '部  门',
			xtype: "public.selectuser.depttree"
		},{
			title:'学  科',
			xtype:"public.selectuser.courseGrid"
		},{
			title:'年级组',
			xtype:'public.selectuser.classtree'
		},{
			title:'角 色',
			xtype:'public.selectuser.roleGrid'
		},{
			title:'学 生',
			xtype:'public.selectuser.classStuTree'
		}]

	} ]

	
});