Ext.define("core.basedevice.irdevice.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.irdevice.maincontroller',
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
        "basetreegrid[xtype=basedevice.irdevice.irbrandtreegrid]": {
                /*
                    当点击了这个树的子项后，在查询列表的条件中，要做如下工作：
                    1. 附带树节点的相关参数
                    2. 当存在basegrid的默认参数，则附带上去
                    3. 附带快速搜索中的参数（为了防止文本框的数据与实际查询的数据不一致，所以在下面代码中主动获取了文本框的数据）
                    4. reset清除高级搜索中的条件数据 以及 proxy.extraParams中的相关数据
                */
                itemclick: function(tree, record, item, index, e, eOpts) {                   
                    this.loadMainGridStore(tree,record);   
                    return false;
               }
           },
          "basepanel basetreegrid[xtype=basedevice.irdevice.irbrandtreegrid]": {
                  afterrender : function(grid) {
                    this.hideFuncBtn(grid);                
                 },
                 beforeitemclick: function(grid) {
                    this.disabledFuncBtn(grid);
                },
            },
    	 //品牌列表增加下级按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridAdd]": {
            click: function (btn) {
            	this.doDetail(btn, "child");
            }
        },
        
        //品牌列表增加同级按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridAddBrother]": {
            click: function (btn) {
            	this.doDetail(btn, "brother");
            }
        },
        
        //品牌列表修改按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridEdit]": {
            click: function (btn) {
            	this.doDetail(btn, "edit");
            }
        },
    	
        //品牌列表删除按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridDel]": {
            click: function (btn) {
            	this.doDelete(btn, "delete");
            }
        },
        
        //品牌列表刷新按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridRefresh]": {
        	click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore().load();
                var mainlayout = btn.up("basepanel[xtype=basedevice.irdevice.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=basedevice.irdevice.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.brandId="";
                proxy.extraParams.level="";
                return false;
            }
        },
        
    	//设备列表增加事件
    	"basegrid[xtype=basedevice.irdevice.maingrid] button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {
           	 this.doirdevice_Tab(btn,"add");
                return false;
            }
        },
        
        //设备列表编辑事件
        "basegrid[xtype=basedevice.irdevice.maingrid] button[ref=gridEdit_Tab]": {
            beforeclick: function(btn) {
           	 this.doirdevice_Tab(btn,"edit");
                return false;
            }
        },
    	"basegrid[xtype=basedevice.irdevice.maingrid] button[ref=gridExport]": {
                beforeclick: function(btn) {
                    this.doExportExcel(btn);
                    return false;
                }
         },
       
        //红外设备列表操作列事件
        "basegrid  actioncolumn": {
            //操作列编辑
            editClick_Tab: function (data) {
                this.doirdevice_Tab(null, "edit", data.view, data.record);
                return false;
            },
            
            //操作列详细
            detailClick_Tab: function (data) {
                this.doirdevice_Tab(null, "detail", data.view, data.record);
                return false;
            },
        }
        
    },
    
    /*
     * 设备列表增加编辑事件（MainGrid）
     */
    doirdevice_Tab:function(btn,cmd,grid,record){
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
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel
        var treeGrid = basePanel.down("panel[xtype=basedevice.irdevice.irbrandtreegrid]");  //获取左侧品牌
        
        var rows = treeGrid.getSelectionModel().getSelection();
        if(cmd=="add"){
           if (rows.length <= 0) {
            self.msgbox("请先选择品牌");
            return ;
        } else if (rows[0].get('level') != 3) {
            self.msgbox("只能选择品牌");
            return ;
          }
        var id = rows[0].get('id');
        var name = rows[0].get('text');
        var level = rows[0].get('level') + 1;

       };
        
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
            grid: baseGrid,
            //filter: "[{'type':'string','comparison':'=','value':'" + id + "','field':'parentNode'}]"
        });

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
                

                insertObj = recordData;
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                //处理编辑事件表单返回页面的值
                insertObj = Ext.apply(insertObj, {
                    parentNode: recordData.parentNode,
                    level: recordData.level,
                    uuid: recordData.uuid,
                    brandname: recordData.brandname,
                    productModel: recordData.productModel,
                    notes: recordData.notes,
                });
                
                tabTitle = funData.tabConfig.editTitle;
                tabItemId=funCode+"_gridEdit"; 
                break;
            case "detail":
            	//本方法只提供班级详情页使用
                var tabTitle = funData.tabConfig.detailTitle;
                //设置tab页的itemId
                var tabItemId=funCode+"_gridDetail";     //命名规则：funCode+'_ref名称',确保不重复
                insertObj = recordData;
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                //处理编辑事件表单返回页面的值
                insertObj = Ext.apply(insertObj, {
                    parentNode: recordData.parentNode,
                    level: recordData.level,
                    uuid: recordData.uuid,
                    brandname: recordData.brandname,
                    productModel: recordData.productModel,
                    notes: recordData.notes,
                });
                var itemXtype=[{
                    xtype:"basedevice.irdevice.detailhtml",                        
                    funCode: detCode             
                }];

                break;
            case "add":
                if (btn) {
                  
                insertObj = Ext.apply(insertObj, {
                         parentNode: id,
                         level: level,
                         uuid: null,
                         brandname: name,
                     });
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
               
                if(cmd=="detail"){
                	 var detailHtml = item.down("container[xtype=basedevice.irdevice.detailhtml]");
                     detailHtml.setData(insertObj);
                 }else{
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
    
    //增加修改区域
    doDetail: function (btn, cmd) {
        var self = this;
        var baseGrid = btn.up("basetreegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("panel[xtype=basedevice.irdevice.mainlayout]");
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
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
            self.msgbox("请先选择区域");
            return;
        }
        //当前节点
        var just = records[0].get("id");
        var justName = records[0].get("text");
        var justType = records[0].get("level");
        //当前节点的上级节点
        var parent = records[0].get("parent");
        var store = baseGrid.getStore();
        var parentNode = store.getNodeById(parent);
        var parentName = "ROOT";
        var parentType = 1;
        if (parentNode) {
            parentName = parentNode.get("text");
            parentType = parentNode.get("level");
        }
        //当前节点的下级类型
        var childType = 2;
        switch (justType) {
            case 1:
                childType = 2;
                break;
            case 2:
                childType = 3;
                break;
        }
        //根据选择的记录与操作确定form初始化的数据
        var iconCls = "x-fa fa-plus-circle";
        var title = "增加下级区域";
        var operType = cmd;
        switch (cmd) {
            case "child":
                operType = "add";
                if (justType == 3) {
                    self.msgbox("无法添加品牌以下的子节点");
                    return;
                }
                insertObj = Ext.apply(insertObj, {
                    upbrandname: justName,
                    parentNode: just,
                    uuid: null,
                    level: childType,
                });
                break;
            case "brother":
                title = "增加同级区域";
                if (justType == 1) {
                    self.msgbox("区域类型为所有，只能增加下级");
                    return;
                }
                operType = "add";
                insertObj = Ext.apply(insertObj, {
                    parentNode: parent,
                    upbrandname: parentName,
                    uuid: null,
                    level: justType,
                });
                break;
            case "edit":
                iconCls = "table_edit";
                operType = "edit";
                title = "修改区域";
                insertObj = records[0].data;
                insertObj = Ext.apply(insertObj, {
                    parentNode: parent,
                    upbrandname: parentName,
                    uuid: just,
                    brandname: justName,
                });
                break;
        }
      
        var win = Ext.create('core.base.view.BaseFormWin', {
            title: title,
            width: 400,
            height: 300,
            iconCls: iconCls,
            operType: operType,
            funData: popFunData,
            funCode: detCode,
            insertObj: insertObj,
            items: [{
                xtype: "basedevice.irdevice.branddetaillayout"
            }]
            });
        win.show();
        var detailPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detailPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();
        //表单赋值
        self.setFormValue(formDeptObj, insertObj);
    },
    
    //品牌列表删除事件
    doDelete: function (btn, cmd) {
    	var self = this;
        var mainlayout = btn.up('panel[xtype=basedevice.irdevice.mainlayout]');
        var baseGrid = btn.up("basetreegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var grid = basePanel.down('panel[xtype=basedevice.irdevice.maingrid]');
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length == 0) {
            self.Error("请选择要删除的数据");
            return;
        }
        if(records[0].get('level')==1){
            self.Error("根节点无法删除");
            return false;
        }
        var ids = new Array();
        Ext.each(records, function(rec) {
            var pkValue = rec.get("id");
            var count = grid.getStore().getCount();
            var child = rec.childNodes.length;
            //仅能删除无子节点并且无房间的区域
            if (child == 0 && count == 0) {
                ids.push(pkValue);
            }
        });
        var title = "确定要删除所选的品牌类型吗？";
        if (ids.length == 0) {
            self.Warning("所选品牌类型都有子项，不能删除");
            return;
        }
        if (ids.length < records.length) {
            title = "有些品牌类型有子项，仅删除不含品牌类型的数据。确定吗？";
        }
        Ext.Msg.confirm('警告', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                var resObj = self.ajax({
                    url: comm.get('baseUrl') + "/BasePtIrDeviceBrand/doDelete",
                    params: {
                        ids: ids.join(","),
                        pkName: pkName
                    }
                });
                if (resObj.success) {
                    baseGrid.getStore().load(0);
                    self.msgbox(resObj.obj);
                } else {
                    self.Error(resObj.obj);
                }
            }
        });
        //执行回调函数
        if (btn.callback) {
            btn.callback();
        }
        return false;
    },
     doExportExcel:function(btn) {
            var self = this;
            var baseGrid = btn.up("basegrid");
            var toolBar = btn.up("toolbar");
            if (!toolBar)
            return false;
            var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
            var productModel = "";
            if(girdSearchTexts[0].getValue()!=null){
                productModel = girdSearchTexts[0].getValue();
            }
            var mainLayout = baseGrid.up("basepanel[xtype=basedevice.irdevice.mainlayout]")
            var mianGrid = mainLayout.down("panel[xtype=basedevice.irdevice.maingrid]");
            var proxy = mianGrid.getStore().getProxy();
            var brandId = proxy.extraParams.brandId;
            var level =  proxy.extraParams.level;
            if(brandId==undefined){
               brandId="";
            }
            if(level==undefined){
               level="";
            }
            var title = "确定要导出红外设备的信息吗？";
            Ext.Msg.confirm('提示', title, function (btn, text) {
                if (btn == "yes") {
                    Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                    var component = Ext.create('Ext.Component', {
                        title: 'HelloWorld',
                        width: 0,
                        height: 0,
                        hidden: true,
                        html: '<iframe src="' + comm.get('baseUrl') + '/BasePtIrDeviceBrand/doExportExcel?productModel='+productModel+'&brandId='+brandId+'&level='+level+'"></iframe>',
                        renderTo: Ext.getBody()
                    });

                    var time = function () {
                        self.syncAjax({
                            url: comm.get('baseUrl') + '/BasePtIrDeviceBrand/checkExportEnd',
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
                var menuCode="IRDEVICE";     // 此菜单的前缀
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
            var basegrid = basePanel.down("basetreegrid[xtype=basedevice.irdevice.irbrandtreegrid]");
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

        loadMainGridStore:function(tree,record){
            var mainLayout = tree.up("panel[xtype=basedevice.irdevice.mainlayout]");
            var funData = mainLayout.funData;
            var brandId=record.get("id");
            var level = record.get("level");
            var mianGrid = mainLayout.down("panel[xtype=basedevice.irdevice.maingrid]");
            mainLayout.funData = Ext.apply(funData, {
                brandId: brandId,
            });
            var girdSearchTexts = mianGrid.query("field[funCode=girdFastSearchText]");
            var filter=new Array();
            if(girdSearchTexts[0].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "productModel", "comparison": ""})
            }
            if(filter.length==0)
                filter=null;
            else
                filter = JSON.stringify(filter);
            // 加载品牌信息
    
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams={
                brandId:brandId,
                level:level,
                filter:filter
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    
});