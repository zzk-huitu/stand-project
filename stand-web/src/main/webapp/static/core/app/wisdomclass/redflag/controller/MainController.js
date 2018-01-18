Ext.define("core.wisdomclass.redflag.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.redflag.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil',
        QueryUtil:"core.util.QueryUtil",
        SqlUtil:"core.util.SqlUtil",
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"basegrid[xtype=wisdomclass.redflag.flagtypegrid] button[ref=gridRefresh]": {
			click: function(btn) {
				var baseGrid = btn.up("basegrid");
				var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=wisdomclass.redflag.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=wisdomclass.redflag.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.redflagType="";
                return false;
                }
            },
		"basegrid[xtype=wisdomclass.redflag.flagtypegrid]": {
			beforeitemclick: function(grid, record, item, index, e, eOpts) {
                var self = this;
				var filter = "[{'type':'string','comparison':'=','value':'" + record.get("itemCode") + "','field':'starLevel'}]";
				var mainLayout = grid.up("panel[xtype=wisdomclass.redflag.mainlayout]");
				var baseGrid = mainLayout.down("basegrid[xtype=wisdomclass.redflag.maingrid]");
				var funData = mainLayout.funData;
                mainLayout.funData = Ext.apply(funData, {
                    redflagType: record.get("itemCode"),
                    redflagTypeName: record.get("itemName"),
                    filter: filter
                });
                    //获取右边筛选框中的条件数据
                filter=self.getFastSearchFilter(baseGrid);       
                if(filter.length==0)
                    filter=null;
                else
                    filter = JSON.stringify(filter);
                var store = baseGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams={
                    redflagType:record.get("itemCode"),
                    filter:filter
                };
                store.load(); 

                return false;
                }
            },
            "basegrid[xtype=wisdomclass.redflag.maingrid]": {
              afterrender : function(grid) {
                if(comm.get("isAdmin")!="1"){
                        var menuCode="REDFLAG";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");
                        if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
                            var btnAdd = grid.down("button[ref=gridAdd_Tab]");
                            btnAdd.setHidden(true);
                            
                        }
                        if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                            var btnEdit = grid.down("button[ref=gridEdit_Tab]");
                            btnEdit.setHidden(true);
                            
                        }
                        if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                            var btnDel = grid.down("button[ref=gridDelete]");
                            btnDel.setHidden(true);
                            
                        }
                    }
                },
                beforeitemclick: function(grid) {
                    var basePanel = grid.up("basepanel");
                    var basegrid = basePanel.down("basegrid[xtype=wisdomclass.redflag.maingrid]");
                    var records = basegrid.getSelectionModel().getSelection();
                  //  var btnAdd = basegrid.down("button[ref=gridAdd_Tab]");
                  var btnEdit = basegrid.down("button[ref=gridEdit_Tab]");
                  var btnDel = basegrid.down("button[ref=gridDelete]");
                  if (records.length == 0) {
                        //btnAdd.setDisabled(true);
                        btnEdit.setDisabled(true);
                        btnDel.setDisabled(true);
                    } else if (records.length == 1) {
                        //btnAdd.setDisabled(false);
                        btnEdit.setDisabled(false);
                        btnDel.setDisabled(false);
                    } else {
                        //btnAdd.setDisabled(true);
                        btnEdit.setDisabled(true);
                        btnDel.setDisabled(false);
                    }
                },
            },    
            "basegrid[xtype=wisdomclass.redflag.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {                
                    this.doDetail_tab(btn,"add");
                    return false;
                }
            },
            "basegrid[xtype=wisdomclass.redflag.maingrid] button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_tab(btn, "edit");
                    return false;
                }
            },

            "basegrid[xtype=wisdomclass.redflag.maingrid] actioncolumn": {
            	editClick_Tab: function (data) {
            		this.doDetail_tab(null,"edit",data.view,data.record);
            		return false;

            	},
                detailClick_Tab: function (data) {
                    this.doDetail_tab(null,"detail",data.view,data.record);
                    return false;

                },
            },
           "basequeryform[xtype=wisdomclass.redflag.mainquerypanel] field":{
                /*高级查询面板，实现文本框回车时查询*/
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {                                                                  
                        this.queryHignSearchForm(field);
                        return false;
                    }
                }
            },
            "basequeryform[xtype=wisdomclass.redflag.mainquerypanel] button[ref=gridSearchFormOk]":{
                beforeclick:function(btn){        
                    this.queryHignSearchForm(btn);   
                    return false;               
                }
            },
            "basequeryform[xtype=wisdomclass.redflag.mainquerypanel] button[ref=gridSearchFormReset]":{
                beforeclick:function(btn){
                    this.resetHignSearchForm(btn);  
                    return false;                             
                }
            },
    },
     doDetail_tab: function(btn,cmd,grid,record) {
        var self = this;
        //得到组件
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
        }

        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
        var flagtypegrid = basePanel.down("basegrid[xtype=wisdomclass.redflag.flagtypegrid]");
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var pkName=funData.pkName;
       
        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
         
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        //获取Tab相关数据,根据cmd的类型，来获取不同的数据
        var tabConfig=funData.tabConfig;
        var tabTitle = ""; 
        var tabItemId ="";
        var pkValue= null;
        var operType="";
        var recordData=null;
        var levelSelected =null;

        var insertObj =  Ext.apply(new Object(),funData.defaultObj);
        switch (cmd) {
            case "add":
                tabTitle = tabConfig.addTitle; 
                tabItemId = funCode + "_gridAdd";    //命名规则：funCode+'_ref名称',确保不重复
                pkValue = null;
                operType="add";
                flagSelected = flagtypegrid.getSelectionModel().getSelection();
                if(flagSelected.length!=1){
                    self.msgbox("请先选择红旗类型！");
                    return;
                 }

                 insertObj = Ext.apply(insertObj, {
                 	redflagType: flagSelected[0].get('itemCode')
                 });
                break;
            case "edit":
                if (btn) {  //点击按钮的方式
                    var records = baseGrid.getSelectionModel().getSelection();
                    if (records.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = records[0].getData();
                }else{  //点击操作列的方式
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
                detLayout = "wisdomclass.redflag.detailform";
            
                break;
            case "detail":

                if (btn) {//点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        this.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }else{  //点击操作列的方式
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

                detLayout = "wisdomclass.redflag.detailhtml";
                break;
        }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
                itemPKV:pkValue,      //保存主键值
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){

                //创建tab内部组件                     
             
                var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
                    grid: baseGrid
                });
                if(recordData!=null){
                    insertObj=recordData;
                }
                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                    //保存一些需要默认值，提供给提交事件中使用
                    funData:popFunData,  
                    redflagType:insertObj.redflagType,                   //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout
                    }]
                }); 
              
                tabItem.add(item);  
              if(cmd=="detail"){
                    insertObj = Ext.apply(insertObj, {
                        doDate: Ext.util.Format.date(insertObj["doDate"], 'Y-m-d'),
                        beginDate: Ext.util.Format.date(insertObj["beginDate"], 'Y-m-d'),
                        endDate: Ext.util.Format.date(insertObj["endDate"], 'Y-m-d')
                    });
                    var detailHtml = item.down("container[xtype=wisdomclass.redflag.detailhtml]");
                    detailHtml.setData(insertObj); 

                }else if(cmd=="edit"){
                   var objDetForm = item.down("baseform[xtype=wisdomclass.redflag.detailform]");
                   var formDeptObj = objDetForm.getForm();
                   self.setFormValue(formDeptObj, insertObj); 

               }else{
                   var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                   var formDeptObj = objDetForm.getForm();
                   self.setFormValue(formDeptObj, insertObj);  
               }

           },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);   
    },
    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "className", "comparison": ""})
        }
        return filter;
    },
    queryHignSearchForm:function(component){
        var self=this;
        var queryPanel = component.up("basequeryform");
        var querySql = self.getQuerySql(queryPanel);
        var funCode = queryPanel.funCode;
        var basePanel = queryPanel.up("basepanel[funCode=" + funCode + "]");

        //加入basegrid默认的filter
        var baseGrid = basePanel.down("basegrid[xtype=wisdomclass.redflag.maingrid]");
     
                  
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = [];
        proxy.extraParams.whereSql = querySql;
        store.loadPage(1);
    },
    resetHignSearchForm:function(component){
        var self=this;

        var queryPanel=component.up("basequeryform");
        self.resetQueryPanel(queryPanel);

        var funCode = queryPanel.funCode;
        var basePanel = queryPanel.up("basepanel[funCode=" + funCode + "]");
        var baseGrid = basePanel.down("basegrid[xtype=wisdomclass.redflag.maingrid]");
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
        proxy.extraParams.whereSql = "";
        store.load();
    }
});