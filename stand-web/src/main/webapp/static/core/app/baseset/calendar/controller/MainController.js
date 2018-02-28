Ext.define("core.baseset.calendar.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.calendar.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        
    },
      
    init: function () {
        var self = this;
            //事件注册
        this.control({
            "basepanel basegrid[xtype=baseset.calendar.calendargrid]": {
                afterrender : function(grid) {
                    this.hideFuncBtn(grid);
                },
                beforeitemclick: function(grid, record, item, index, e, eOpts) {
                    this.disabledFuncBtn(grid);

                    this.loadMainGridStore(grid,record);
                    
                   // return false;
               }

            },
            "basepanel basegrid[xtype=baseset.calendar.maingrid]": {
                beforeitemclick: function(grid) {
                    this.disabledMainFuncBtn(grid);    
                    return false;
                },
            },
            //增加作息时间目录事件
            "basegrid[xtype=baseset.calendar.calendargrid] button[ref=gridAdd]": {
                beforeclick: function(btn) {                
                    self.doCalendarDetail_Win(btn, "add");
                    return false;
                }
            },
            //编辑作息时间目录事件
            "basegrid[xtype=baseset.calendar.calendargrid] button[ref=gridEdit]": {
                beforeclick: function(btn) {
                    self.doCalendarDetail_Win(btn, "edit");
                    return false;
                }
            },
            //启用作息时间事件
            "basegrid[xtype=baseset.calendar.calendargrid] button[ref=gridUse]": {
                beforeclick: function(btn) {
                    self.doCalenderUse(btn);
                    return false;
                }
            },
             //删除作息时间事件
            "basegrid[xtype=baseset.calendar.calendargrid] button[ref=gridDelTime]": {
                beforeclick: function(btn) {
                    self.doDeleteCaleRecords(btn);
                    return false;
               }
            },
          

            //添加作息时间详细信息事件
            "basegrid[xtype=baseset.calendar.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    self.doItemDetail_Tab(btn, "add");                
                    return false;
                }
            },
            /** 作息时间详细信息修改事件响应 */
            "basegrid[xtype=baseset.calendar.maingrid] button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    self.doItemDetail_Tab(btn, "edit");
                    return false;

                }
            },

            /** 作息时间详细信息删除事件响应 */
            "basegrid[xtype=baseset.calendar.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                   self.doDeleteRecords(btn);
                   return false;
                }
            },
           
            "basegrid[xtype=baseset.calendar.maingrid] button[ref=gridExport]": {
                beforeclick: function(btn) {
                    this.doExport(btn);
                    return false;
                }
            },

        });
    },


    //作息时间详细信息增加、修改和详细的处理
    doItemDetail_Tab: function(btn, cmd,grid,record) {
        var self = this;

        //得到组件
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
        }

        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
        var calendargrid = basePanel.down("basegrid[xtype=baseset.calendar.calendargrid]");
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var canderId = funData.canderId;
        var canderName = funData.canderName;
        var activityState = funData.activityState;
        var campusName = funData.campusName;
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
        var caleSelected =null;
        switch (cmd) {
            case "add":
                tabTitle = tabConfig.addTitle; 
                tabItemId = funCode + "_gridAdd";    //命名规则：funCode+'_ref名称',确保不重复
                pkValue = null;
                operType="add";
                caleSelected = calendargrid.getSelectionModel().getSelection();
                if(caleSelected.length!=1){
                    self.msgbox("请选择一条数据！");
                    return;
                 }

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
                var insertObj =  Ext.apply(new Object(),funData.defaultObj);
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
                    funData:popFunData,                     //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout
                    }]
                }); 
              
                tabItem.add(item);  
                
                insertObj.beginTime = Ext.util.Format.date(insertObj.beginTime, 'H:i');
                insertObj.endTime = Ext.util.Format.date(insertObj.endTime, 'H:i');
                insertObj.canderName = canderName;
                insertObj.campusName = campusName;
                insertObj.canderId = canderId;

                //处理打开界面之后，显示的初始数据
                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();              
                self.setFormValue(formDeptObj, insertObj);
                               
                if(cmd=="detail"){
                    formDeptObj.setItemsReadOnly(true);
                }

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);   
    },


    //作息时间目录增加、修改和详细的处理
   doCalendarDetail_Win : function(btn, cmd, grid, record) {
        var self=this;
        //得到组件
        var basegrid=grid;
        if(!basegrid) {
            baseGrid = btn.up("basegrid");
        }
        var basePanel = baseGrid.up("basepanel");

        //得到配置信息
        var funData = basePanel.funData;
        var detCode = "calendar_detail";
        var detLayout = "baseset.calendar.calendardetaillayout";
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';    
        
        //设置window的参数
        var width = 450;
        var height = 250;
        var iconCls= 'x-fa fa-plus-circle';
        var winTitle = "添加作息时间目录";
        var recordData=null;
        var operType="add";
        switch (cmd) {
           /* case "add":
                winTitle = "增加作息时间目录";
                iconCls = "x-fa fa-plus-circle";
                operType="add";
                break;*/
            case "edit":
                winTitle = "编辑作息时间目录";
                operType="edit";
                iconCls = "x-fa fa-pencil-square";
              
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

                var state =recordData["activityState"];
                if (state === 1) {
                    self.msgbox("所选作息时间已生效启用，不能再修改！");
                    return;
                }
               
                recordData = Ext.apply(recordData, {
                    activityTime: Ext.util.Format.date(Ext.valueFrom(recordData["activityTime"], null), 'Y-m-d')
                });
                break;
            case "detail":
                winTitle = "作息时间目录详情";
                iconCls = "x-fa fa-file-text";
                operType="detail";

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
               
                break;
        }

        //处理默认值
        var insertObj = funData.defaultObj;
        if(recordData!=null){
            insertObj=recordData;
        }
        //保持一些相关数据，在提交时使用
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });
                  
                
        var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls:iconCls,
            title: winTitle,
            operType: operType,
            width: width,
            height: height,
            controller: otherController,
            funData: popFunData,
            funCode: detCode,
            insertObj: insertObj,        
            items: [{
                xtype: detLayout
            }]
        }).show(); 
       

        var detPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();

        self.setFormValue(formDeptObj, insertObj);

        if(cmd=="detail")
             formDeptObj.setItemsReadOnly(true);
    },
     doDeleteRecords:function(btn,grid, record){
        var self=this;
        //得到组件
        var basegrid=grid;
        if(!basegrid) {
            baseGrid = btn.up("basegrid");
        }
        var basePanel = baseGrid.up("basepanel");
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var canderId = funData.canderId;
        var activityState = funData.activityState;
        if (Ext.isEmpty(canderId)) {
            self.msgbox("请选择作息时间!");
            return;
        }
        if (activityState == "1") {
            if (Ext.isEmpty(canderId)) {
                self.msgbox("不能删除已生效的作息时间的节次信息!");
                return;
            }
        }
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm('提示', '是否删除数据?', function (btn, text) {
                if (btn == 'yes') {
                    var loading = self.LoadMask(baseGrid);

                    var ids = new Array();
                    Ext.each(records, function (rec) {
                        var pkValue = rec.get(pkName);
                        ids.push(pkValue);
                    });

                    self.asyncAjax({
                        url: funData.action + "/doDelete", 
                        params: {
                            ids: ids.join(","),
                            pkName: pkName
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                baseGrid.getStore().remove(records); //不刷新的方式
                                self.msgbox(data.obj);                               
                            }else {
                                self.Error(data.obj);
                            }           
                            loading.hide();
                        },
                        failure: function(response) {                   
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            loading.hide();
                        }
                    });     
                }
            });
        } else {
            self.msgbox("请选择数据");
        }
    },

     doDeleteCaleRecords:function(btn){
        var self=this;
        //得到组件
        var baseGrid = btn.up("basegrid");
        var basePanel = baseGrid.up("basepanel");
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        var ids = new Array();

        for(index in records){
           var rec=records[index];
           ids.push(rec.get("uuid"));

          if (rec.get("activityState") == 1) {
              self.msgbox("不能删除已生效的作息时间!");
              return false;
          }
        }
    

            if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm('提示', '是否删除数据?', function (btn, text) {
                if (btn == 'yes') {
                    var loading = self.LoadMask(baseGrid);
                    self.asyncAjax({
                        url: comm.get('baseUrl') + "/BaseCalender/doDelete", 
                        params: {
                            ids: ids.join(","),
                           
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                              basePanel.down("basegrid[xtype=baseset.calendar.maingrid]").getStore().load();
                                   // grid.getStore().load();
                             baseGrid.getStore().remove(records); //不刷新的方式
                             self.msgbox(data.obj);                               
                            }else {
                                self.Error(data.obj);
                            }           
                            loading.hide();
                        },
                        failure: function(response) {                   
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            loading.hide();
                        }
                    });     
                }
            });
        } else {
            self.msgbox("请选择数据");
        }   

    },
    doCalenderUse:function(btn) {
            var self=this;
            var ids=new Array();
            var campusNames = new Array();
            //得到组件
            var basegrid = btn.up("basegrid");
            var basepanel = basegrid.up('basepanel');
            var records = basegrid.getSelectionModel().getSelection();
            if(records.length==0){
               self.msgbox("请选择一条需要生效的日历!");
               return;
            }
            if(records.length==1){
                ids.push(records[0].get('uuid'));
                campusNames.push(records[0].get('campusName'));
            }else{
                var count = records.length;
                for(var i=0; i<records.length;i++){
                   var campusName = records[i].get('campusName');
                   if(campusNames.indexOf(campusName)==-1){//不存在相同的
                      ids.push(records[i].get('uuid'));
                      campusNames.push(campusName);
                   }

                }
                if(campusNames.length!=count){
                   self.msgbox("一个校区只能选中一条生效的日历!");
                   return;
               }
             };

            if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm("提示", "启用此作息时间则会使相同校区的其他作息时间失效，你确定要启用吗？", function (btn, text) {
                if (btn == 'yes') {
                    var loading = self.LoadMask(basegrid);
                    self.asyncAjax({
                        url: comm.get('baseUrl') + "/BaseCalender/doUpdateState", 
                        params: {
                         ids: ids.join(","),
                         campusNames: campusNames.join(",")
                     },                      
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                               basegrid.getStore().load();
                               self.msgbox(data.obj);                               
                            }else {
                                self.Error(data.obj);
                            }           
                            loading.hide();
                        },
                        failure: function(response) {                   
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            loading.hide();
                        }
                    });     
                }
            });
        } else {
            self.msgbox("请选择一条需要生效的日历!");
        }

    },
    
    doExport:function(btn){
        var self = this;
        var baseGrid = btn.up("basegrid[xtype=baseset.calendar.maingrid]");
        var basepanel = baseGrid.up('basepanel');
        var calendargrid = basepanel.down("basegrid[xtype=baseset.calendar.calendargrid]");
        var records = calendargrid.getSelectionModel().getSelection();
        if(records.length==0){
        	self.Warning("请选择一个作息时间表!");
            return;
        }
        var canderId = records[0].data.uuid;
        var canderName = records[0].data.canderName;
        var campusName = records[0].data.campusName;
        var title = "确定要导出作息时间吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/BaseCalenderdetail/doExportExcel?canderId='+canderId+"&canderName="+canderName+"&campusName="+campusName+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/BaseCalenderdetail/checkExportEnd',
                        timeout: 1000 * 60 * 30,        //半个小时
                        //回调代码必须写在里面
                        success: function (response) {
                            data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            if (data.success) {
                                Ext.Msg.hide();
                                self.msgbox(data.obj);
                                component.destroy();
                            } else {
                                if (data.obj == 0) {    //当为此值，则表明导出失败
                                    Ext.Msg.hide();
                                    self.Error("导出失败，请重试或联系管理员！");
                                    component.destroy();
                                } else {
                                    setTimeout(function () {
                                        time()
                                    }, 1000);
                                }
                            }
                        },
                        failure: function (response) {
                            Ext.Msg.hide();
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            component.destroy();
                        }
                    });
                };
                setTimeout(function () {
                    time()
                }, 1000);    //延迟1秒执行
            }
        });
       return false;
 	},

    hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="SCHOOLCALENDAR";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridUse")==-1){
                var btnUse = grid.down("button[ref=gridUse]");
                btnUse.setHidden(true);
                
             }
             if(userBtn.indexOf(menuCode+"_gridDelTime")==-1){
                var btnUse = grid.down("button[ref=gridDelTime]");
                btnUse.setHidden(true);
                
            }
         }
    },

    disabledFuncBtn:function(grid){
        var basePanel = grid.up("basepanel");
        var basegrid = basePanel.down("basegrid[xtype=baseset.calendar.calendargrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnEdit = basegrid.down("button[ref=gridEdit]");
        var btnDelTime = basegrid.down("button[ref=gridDelTime]");
        var btnUse = basegrid.down("button[ref=gridUse]");
        if (records.length == 0) {
            btnEdit.setDisabled(true);
            btnDelTime.setDisabled(true);
            btnUse.setDisabled(true);
        } else if (records.length == 1) {
            btnEdit.setDisabled(false);
            btnDelTime.setDisabled(false);
            btnUse.setDisabled(false);
        } else {
            btnEdit.setDisabled(true);
            btnDelTime.setDisabled(false);
            btnUse.setDisabled(false);
        }
    },

    loadMainGridStore:function(grid,record){
        var basePanel = grid.up("basepanel");
        var funData = basePanel.funData;
        Ext.apply(funData, {
            canderId: record.get("uuid"),
            canderName: record.get("canderName"),
            activityState: record.get("activityState"),
            campusName: record.get("campusName")
        });
        //加载作息时间项信息
        var mainGrid = basePanel.down("panel[xtype=baseset.calendar.maingrid]");
        var btn3 = mainGrid.down("button[ref=gridAdd_Tab]");
        if(record.get("activityState")==1){
            btn3.setDisabled(true);
        }else{
           btn3.setDisabled(false); 
       }
       var store = mainGrid.getStore();
       var proxy = store.getProxy();

       proxy.extraParams.filter='[{"type":"string","value":"'+record.get("uuid")+'","field":"canderId","comparison":""}]';
       store.load();
    },

    disabledMainFuncBtn:function(grid){        
        var basePanel = grid.up("basepanel");
        var funData = basePanel.funData;
        var basegrid = basePanel.down("basegrid[xtype=baseset.calendar.maingrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnEdit = basegrid.down("button[ref=gridEdit_Tab]");
        var btnDelete = basegrid.down("button[ref=gridDelete]");
        var btnAdd = basegrid.down("button[ref=gridAdd_Tab]");
        if(funData.activityState==1){//启用 
            btnAdd.setDisabled(true);
            btnEdit.setDisabled(true);
            btnDelete.setDisabled(true);
        }else{
            if (records.length == 0) {
                btnAdd.setDisabled(false);
                btnEdit.setDisabled(true);
                btnDelete.setDisabled(true);
            } else if (records.length == 1) {
                btnAdd.setDisabled(false);
                btnEdit.setDisabled(false);
                btnDelete.setDisabled(false);
            }else{
                btnAdd.setDisabled(false);
                btnEdit.setDisabled(true);
                btnDelete.setDisabled(false);
            }
        }
    }

});
