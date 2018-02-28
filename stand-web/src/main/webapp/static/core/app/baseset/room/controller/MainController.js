Ext.define("core.baseset.room.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.room.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    
    init: function () {
        var self = this;
        // 事件注册
        this.control({
        	  "basepanel basetreegrid[xtype=baseset.room.areagrid]": {
                  afterrender : function(grid) {
                    this.hideFuncBtn(grid);
                 },
                 beforeitemclick: function(grid) {
                    this.disabledFuncBtn(grid);
                },
            },
             "basepanel basegrid[xtype=baseset.room.maingrid]": {
                  afterrender : function(grid) {
                    this.hideMainFuncBtn(grid);
                 },
            },
        	"basegrid[xtype=baseset.room.maingrid] button[ref=gridBatchAdd_Tab]": {
                beforeclick: function(btn) {
                    this.dobatch_Tab(btn,"add");
                    return false;
                }
            },
            
            //区域列表点击事件
            "panel[xtype=baseset.room.areagrid]": {
                itemclick: function (tree, record, item, index, e, eOpts) {
                    this.loadMainGridStore(tree,record);
                    // return false;
                }
            },
            //区域列表刷新按钮事件
            "panel[xtype=baseset.room.areagrid] button[ref=gridRefresh]": {
                click: function (btn) {
                    this.refreshAreaStore(btn);
                    return false;
                }
            },
            //区域列表删除按钮事件
            "panel[xtype=baseset.room.areagrid] button[ref=gridDel]": {
                beforeclick: function (btn) {
                    this.doDeleteArea(btn);
                    return false;
                }
            },
            //区域列表增加下级按钮事件
            "panel[xtype=baseset.room.areagrid] button[ref=gridAdd]": {
                click: function (btn) {
                    self.doDetail(btn, "child");
                }
            },
            //区域列表增加同级按钮事件
            "panel[xtype=baseset.room.areagrid] button[ref=gridAddBrother]": {
                click: function (btn) {
                    self.doDetail(btn, "brother");
                }
            },
            //区域列表修改按钮事件
            "panel[xtype=baseset.room.areagrid] button[ref=gridEdit]": {
                click: function (btn) {
                    self.doDetail(btn, "edit");
                }
            },
            //grid删除
            "panel[xtype=baseset.room.maingrid] button[ref=gridDelete]": {
                beforeclick: function (btn) {                
                    var isOk=this.doDeleteRoom(btn);
                    if(isOk==false)
                        return false;
                }
            },
            "basegrid[xtype=baseset.room.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"add");
                    return false;
                }
            },

            "basegrid[xtype=baseset.room.maingrid] button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"edit");
                    return false;
                }
            },
        });
    },
    
    doDetail_Tab:function(btn, cmd, grid, record) {
        var self = this;
        var baseGrid;
        var recordData;

        //根据点击的地方是按钮或者操作列，处理一些基本数据
        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.data;
        }

        //得到组件
        var funCode = baseGrid.funCode; //jobinfo_main
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel

        //得到配置信息
        var funData = basePanel.funData;
        var detCode =  basePanel.detCode;  
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
                
        //关键：打开新的tab视图界面的控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';
        var areagrid = basePanel.down("basetreegrid[xtype=baseset.room.areagrid]");
        var areaRescords = areagrid.getSelectionModel().getSelection();
        if(areaRescords.length!=1){
           self.msgbox("请选择楼层!");
           return ;
        }
        var areaId = funData.areaId;
        var areaType = funData.areaType;
        var areaName = funData.areaName;
        if (areaType != "04") {
            self.msgbox("只能选择楼层!");
            return ;
        }
        detCode = "room_roomdetail";
        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        insertObj = Ext.apply(insertObj, {
            areaId: areaId,
            areaName: areaName
        });
        var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            filter: "[{'type':'string','comparison':'=','value':'" + areaId + "','field':'areaId'}]"
        });

        //本方法只提供班级详情页使用
        var tabTitle = funData.tabConfig.addTitle;
        //设置tab页的itemId
        var tabItemId=funCode+"_gridAdd";     //命名规则：funCode+'_ref名称',确保不重复
        var pkValue= null;
        var operType = cmd;    // 只显示关闭按钮
        switch (cmd) {
            case "edit":
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].data;
                }
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                insertObj = recordData;
                tabTitle = funData.tabConfig.editTitle;
                tabItemId=funCode+"_gridEdit"; 
                break;
            case "detail":                
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].data;
                }
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];
                insertObj = recordData;
                tabTitle =  funData.tabConfig.detailTitle;
                tabItemId=funCode+"_gridDetail"+pkValue; 
                break;
        }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            
            //创建一个新的TAB
            tabItem=Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
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
                    items:[{
                        xtype:detLayout,                        
                        funCode: detCode             
                    }]
                }); 
                tabItem.add(item);  

                //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中）             
                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();
                self.setFormValue(formDeptObj, insertObj);

                if(cmd=="detail"){
                    self.setFuncReadOnly(funData, objDetForm, true);
                }

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);        
    },
    
    dobatch_Tab:function(btn, cmd) {
        var self = this;
        var baseGrid = btn.up("basegrid");
        var recordData;

    	var tree = baseGrid.up("panel[xtype=baseset.room.mainlayout]").down("panel[xtype=baseset.room.areagrid]");
        var selectRecord = tree.getSelectionModel().getSelection();
        if(selectRecord.length!=1){
            self.msgbox("请选择楼层!");
            return ;
        }
        var selectObject = selectRecord[0];
        var areaId = "";
        var areaType = "";
        var areaName = ""
       
        if (selectObject == null) {
            self.msgbox("请选择楼层!");
            return ;
        } else {
            areaId = selectObject.get("id");
            areaType = selectObject.get("areaType");
            areaName = selectObject.get("text");
        }
        if (areaType != "04") {
            self.msgbox("只能选择楼层!");
            return ;
        }
        //得到组件
        var funCode = baseGrid.funCode; //jobinfo_main
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel

        //得到配置信息
        var funData = basePanel.funData;
        var detCode =  'room_batchroomdetail';  
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
                
        //关键：打开新的tab视图界面的控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';
      
        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        insertObj = Ext.apply(insertObj, {
            areaId: areaId,
            areaName: areaName
        });
        var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            filter: "[{'type':'string','comparison':'=','value':'" + areaId + "','field':'areaId'}]"
        });

      
        var tabTitle = funData.tabConfig.batchaddTitle;
        //设置tab页的itemId
        var tabItemId=funCode+"_gridbatchAdd";     //命名规则：funCode+'_ref名称',确保不重复
        var pkValue= null;
        var operType = cmd;    // 只显示关闭按钮
      
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            
            //创建一个新的TAB
            tabItem=Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
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
                    items:[{
                        xtype:detLayout,                        
                        funCode: detCode,
                        items: [{
                            xtype: "baseset.room.batchroomform",
                            funCode: detCode                  
                        }]
                    }]
                }); 
                tabItem.add(item);  

                //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中）             
                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();
                self.setFormValue(formDeptObj, insertObj);

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);        
    },

    
    
    //增加修改区域
    doDetail: function (btn, cmd) { 
        var self = this;
        var baseGrid = btn.up("basetreegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("panel[xtype=baseset.room.mainlayout]");
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
         var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';
        //处理特殊默认值
        var defaultObj = funData.defaultObj;
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            whereSql: " and isDelete='0' "
        });
        //先确定要选择记录
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length != 1) {
            self.Error("请先选择区域");
            return;
        }
        //当前节点
        var just = records[0].get("id");
        var justName = records[0].get("text");
        var justType = records[0].get("areaType");
        //当前节点的上级节点
        var parent = records[0].get("parent");
        var store = baseGrid.getStore();
        var parentNode = store.getNodeById(parent);
        var parentName = "ROOT";
        var parentType = "01";
        if (parentNode) {
            parentName = parentNode.get("text");
            parentType = parentNode.get("areaType");
        } 
        //当前节点的下级类型
        var childType = "03";
        switch (justType) {
            case "01":
/*
                childType = "02";
                break;
*/
            case "02":
                childType = "03";
                break;
            case "03":
                childType = "04";
                break;
        }
        //根据选择的记录与操作确定form初始化的数据
        var iconCls = "x-fa fa-plus-circle";
        var title = "增加下级区域";
        var operType = cmd;
        switch (cmd) {
            case "child":
                operType = "add";
                if (justType == "04") {
                    self.Error("区域类型为楼层，只能增加同级");
                    return;
                }
                insertObj = Ext.apply(insertObj, {
                    parentNode: just,
                    parentName: justName,
                    uuid: null,
                    areaType: childType,
                    parentType: parentType
                });
                break;
            case "brother":
                title = "增加同级区域";
                if (justType == "01") {
                    self.Error("区域类型为学校，只能增加下级");
                    return;
                }
                operType = "add";
                insertObj = Ext.apply(insertObj, {
                    parentNode: parent,
                    parentName: parentName,
                    uuid: null,
                    areaType: justType,
                    parentType: parentType
                });
                break;
            case "edit":
                iconCls = "x-fa fa-pencil-square";
                operType = "edit";
                title = "修改区域";
                insertObj = records[0].data;
                insertObj = Ext.apply(insertObj, {
                    parentNode: parent,
                    parentName: parentName,
                    uuid: just,
                    nodeText: justName,
                    parentType: parentType
                });
                break;
        }
        var winId = detCode + "_win";
        var win = Ext.getCmp(winId);
        if (!win) {
            win = Ext.create('core.base.view.BaseFormWin', {
                id: winId,
                title: title,
                width: 600,
                height: 400,
                resizable: false,
                iconCls: iconCls,
                operType: operType,
                funData: popFunData,
                funCode: detCode,
                controller:otherController,
                //给form赋初始值
                insertObj: insertObj,
                cmd:operType,
                items: [{
                    xtype: "baseset.room.areadetaillayout"
                }]
            });
        }
        win.show();
        var detailPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detailPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();
        //表单赋值
        self.setFormValue(formDeptObj, insertObj);
    },
    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "roomName", "comparison": ""})
        }
      
        return filter;
    },

    hideFuncBtn:function(grid){        
        if(comm.get("isAdmin")!="1"){
            var menuCode="JWTROOMINFO";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridAdd")==-1){
                var btnAdd = grid.down("button[ref=gridAdd]");
                btnAdd.setHidden(true);
                
             }
             if(userBtn.indexOf(menuCode+"_gridAddBrother")==-1){
                var btnBorAdd = grid.down("button[ref=gridAddBrother]");
                btnBorAdd.setHidden(true);
                
             }
             if(userBtn.indexOf(menuCode+"_gridEdit")==-1){
                var btnEdit = grid.down("button[ref=gridEdit]");
                btnEdit.setHidden(true);
                
             }
             if(userBtn.indexOf(menuCode+"_gridDel")==-1){
                var btnDel = grid.down("button[ref=gridDel]");
                btnDel.setHidden(true);
                
            }
        }
    },
    disabledFuncBtn:function(grid){    
        var basePanel = grid.up("basepanel");
        var basegrid = basePanel.down("basetreegrid[xtype=baseset.room.areagrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnAdd = basegrid.down("button[ref=gridAdd]");
        var btnAddBrother = basegrid.down("button[ref=gridAddBrother]");
        var btnEdit = basegrid.down("button[ref=gridEdit]");
        var btnDel = basegrid.down("button[ref=gridDel]");
        if (records.length == 0) {
            btnAdd.setDisabled(true);
            btnAddBrother.setDisabled(true);
            btnEdit.setDisabled(true);
            btnDel.setDisabled(true);
        } else if (records.length == 1) {
            btnAdd.setDisabled(false);
            btnAddBrother.setDisabled(false);
            btnEdit.setDisabled(false);
            btnDel.setDisabled(false);
        } else {
            btnAdd.setDisabled(true);
            btnAddBrother.setDisabled(true);
            btnEdit.setDisabled(true);
            btnDel.setDisabled(false);
        }
    },

    hideMainFuncBtn:function(grid){    
        if(comm.get("isAdmin")!="1"){
            var menuCode="JWTROOMINFO";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridBatchAdd_Tab")==-1){
                var btnAdd = grid.down("button[ref=gridBatchAdd_Tab]");
                btnAdd.setHidden(true);
                
             }
         }
    },

    loadMainGridStore:function(tree,record){    
        var self = this;
        var mainLayout = tree.up("panel[xtype=baseset.room.mainlayout]");
        var areaType = record.get("areaType");
        var areaId = record.get("id");
        var roomGrid = mainLayout.down("panel[xtype=baseset.room.maingrid]");

        var filter=self.getFastSearchFilter(roomGrid);
        if(areaType=="04")
              filter.push({"type":"string","comparison":"=","value": areaId ,"field":"areaId"});
        if(filter.length==0)
            filter=null;
        else 
            filter = JSON.stringify(filter);

        Ext.apply(mainLayout.funData, {
            areaId: record.get("id"),
            areaType: record.get("areaType"),
            areaName: record.get("text"),
            filter: '[{"type":"string","comparison":"=","value":"' + areaId + '","field":"areaId"}]',
        });

        // 加载对应的房间信息
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

    refreshAreaStore:function(btn){
        var baseGrid = btn.up("basetreegrid");
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams = {
            whereSql: " and isDelete='0' ",
            orderSql: "",
            excludes:"checked"
        };
        store.load(); //刷新父窗体的grid
        var mainlayout = btn.up("basepanel[xtype=baseset.room.mainlayout]");
        var mianGrid = mainlayout.down("basegrid[xtype=baseset.room.maingrid]");
        var store = mianGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.areaId= "";
        proxy.extraParams.areaType= "";
    },

    doDeleteArea:function(btn){
        var self=this;
        var baseGrid = btn.up("basetreegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length == 0) {
            self.Error("请选择要删除的区域");
            return;
        }
        var ids = new Array();
        Ext.each(records, function (rec) {
            var pkValue = rec.get("id");
            var roomCount = rec.get("roomCount");
            var child = rec.childNodes.length;
            //仅能删除无子节点并且无房间的区域
            if (child == 0 && roomCount == 0) {
                ids.push(pkValue);
            }
        });
        var title = "确定要删除所选的区域吗？";
        if (ids.length == 0) {
            self.Warning("所选区域都有子项或房间，不能删除");
            return;
        }
        if (ids.length < records.length) {
            title = "有些区域有子项或房间，仅删除不含子项(房间)的区域，确定吗？";
        }
        Ext.Msg.confirm('警告', title, function (btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                var resObj = self.ajax({
                    url: comm.get('baseUrl') + "/BaseRoomarea/doDelete",
                    params: {
                        ids: ids.join(","),
                        pkName: pkName
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
    },

    doDeleteRoom:function(btn){
        var self=this;
        var grid = btn.up("panel[xtype=baseset.room.maingrid]");
        var rows = grid.getSelectionModel().getSelection();
        
        for (var i = 0; i < rows.length; i++) {
            var areaStatu = rows[i].get('areaStatu');
            if (areaStatu == 1) {
                self.Warning("已定义或分配的房间不能删除！");
                return false;
            }
        }
        return true;
    }
});