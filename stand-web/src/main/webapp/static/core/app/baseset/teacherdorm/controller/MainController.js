Ext.define("core.baseset.teacherdorm.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.teacherdorm.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        
    },
    init: function () {
        var self=this;
        this.control({
             //区域列表刷新按钮事件
            "panel[xtype=baseset.teacherdorm.teacherdormtree] button[ref=gridRefresh]": {
                click: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },

              //入住
          "basegrid[xtype=baseset.teacherdorm.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    self.open_Tab(btn,"add");
                    return false;
                }
            },
            //退住
            "basegrid[xtype=baseset.teacherdorm.maingrid] button[ref=gridOut]": {
                beforeclick: function(btn) {
                    self.doGridOut(btn);
                    return false;
                }
            },
            //删除
            "basegrid[xtype=baseset.teacherdorm.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    self.doDeleteRecords(btn);
                    return false;
                }
            },
             //表格单击事件
            "basegrid[xtype=baseset.teacherdorm.maingrid]": {
                beforeitemclick: function(grid, record, item, index, e, eOpts) {
                    var basePanel = grid.up("basepanel");
                    var funCode = basePanel.funCode;
                    var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
                    var records = baseGrid.getSelectionModel().getSelection();
                    var btnOut = baseGrid.down("button[ref=gridOut]");
                    var btnDelete = baseGrid.down("button[ref=gridDelete]");
                   if (records.length == 0) {
                        if (btnOut)
                            btnOut.setDisabled(true);
                        if (btnDelete)
                            btnDelete.setDisabled(true);

                    } else if (records.length == 1) {
                        if (btnOut)
                            btnOut.setDisabled(false);
                        if (btnDelete)
                            btnDelete.setDisabled(false);
                    } else {
                        if (btnOut)
                            btnOut.setDisabled(true);
                        if (btnDelete)
                            btnDelete.setDisabled(false);
                    }
                    return false;
                }
                
            },
            
             /**
             * 操作列的操作事件
             */
             "basegrid[xtype=baseset.teacherdorm.maingrid] actioncolumn": {

                //弹出tab页的方式
             outClick: function(data) {
                    self.doGridOut(null,data.view,data.record);  
                    return false;      
                },
            },

             deleteClick: function(data) {
                    self.doDeleteRecords(null,data.view,data.record);
                     return false;
                },
                
        })
    },


    open_Tab: function(btn,cmd) {
        var self = this;

        //得到组件
        var baseGrid=btn.up("basegrid");
        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
    
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var pkName=funData.pkName;
  
        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
        
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        if (funData.leaf!=true) {
            self.msgbox("请选择教师宿舍");
            return;
        }
        //获取Tab相关数据,根据cmd的类型，来获取不同的数据
        var tabConfig=funData.tabConfig;
        var tabTitle = tabConfig.addTitle; 
        var tabItemId =funCode + "_gridAdd"; ;
        var operType="add";
        var recordData=null;
       
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
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
                var objForm = item.down("baseform[xtype=baseset.teacherdorm.detailform]");
                var formObj = objForm.getForm();
                formObj.findField("dormId").setValue(funData.dormId);
                formObj.findField("roomId").setValue(funData.roomId);
                formObj.findField("roomName").setValue(funData.roomName);

            },30);
                           
        }

      
        tabPanel.setActiveTab(tabItem);   
    },

    doGridOut:function(btn,grid,record){
        var self=this;
        var records;
          //得到组件
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
            records = baseGrid.getSelectionModel().getSelection();
        }else{
            records=new Array();
            records.push(record);
        }
        
        if (records.length > 0) {
              //封装ids数组
              var ids = new Array();
              var names = new Array();
              Ext.each(records, function(rec) {
                var pkValue = rec.get("uuid");
                var name = rec.get("xm");
                ids.push(pkValue);
                names.push(name);
            });

            Ext.Msg.confirm('提示', '是否要将'+names.join(",")+'退住?', function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    self.asyncAjax({
                        url: comm.get('baseUrl')  + "/BaseTeacherDrom/out",
                        params: {
                            ids: ids.join(","),
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                var store=baseGrid.getStore();
                                store.loadPage(1); //不刷新的方式
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
   
       doDeleteRecords:function(btn,grid,record){
            var self=this;
            var records;
            var baseGrid = grid;
            if(!baseGrid){
                baseGrid=btn.up("basegrid");
                records = baseGrid.getSelectionModel().getSelection();
            }else{
                records=new Array();
                records.push(record);
            }
            funCode = baseGrid.funCode;
            var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
            //得到配置信息
            var funData = basePanel.funData;
            var ids = '';
            var roomIds ='';
            if (records.length <= 0) {
                self.msgbox('请选择一条数据');
                return;
            }
            //var roomId = records[0].get('roomId');
            for (var i = 0; i < records.length; i++) {
                ids += records[i].get('uuid') + ',';
                roomIds += records[i].get('roomId')+ ',';
            };
            if (records.length > 0) {
                //封装ids数组
                Ext.Msg.confirm('提示',"是否删除", function (btn, text) {
                    if (btn == 'yes') {
                        
                        var loading = new Ext.LoadMask(baseGrid, {
                            msg: '正在提交，请稍等...',
                            removeMask: true// 完成后移除
                        });
                        loading.show();

                        self.asyncAjax({
                            url: funData.action + "/doDelete",
                            params: {
                                 ids: ids,
                              //   roomId: roomId,
                            },                    
                            success: function(response) {
                                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                                if(data.success){
                                     baseGrid.getStore().load(); //不刷新的方式
                                     setTimeout(function(){
                                      self.ajax({
                                          url: funData.action + "/doSetOff",
                                          params: {
                                            roomIds: roomIds,
                                        },
                                    })

                                  },30);
                                    
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
});
