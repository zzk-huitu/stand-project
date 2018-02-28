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
                    this.loadMainGridStore(tree,record);                
                    return false;
                }
            },
            

            //区域列表刷新按钮事件
            "basetreegrid[xtype=baseset.roomdefine.roomdefinetree] button[ref=gridRefresh]": {
                click: function (btn) {
                    this.refreshTreeStore(btn);
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
             "basegrid[xtype=baseset.roomdefine.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    self.deleteRoom(btn);
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
                    return false;        
                },
                 detailClick_Tab: function(data) {
                    self.openRoomDefine_Tab(null,"detail",data.view,data.record); 
                    return false;       
                },
                deleteClick: function(data) {
                    self.deleteRoom(null,data.view,data.record); 
                    return false;       
                },
                },
            "basepanel basegrid[xtype=baseset.roomdefine.maingrid] field[funCode=girdFastSearchText]": {
                specialkey: function (field, e) {
                    var self = this;
                    if (e.getKey() == e.ENTER) {
                        self.doFastSearch(field);
                        return false;
                    }
                }
            },
            "basepanel basegrid[xtype=baseset.roomdefine.maingrid] button[ref=gridFastSearchBtn]": {
                beforeclick: function (btn) {
                    var self = this;
                    self.doFastSearch(btn);
                    return false;
                }
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
                var resObj= self.ajax({
                    url: funData.action + "/getDormEntity",
                    params: {
                        roomId: recordData.uuid,
                    },                       
                });  
                if (resObj.obj.isMixed ==1 || resObj.obj.roomStatus == 1) {    
                    self.msgbox("混班宿舍和已分配的宿舍都不允许修改!");
                    return;                    
                } 
                recordData = Ext.apply(recordData,{
                    dormType: resObj.obj.dormType,
                    dormBedCount: resObj.obj.dormBedCount,
                    dormChestCount: resObj.obj.dormChestCount,
                    dormPhone: resObj.obj.dormPhone,
                    dormFax: resObj.obj.dormFax,
                    dormTypeLb:resObj.obj.dormTypeLb,
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
                        url: comm.get("baseUrl") + "/BaseRoomdefine/getDormEntity",
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

    deleteRoom:function(btn,grid,record){
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
        
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var store=baseGrid.getStore();
        //得到配置信息
        var funData = basePanel.funData;

        if (records.length > 0) {
              //封装ids数组
              var ids = new Array();
              var names = new Array();
              Ext.each(records, function(rec) {
                var pkValue = rec.get("uuid");
                var name = rec.get("roomName");
                ids.push(pkValue);
                names.push(name);
            });

            Ext.Msg.confirm('提示', '是否要将【'+names.join("，")+'】解除设置?', function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                            ids: ids.join(","),
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                store.loadPage(1); //不刷新的方式
                                self.msgbox(data.obj);                               
                            }else {

                                store.load(); //不刷新的方式
                                self.Warning(data.obj);
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
            /**
         * 执行快速搜索
         * @param component
         * @returns {boolean}
         */
  doFastSearch: function (component) {
  //得到组件                 
        var baseGrid = component.up("basegrid");
        var toolBar = component.up("toolbar");
        var filter = [];
        var gridFilter=[];
        //获取baseGrid中编写的默认filter值
        var gridFilterStr=baseGrid.extParams.filter;
        if(gridFilterStr&&gridFilterStr.trim()!=""){
            gridFilter=JSON.parse(gridFilterStr);
            filter=gridFilter;
        }
       
        //可能存在多个文本框       
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        for (var i in girdSearchTexts) {
            var name = girdSearchTexts[i].getName();
            var value = girdSearchTexts[i].getValue();

            //判断gridFilter是否包含此值。
            var isExist=false;
            for(var j=0;j<gridFilter.length;j++){
                if(gridFilter[j].field==name){
                    if(value!=null){
                        filter[j]={"type": "string", "value": value, "field": name, "comparison": ""};
                    }
                    isExist=true;
                    break;
                }
            }
            if(isExist==false)
                filter.push({"type": "string", "value": value, "field": name, "comparison": ""});
        }

        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);
     },

    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "roomType", "comparison": ""})
        }
        if(girdSearchTexts[1].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[1].getValue(), "field": "roomName", "comparison": ""})
        }
        return filter;
    },

    loadMainGridStore:function(tree,record){
        var self=this;
        var mainLayout = tree.up("panel[xtype=baseset.roomdefine.mainlayout]");
        var areaType = record.get("areaType");
        var areaId = record.get("id");

        Ext.apply(mainLayout.funData, {
            areaId: areaId,
            areaType: areaType,
            areaName: record.get("text"),
            //filter: JSON.stringify(filter),
        });
        
        var roomGrid = mainLayout.down("panel[xtype=baseset.roomdefine.maingrid]");

        //获取右边筛选框中的条件数据
        var filter=self.getFastSearchFilter(roomGrid);

        //额外必须的参数
        filter.push({"type":"string","comparison":"!=","value":"0","field":"roomType"});                

        filter = JSON.stringify(filter);

        var store = roomGrid.getStore();
        var proxy = store.getProxy();
        //附带参赛
        proxy.extraParams={
            areaId:areaId,
            areaType:areaType,
            filter:filter
        }
        store.loadPage(1); // 给form赋值
    },

    refreshTreeStore:function(btn){
        var baseTreeGrid = btn.up("basetreegrid");
        var store = baseTreeGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams = {
            whereSql: " and isDelete='0' ",
            orderSql: "",
            excludes:"checked"
        };
        store.load(); //刷新父窗体的grid
        var mainlayout = btn.up("basepanel[xtype=baseset.roomdefine.mainlayout]");
        var mianGrid = mainlayout.down("basegrid[xtype=baseset.roomdefine.maingrid]");
        var store = mianGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.areaId= "";
        proxy.extraParams.areaType= "";
    }
});
