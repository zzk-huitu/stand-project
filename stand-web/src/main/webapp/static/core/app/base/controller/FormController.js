/**
 * 表单控制器
 */
Ext.define("core.base.controller.FormController",{
	extend:"Ext.app.Controller",
	requires:[
		"core.base.view.form.BaseComboBox",
		"core.base.view.form.BaseQueryField",
		"core.base.view.form.BaseTreeField"
	],
	initForm:function(){

		var self=this;
		var formCtr={
			"baseform":{
				/*此组件在渲染时，自动将父级basepanel的funCode值赋予进来*/
				render:function(form){
					var basePanel=form.up("basepanel");
					if(basePanel!=null){
						var funCode=basePanel.funCode;
						form.funCode=funCode;	
					}
							
					//史诗级bug，千万不要在这里设置itemId
					//form.itemId=funCode+"_baseform";	
				}
			},
			"basequeryform field":{
				/*高级查询面板，实现文本框回车时查询*/
				specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {                                                                  
	                    this.queryHignSearchForm(field);
                    }
                }
			},
			"basequeryform button[ref=gridSearchFormOk]":{
				click:function(btn){		
                    this.queryHignSearchForm(btn);                  
				}
			},
			"basequeryform button[ref=gridSearchFormReset]":{
				click:function(btn){
					this.resetHignSearchForm(btn);                    			
				}
			},

		}
		Ext.apply(self.ctr,formCtr);
	},

	queryHignSearchForm:function(component){
		var self=this;

		var queryPanel = component.up("basequeryform");
		var querySql = self.getQureyFilter(queryPanel);
		var funCode = queryPanel.funCode;
		var basePanel = queryPanel.up("basepanel[funCode=" + funCode + "]");

		//加入basegrid默认的filter
		var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
		var gridFilter=[];
		var filter=[];

		//获取baseGrid中编写的默认filter值
        var gridFilterStr=baseGrid.extParams.filter;
        if(gridFilterStr&&gridFilterStr.trim()!=""){
            gridFilter=JSON.parse(gridFilterStr); 
        }

		if (querySql.trim().length > 0) {
			filter=JSON.parse(querySql);  
		
			for(var i=0;i<gridFilter.length;i++){
            	//判断gridFilter是否包含此值。
            	var isExist=false;
            	for(var j=0;j<filter.length;j++){
            		if(filter[j].field==gridFilter[i].field){                   
                        isExist=true;
                        break;
                    }
            	}
            	if(isExist==false)
                	filter.push(gridFilter[i]);
         
            }
		}else{
			if(gridFilter.length>0){
				filter=gridFilter;
			}
		}                       
                                    
		var store = baseGrid.getStore();
		var proxy = store.getProxy();
		proxy.extraParams.filter = JSON.stringify(filter);
		store.loadPage(1);
	},

	resetHignSearchForm:function(component){
		var self=this;

		var queryPanel=component.up("basequeryform");
		self.resetQueryPanel(queryPanel);

		var funCode = queryPanel.funCode;
		var basePanel = queryPanel.up("basepanel[funCode=" + funCode + "]");
		var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
		var store = baseGrid.getStore();
		var proxy = store.getProxy();			
		
		var filterStr=[];
		//获取baseGrid中编写的默认filter值
        var gridFilterStr=baseGrid.extParams.filter;
		if(gridFilterStr&&gridFilterStr.trim().length>0){
			filterStr=gridFilterStr;
		}
	
		//extParams参数是来自baseGrid中设置的，不用去改变。		
		proxy.extraParams.filter = filterStr;
		store.load();
	}
	
});