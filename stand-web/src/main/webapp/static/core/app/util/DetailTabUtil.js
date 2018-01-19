Ext.define("core.util.DetailTabUtil", {
	mixins: {
		formUtil: "core.util.FormUtil",
        messageUtil:"core.util.MessageUtil",
	},

	//获取组件信息
	getModuleInfo: function(grid) {		
		var baseGrid=grid;
		var funCode = baseGrid.funCode;                 //主界面的funCode
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");
        
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
        
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';             		     

       	var datas={
       		funCode:funCode,
       		basePanel:basePanel,
       		tabPanel:tabPanel,
       		funData:funData,
       		detCode:detCode,
       		detLayout:detLayout,
       		otherController:otherController
       	}
		return datas;     
	},

	getTabInfo:function(funCode,pkName,tabConfig,baseGrid,btn,cmd,record){
        //根据cmd操作类型，来设置不同的值
        var tabTitle = ""; 
        var tabItemId ="";
        var pkValue= null;
        var operType="";
        var recordData=null;
        var itemXtype=null;     //2018/1/3新加入，指定打开的界面别名
        switch (cmd) {
            case "add":
                tabTitle = tabConfig.addTitle; 
                tabItemId = funCode + "_gridAdd";    //命名规则：funCode+'_ref名称',确保不重复
                pkValue= null;
                operType="add";

                itemXtype=tabConfig.addXtype;
                break;
            case "edit":
                if (btn) {	//点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        this.msgbox("请选择一条数据！");
                        return null;
                    }
                    recordData = rescords[0].getData();
                }else{	//点击操作列的方式
                	recordData=record.getData();
                }          

                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-"+tabConfig.editTitle;
                else
                    tabTitle = tabConfig.editTitle;

                //获取主键值
                pkValue= recordData[pkName];
                tabItemId=funCode+"_gridEdit"; 
                operType="edit";

                itemXtype=tabConfig.editXtype;
                break;
            case "detail":

                if (btn) {//点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        this.msgbox("请选择一条数据！");
                        return null;
                    }
                    recordData = rescords[0].getData();
                }else{	//点击操作列的方式
                	recordData=record.getData();
                }
                
                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-"+tabConfig.detailTitle;
                else
                    tabTitle = tabConfig.detailTitle;

                //获取主键值
                pkValue= recordData[pkName];
                tabItemId=funCode+"_gridDetail"+pkValue;    //详情页面可以打开多个，ID不重复
                operType="detail";

                itemXtype=tabConfig.detailXtype;
                break;
        }

        //返回数据
        return {
        	tabTitle : tabTitle,
	        tabItemId : tabItemId,
	        pkValue : pkValue,
	        operType : operType,
	        recordData : recordData,
            itemXtype:itemXtype
        };
	},

	createTabItem:function(tabInfo){
		var tabItem = Ext.create({
	        xtype:'container',
	        title: tabInfo.tabTitle,
	        //iconCls: 'x-fa fa-clipboard',
	        scrollable :true, 
	        itemId:tabInfo.tabItemId,
	        itemPKV:tabInfo.pkValue,      //保存主键值
	        layout:'fit', 
	    });

	    return tabItem;
	},

	createBaseFormTab:function(baseGrid,moduleInfo,tabInfo){	

		var funData=moduleInfo.funData;         
        var insertObj = new Object();
        Ext.apply(insertObj,funData.defaultObj);    //将默认值放入到一个新对象里，避免对象源数据受到影响。

        var finalObj = funData.finalObj;    //zzk新加入，用于在编辑时，率先处理一次表格record数据，并以此数据为主数据。

        var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
            grid: baseGrid
        });
        if(tabInfo.recordData!=null){
            //insertObj=tabInfo.recordData;

            /*zzk：加入最终不变值(若finalObj中有数据，则无论表格中的值是什么，都以finalObj中为准)*/
            Ext.apply(insertObj,funData.finalObj,tabInfo.recordData);
        	
        }
        


        var currentXtype=[{
            xtype:moduleInfo.detLayout
        }];

        //如果指定了子视图界面，就替换掉默认的视图
        if(tabInfo.itemXtype){
            currentXtype=[{
                xtype:moduleInfo.detLayout,
                items: [{
                    xtype: tabInfo.itemXtype
                }]
            }];
        }

		var item=Ext.widget("baseformtab",{
            operType:tabInfo.operType,                            
            controller:moduleInfo.otherController,         //指定重写事件的控制器
            funCode:moduleInfo.funCode,                    //指定mainLayout的funcode
            detCode:moduleInfo.detCode,                    //指定detailLayout的funcode
            tabItemId:tabInfo.tabItemId,                //指定tab页的itemId
            insertObj:insertObj,                	//保存一些需要默认值，提供给提交事件中使用
            funData:popFunData,                		//保存funData数据，提供给提交事件中使用
            items:currentXtype
        }); 
        return item;
	},

	doInitFormValue:function(item,cmd){
		var objDetForm = item.down("baseform[funCode=" + item.detCode + "]");
        if(objDetForm){
            var formDeptObj = objDetForm.getForm();              
            this.setFormValue(formDeptObj, item.insertObj);
                           
            if(cmd=="detail"){
                formDeptObj.setItemsReadOnly(true);
            }
        }    
	}	     

});