Ext.define("core.basedevice.baserate.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.baserate.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
    },
    control: {
    	
    	 "basegrid[xtype=basedevice.baserate.maingrid] button[ref=gridAdd_Tab]": {
             beforeclick: function(btn) {
            	 this.doBasePriceDefine_Tab(btn,"add");
                 return false;
             }
         },
         
         "basegrid[xtype=basedevice.baserate.maingrid] button[ref=gridEdit_Tab]": {
             beforeclick: function(btn) {
            	 this.doBasePriceDefine_Tab(btn,"edit");
                 return false;
             }
         },
         
         "basegrid[xtype=basedevice.baserate.maingrid] button[ref=gridDelete]": {
             beforeclick: function(btn) {
            	 this.doBasePriceDefine_Delete(btn,"null");
                 return false;
             }
         },
         
         "grid[xtype=basedevice.baserate.categroygrid] button[ref=gridRefresh]": {
             beforeclick: function(btn) {
            	 var baseGrid = btn.up("grid");
                 var store = baseGrid.getStore().load();
                 return false;
             }
         },
         
         /**
          * 费率列表操作列事件
          */
         "basegrid  actioncolumn": {
             //操作列编辑
             editClick_Tab: function (data) {
                 this.doBasePriceDefine_Tab(null, "edit", data.view, data.record);
                 return false;
             },
             //操作列删除
             deleteClick: function (data) {
            	 this.doBasePriceDefine_Delete(null, null, data.view, data.record);
                 return false;
             },
         }
         
         
    },
    
    doBasePriceDefine_Tab: function(btn,cmd,grid,record){
        var self = this;
        var baseGrid;
        var recordData;

        //根据点击的地方是按钮或者操作列，处理一些基本数据
        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.getData();
        }

        //得到组件
        var funCode = baseGrid.funCode; //creditrule_main
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel
        
        var categroyGrid = basePanel.down("grid[xtype=basedevice.baserate.categroygrid]");
        var categroyGridRecords = categroyGrid.getSelectionModel().getSelection();
        if(categroyGridRecords.length == 0){
        	self.msgbox("请选择类型！");
            return;
        }
        
        var categroy = categroyGridRecords[0].get("categroy");
        if(categroy=="水控"){
        	categroy="0"
        }else if(categroy=="电控"){
        	categroy="1"
        }
        
        //得到配置信息
        var funData = basePanel.funData;
        var detCode =  basePanel.detCode;  
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
                
        //关键：打开新的tab视图界面的控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });

        //本方法只提供班级详情页使用
        var tabTitle = funData.tabConfig.addTitle;
        //设置tab页的itemId
        var tabItemId=funCode+"_gridAdd";     //命名规则：funCode+'_ref名称',确保不重复
        var pkValue= null;
        var operType = cmd;    // 只显示关闭按钮
        var itemXtype=[{
            xtype:detLayout,                        
            funCode: detCode             
        }];

        switch (cmd) {
            case "edit":
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                insertObj = recordData;
                insertObj.categroy=categroy;
                tabTitle = funData.tabConfig.editTitle;
                tabItemId=funCode+"_gridEdit"; 
                break;
            case "add":
                if (btn) {
                insertObj.categroy=categroy;
                tabTitle = funData.tabConfig.addTitle;
                tabItemId=funCode+"_gridAdd"; 
                break;   
                }  
        }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            //创建一个新的TAB
            tabItem=Ext.create({
                xtype:'container',
                title: tabTitle,
                scrollable :true, 
                itemId:tabItemId,
                itemPKV:pkValue,      //保存主键值
                layout:'fit', 
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){
                //创建组件
                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                //保存一些需要默认值，提供给提交事件中使用
                    funData: popFunData,                //保存funData数据，提供给提交事件中使用
                    items:itemXtype
                }); 
                tabItem.add(item);  
               
                //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中） 
                if (cmd=="edit") {
                    var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                    var formDeptObj = objDetForm.getForm();
                    self.setFormValue(formDeptObj, insertObj);
                    objDetForm.down("combobox[name=categroy]").setReadOnly(true);
                }
                if (cmd=="add") {
                    var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                    var formDeptObj = objDetForm.getForm();
                    self.setFormValue(formDeptObj, insertObj);
                }
                
            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);        
    },
    
    /*
     * 删除的方法
     */
    doBasePriceDefine_Delete:function(btn,cmd,grid,record){
    	var self = this;
        var baseGrid;
        var recordData;

        //根据点击的地方是按钮或者操作列，处理一些基本数据
        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.getData();
        }
        //得到组件
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var categroyGrid = basePanel.down("grid[xtype=basedevice.baserate.categroygrid]");
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        var categroyGridRecords = categroyGrid.getSelectionModel().getSelection();
        var categroy = categroyGridRecords[0].get("categroy");
        
        if(btn){
        	if (records.length > 0) {
                //封装ids数组
                Ext.Msg.confirm('提示', '是否删除数据?', function (btn, text) {
                    if (btn == 'yes') {
                        var ids = new Array();
                        Ext.each(records, function (rec) {
                            var pkValue = rec.get(pkName);
                            ids.push(pkValue);
                        });
                        //发送ajax请求
                        var resObj = self.ajax({
                            url: funData.action + "/doDelete",
                            params: {
                                ids: ids.join(","),
                                pkName: pkName,
                                categroy:categroy
                            }
                        });
                        if (resObj.success) {
                            baseGrid.getStore().load();
                            self.msgbox(resObj.obj);
                        } else {
                            self.Error(resObj.obj);
                        }
                    }
                });
            } else {
                self.Warning("请选择数据");
            }
        }else{
        	Ext.Msg.confirm('提示', '是否删除数据?', function(btn, text) {
                if (btn == 'yes') {                        
                    //发送ajax请求
                    var resObj = self.ajax({
                        url: funData.action + "/doDelete",
                        params: {
                            ids: record.get(pkName),
                            pkName: pkName,
                            categroy:categroy
                        }
                    });
                    if (resObj.success) {
                        baseGrid.getStore().remove(record); //不刷新的方式
                        self.msgbox(resObj.obj);
                    } else {
                        self.Error(resObj.obj);
                    }
                }
            });
        }
        
    }
   
});