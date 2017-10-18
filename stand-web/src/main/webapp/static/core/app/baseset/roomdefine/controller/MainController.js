Ext.define("core.baseset.roomdefine.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.roomdefine.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    init: function () {
        var self = this
        this.control({
            "basetreegrid[xtype=baseset.roomdefine.roomdefinetree]":{
                itemclick: function (tree, record, item, index, e, eOpts) {
                    var mainLayout = tree.up("panel[xtype=baseset.roomdefine.mainlayout]");
                    var areaType = record.get("areaType");
                    var areaId = record.get("id");
                    var filter = [];
                    filter.push({"type":"string","comparison":"!=","value":"0","field":"roomType"});

                    if(areaType=="04")
                        filter.push({"type":"string","comparison":"=","value": areaId ,"field":"areaId"});
                    
                    var funData = mainLayout.funData;
                    mainLayout.funData = Ext.apply(funData, {
                        areaId: record.get("id"),
                        areaType: record.get("areaType"),
                        areaName: record.get("text"),
                        filter: JSON.stringify(filter),
                    });
                    // 加载对应的房间信息
                    var roomGrid = mainLayout.down("panel[xtype=baseset.roomdefine.maingrid]");
                    var store = roomGrid.getStore();
                    var proxy = store.getProxy();

                    proxy.extraParams.filter = JSON.stringify(filter);
                    proxy.extraParams.areaId= areaId;
                    proxy.extraParams.areaType= areaType;
                    store.loadPage(1); // 给form赋值
                    return false;
                }
            },
            

            //区域列表刷新按钮事件
            "basetreegrid[xtype=baseset.roomdefine.roomdefinetree] button[ref=gridRefresh]": {
                click: function (btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams = {
                        whereSql: " and isDelete='0' ",
                        orderSql: "",
                        excludes:"checked"
                    };
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },
               //
           "basegrid[xtype=baseset.roomdefine.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    self.openRoomDefine_Tab(btn,"add");
                    return false;
                }
            },

             /**
             * 操作列的操作事件
             */
             "basegrid[xtype=baseset.roomdefine.maingrid] actioncolumn": {

                //弹出tab页的方式
                editClick_Tab: function(data) {
                    self.openRoomDefine_Tab(null,"edit",data.view,data.record);        
                },
                 detailClick_Tab: function(data) {
                    self.openRoomDefine_Tab(null,"detail",data.view,data.record);        
                },
            },

        });
},

openRoomDefine_Tab: function(btn,cmd,grid,record){
    var self = this;
         //得到组件
         var baseGrid = grid;
         if(!baseGrid){
            baseGrid=btn.up("basegrid");
        };

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

        //获取Tab相关数据,根据cmd的类型，来获取不同的数据
        var tabConfig=funData.tabConfig;
        var tabTitle = tabConfig.addTitle; 
        var tabItemId = funCode + "_gridAdd";
        var pkValue= null;
        var operType="add";
        var recordData=null;
        switch (cmd) {
            case "add":
                var basetreegrid = basePanel.down("basetreegrid[xtype=baseset.roomdefine.roomdefinetree]");
                var selectObject = basetreegrid.getSelectionModel().getSelection()[0];
                var areaId = "";
                var areaType = "";
                var areaName = "";
                if (selectObject == null) {
                    self.msgbox("请选择楼层!");
                    return;
                } else {
                    areaId = selectObject.get("id");
                    areaType = selectObject.get("areaType");
                    areaName = selectObject.get("text");
                }
                if(areaType!="04"){
                    self.msgbox("只能选择楼层添加!");
                    return;
                }

                tabTitle = areaName+"-"+tabConfig.addTitle; 
                break;
            case "edit":
                //点击操作列的方式
                recordData=record.getData();
                 //通过recordData.uuid 获取宿舍对象
                var data;
                self.asyncAjax({
                    url: funData.action + "/doDormEntity",
                    params: {
                        roomId: recordData.uuid,
                    },                       
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        if(data.success){

                            if (data.obj.isMixed ==1 || data.obj.roomStatus == 1) {
                                self.msgbox("混班宿舍和已分配的宿舍都不允许修改!");
                                return;
                            } 
                            recordData = Ext.apply(recordData,{
                                dormType: data.obj.dormType,
                                dormBedCount: data.obj.dormBedCount,
                                dormChestCount: data.obj.dormChestCount,
                                dormPhone: data.obj.dormPhone,
                                dormFax: data.obj.dormFax,
                            });
                        }else {
                            self.Error(data.obj);
                        }           
                        
                    },
                failure: function(response) {                   
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                    loading.hide();
                }
            });     
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
                recordData=record.getData();
                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-"+tabConfig.detailTitle;
                else
                    tabTitle = tabConfig.detailTitle;

                //获取主键值
                pkValue = recordData[pkName];
                tabItemId =funCode+"_gridDetail"+pkValue;    //详情页面可以打开多个，ID不重复
                detLayout = "baseset.roomdefine.detailhtml";
                operType ="detail";
                console.log(detLayout);

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
                    funData:popFunData,                 //保存funData数据，提供给提交事件中使用
                    areaId: areaId,                     
                    items:[{
                        xtype:detLayout,
                    }],
                    listeners: {
                        beforerender: function() {
                            if(operType!="detail"){
                                 //隐藏按钮
                            var basepanel = item.down("basepanel[xtype=baseset.roomdefine.detaillayout]");
                            var baseform = basepanel.down("baseform");
                            var formObj = baseform.getForm(); 
                            formObj.sign="add";
                           //编辑宿舍时的页面布局操作
                           if(operType=="edit"){
                                   //处理打开界面之后，显示的初始数据
                                   formObj.sign="edit"; 
                                   self.setFormValue(formObj, insertObj);

                                   baseform.down("combobox[name=roomType]").setDisabled(true);

                                   var dormContainers=baseform.query("container[ref=dormContainer]"); 
                                   for(i in dormContainers){
                                    dormContainers[i].setVisible(true);
                                } 
                                var publiContainer=baseform.down("container[ref=publiContainer]"); 
                                publiContainer.setVisible(false);

                            }


                            var roomgrid=baseform.down("basegrid[xtype=baseset.roomdefine.roomgrid]");
                            var filter = "[{'type':'string','comparison':'=','value':'" + areaId + "','field':'areaId'}";
                            filter += ",{'type':'string','comparison':'=','value':0,'field':'roomType'}]";
                            var proxy = roomgrid.getStore().getProxy();
                            proxy.extraParams.filter = filter;

                            }
                           

                        }
                    }
                }); 

               tabItem.add(item);  

                if(cmd=="detail"){
                    var dormBaseContainer = tabItem.down("container[ref=dormBaseInfo]");
                    dormBaseContainer.setData(insertObj);
                    self.asyncAjax({
                        url: comm.get("baseUrl") + "/BaseRoomdefine/doDormEntity",
                        params: {
                            page: 1,
                            start: 0,
                            limit: 0,
                            roomId: insertObj.uuid 
                        },
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            var dormDetailContainer = tabItem.down("container[ref=dormDetailInfo]");
                            dormDetailContainer.setData(data);
                            console.log(data);
                        }
                    });
                }

            },30);

        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);

    },

    
});
