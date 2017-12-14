Ext.define("core.system.role.controller.MainController", {
    extend: "Ext.app.ViewController",
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },

  
    alias: 'controller.system.role.maincontroller',

  
    init: function() {
        var self = this
            //事件注册
        this.control({ 
             "basepanel basegrid[xtype=system.role.maingrid]": {
               afterrender : function(grid) {
                if(comm.get("isAdmin")!="1"){
                    var menuCode="SYSROLE";     // 此菜单的前缀
                    var userBtn=comm.get("userBtn");
                    if(userBtn.indexOf(menuCode+"_gridJobUser_Tab")==-1){
                        var btnlock = grid.down("button[ref=gridJobUser_Tab]");
                        btnlock.setHidden(true);

                    }
                 }
                },

             },
            "basegrid button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"add");
                    return false;
                }
            },

            "basegrid button[ref=gridJobUser_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"jobUser");
                    return false;
                }
            },

            "basegrid[xtype=system.role.maingrid] button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"edit");
                    return false;
                }
            },

            "basegrid button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    
                    var baseGrid=btn.up("basegrid");                
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return false;
                    }
                    recordData = rescords[0].data;
                    if(recordData.uuid=='8a8a8834533a0f8a01533a0f8e220000' ||recordData.roleName=="超级管理员"){
                        self.msgbox("不允许删除超级管理员角色！");
                        return false;
                    }
                    if(recordData.issystem==1){
                        self.msgbox("不允许删除系统角色！");
                        return false;
                    }
                   
                }
            },

            "basegrid[xtype=system.role.maingrid]  actioncolumn": {
                editClick_Tab:function(data){
                    var baseGrid=data.view;
                    var record=data.record;

                    this.doDetail_Tab(null,"edit",baseGrid,record);

                    return false;
                },
                jobUserClick_Tab:function(data){
                    var baseGrid=data.view;
                    var record=data.record;

                    this.doDetail_Tab(null,"jobUser",baseGrid,record);

                    return false;
                },
                detailClick_Tab: function (data) {
                    this.doDetail_Tab(null, "detail", data.view, data.record);
                    return false;
                },
                editClick: function(data) {
                    var baseGrid=data.view;
                    var record=data.record;

                    this.doDetail(null,"edit",baseGrid,record);

                    return false;
                },
                detailClick: function(data) {
                    console.log(data);

                },
                deleteClick: function(data) {  
                    var self=this;
                               
                    var record=data.record;
                    if(record.get("issystem")==1){
                        self.Info("系统角色，不允许被删除！");
                        return false;
                    }
                }
            }
        })
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
            recordData = record.getData();
        }


        //得到组件
        var funCode = baseGrid.funCode; //creditrule_main
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
        var xItemType=[{
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

                if(recordData.issystem==1){
                    self.msgbox("不允许编辑系统角色！");
                    return;
                }

                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                insertObj = recordData;
                tabTitle =  recordData[funData.tabConfig.titleField]+"-"+funData.tabConfig.detailTitle;
                tabItemId=funCode+"_gridEdit"; 
                break;
            case "detail":                
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
                tabTitle =  recordData[funData.tabConfig.titleField]+"-"+funData.tabConfig.detailTitle;
                tabItemId=funCode+"_gridDetail"+pkValue; 
                xItemType = [{
                    xtype:detLayout,                        
                    funCode: detCode,
                    items: [{
                        xtype: "system.role.detailhtml",
                        funCode: detCode                  
                    }]
                }]
                break;
            case "jobUser":                
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }
                //获取主键值
                insertObj = recordData;
                var pkName = funData.pkName;
                pkValue= recordData[pkName];            
                tabTitle =  recordData[funData.tabConfig.titleField]+"-"+funData.tabConfig.detailTitle;
                tabItemId=funCode+"_gridJobUser"+pkValue; 
                operType="detail";
                xItemType=[{
                    xtype:detLayout,                        
                    funCode: detCode,
                    items: [{
                        xtype: "system.role.roleusergrid",
                        funCode: detCode                  
                    }]
                }]
                popFunData = Ext.apply(popFunData, {
                    roleId: pkValue,
                    roleName:recordData[funData.tabConfig.titleField]
                });
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
                    items:xItemType
                }); 
                tabItem.add(item);  

                if(cmd=="jobUser"){
                    var grid = item.down("grid[xtype=system.role.roleusergrid]");
                    var store = grid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams = {
                        roleId: pkValue
                    };
                    store.load();

                }else if(cmd=="detail"){
                    var roleInfoContainer = tabItem.down("container[ref=roleInfo]");
                    roleInfoContainer.setData(insertObj);
                    self.asyncAjax({
                        url: comm.get("baseUrl") + "/SysRole/roleUserList",
                        params: {
                            page: 1,
                            start: 0,
                            limit: 0,
                            roleId: insertObj.uuid
                        },
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            var roleUserContainer = tabItem.down("container[ref=roleUser]");
                            roleUserContainer.setData(data);
                        }
                    });

                }else{
                    //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中）             
                    var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                    var formDeptObj = objDetForm.getForm();
                    self.setFormValue(formDeptObj, insertObj);

                    if(cmd=="detail"){
                        self.setFuncReadOnly(funData, objDetForm, true);
                    }
                }
                
            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);        
    },
    
    
});