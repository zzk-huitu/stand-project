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
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridDelete]": {
            click: function (btn) {
            	this.doDelete(btn, "delete");
            }
        },
        
        //品牌列表刷新按钮事件
        "panel[xtype=basedevice.irdevice.irbrandtreegrid] button[ref=gridRefresh]": {
        	click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore().load();
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
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel
        
        //获取左侧品牌
        var treeGrid = basePanel.down("panel[xtype=basedevice.irdevice.irbrandtreegrid]");
        var rows = treeGrid.getSelectionModel().getSelection();
        if (rows.length <= 0) {
            self.Error("请先选择品牌");
            return false;
        } else if (rows[0].get('level') != 3) {
            self.Error("只能选择品牌");
            return false;
        }
        var id = rows[0].get('id');
        var name = rows[0].get('text');
        var level = rows[0].get('level') + 1;
        
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
            filter: "[{'type':'string','comparison':'=','value':'" + id + "','field':'parentNode'}]"
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
                    parentNode: id,
                    level: level,
                    uuid: recordData.uuid,
                    brandname: name,
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
                    parentNode: id,
                    level: level,
                    uuid: recordData.uuid,
                    brandname: name,
                    productModel: recordData.productModel,
                    notes: recordData.notes,
                });
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
               
                //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中） 
                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();
                self.setFormValue(formDeptObj, insertObj);
                
                if(cmd=="detail"){
                	objDetForm.down("basetreefield[name=brandname]").setDisabled(true);
                	self.setFuncReadOnly(funData, objDetForm, true);
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
            self.Error("请先选择区域");
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
        var iconCls = "table_add";
        var title = "增加下级区域";
        var operType = cmd;
        switch (cmd) {
            case "child":
                operType = "add";
                if (justType == 3) {
                    self.Error("无法添加品牌以下的子节点");
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
                    self.Error("区域类型为所有，只能增加下级");
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
        var winId = detCode + "_win";
        var win = Ext.getCmp(winId);
        if (!win) {
            win = Ext.create('core.base.view.BaseFormWin', {
                id: winId,
                title: title,
                width: 400,
                height: 300,
                resizable: false,
                iconCls: iconCls,
                operType: operType,
                funData: popFunData,
                funCode: detCode,
                //给form赋初始值
                insertObj: insertObj,
                items: [{
                    xtype: "basedevice.irdevice.branddetaillayout"
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
    }
    
});