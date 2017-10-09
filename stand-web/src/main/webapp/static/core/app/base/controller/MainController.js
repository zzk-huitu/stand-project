/**
 * 程序主控制器
 */
Ext.define("core.base.controller.MainController",{
	extend:"Ext.app.Controller",
	mixins: {
		btnCtr:"core.base.controller.ButtonController",
		formCtr:"core.base.controller.FormController",
		gridCtr:"core.base.controller.GridController",
		panelCtr:"core.base.controller.PanelController",
		queryCtr:"core.base.controller.QueryController",
		gridActionUtil:"core.util.GridActionUtil",
		suppleUtil:"core.util.SuppleUtil",
		messageUtil:"core.util.MessageUtil",
		formUtil:"core.util.FormUtil",
		sqlUtil:"core.util.SqlUtil",
		queryUtil:"core.util.QueryUtil",
		detailTabUtil:"core.util.DetailTabUtil"
	},
	ctr:{},
	init:function(){
		//console.log("初始化基础控制器");
		var self=this;
		coreApp=self;
		self.initBtn();
		self.initForm();
		self.initGrid();
		self.initPanel();
		self.initQuery();
	
		//注册事件
		this.control(self.ctr);
	},
	

	requires:[
		"core.base.view.CenterView",
		"core.base.view.WestView",
		"core.base.view.MainView",
		"core.base.view.BaseGrid",
		"core.base.view.BaseForm",
		"core.base.view.BaseQueryForm",
		"core.base.view.BasePanel",
		"core.base.view.BaseQueryPanel",
		"core.base.view.BaseCenterPanel",
		"core.base.view.BaseExportExcel",
		"core.base.view.BaseImportExcel"
	]
});