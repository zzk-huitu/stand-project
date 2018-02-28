Ext.define("core.system.menu.controller.MainController", {
	extend: "Ext.app.ViewController",
	mixins: {
		suppleUtil: "core.util.SuppleUtil",
		messageUtil: "core.util.MessageUtil",
		formUtil: "core.util.FormUtil",
		treeUtil: "core.util.TreeUtil",
		gridActionUtil: "core.util.GridActionUtil"
	},
	
	alias: 'controller.system.menu.maincontroller',
   
	
	init: function() {
		var self = this;

        this.control({
       
          	"basepanel basetreegrid[xtype=system.menu.menutree]": {

          		/*在界面渲染之后，根据权限数据，来隐藏没有权限的按钮*/
            	afterrender : function(grid) {
            		this.hideFuncBtn(grid);            	
	                return false;
	            },
         	
         		/*通过点击列项，设置按钮是否可用*/
				beforeitemclick: function(grid) {
					this.disabledFuncBtn(grid);				
					return false;
				}
            },

        	//刷新按钮事件
			"panel[xtype=system.menu.menutree] button[ref=gridRefresh]": {
				beforeclick: function(btn) {
					this.refreshTree(btn);				
					return false;
				}
			},
			
			//添加下级按钮
        	"basetreegrid button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"child");
                    return false;
                }
            },
            
            //添加同级按钮
            "basetreegrid button[ref=gridAddBrother_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"brother");
                    return false;
                }
            },
            //修改按钮
            "basetreegrid button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn,"edit");
                    return false;
                }
            },
			
			//启用菜单事件
			"panel[xtype=system.menu.menutree] button[ref=gridUnLock]": {
				beforeclick: function(btn) {
					self.doLockOrUnlock(btn,"0");
					return false;
				}
			},
			//锁定菜单事件
			"panel[xtype=system.menu.menutree] button[ref=gridLock]": {
				beforeclick: function(btn) {
					self.doLockOrUnlock(btn,"1");
					return false;
				}
			},	
		
		});
       
    	
	},
    
	//增加修改菜单
	doDetail_Tab:function(btn, cmd, grid, record) {
        var self = this;
        var baseGrid = btn.up("basetreegrid");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");

        //得到配置信息
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");

        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
     
      
        var insertObj = self.getDefaultValue(defaultObj);
        var records = baseGrid.getSelectionModel().getSelection();
		if (records.length != 1) {
			self.msgbox("请先选择菜单");
			return;
		}
		//当前节点
		var just = records[0].get("id");
		var justName = records[0].get("text");

		//当前节点的上级节点
		var parent = records[0].get("parent");
		var store = baseGrid.getStore();
		var parentNode = store.getNodeById(parent);
		var parentName = "ROOT";
		if (parentNode)
			parentName = parentNode.get("text");
        
		//根据选择的记录与操作确定form初始化的数据
		var iconCls = "x-fa fa-plus-square";
		var title = "增加下级菜单";
		var operType = cmd;
		var pkValue=null;
      	//设置tab页的itemId
        var tabItemId = funCode + "_gridAdd";     //命名规则：funCode+'_ref名称',确保不重复

		switch (cmd) {
			case "child":
				iconCls = "x-fa fa-plus-square";
				operType = "add";
				Ext.apply(insertObj, {
					parentNode: just,
					parentName: justName,
					uuid: ''
				});
				break;
			case "brother":
				tabItemId= funCode + "_gridAddBrother";
				title = "增加同级菜单";
				iconCls = "x-fa fa-plus-square-o";
				operType = "add";
				Ext.apply(insertObj, {
					parentNode: parent,
					parentName: parentName,
					uuid: ''
				});
				break;
			case "edit":
				tabItemId= funCode + "_gridEdit";
				iconCls = "x-fa fa-pencil-square";
				operType = "edit";
				title = "编辑菜单";
                
                insertObj = records[0].getData();
				Ext.apply(insertObj, {
					parentNode: parent,
					parentName: parentName,
					uuid: just,
					nodeText: justName
				});

				//获取主键值
                var pkName = funData.pkName;
                pkValue = insertObj[pkName];
				break;
		}
		
        //关键：window的视图控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem = tabPanel.getComponent(tabItemId);

        if (!tabItem) {
            var tabTitle = title;

            tabItem = Ext.create({
                xtype: 'container',
                title: tabTitle,
                scrollable: true,
                itemId: tabItemId,
                layout: 'fit',
                itemPKV: pkValue,      //保存主键值
            });
            tabPanel.add(tabItem);

            //延迟放入到tab中
            setTimeout(function () {
                //创建组件
                var item = Ext.widget("baseformtab", {
                    operType: 'add',
                    controller: otherController,         //指定重写事件的控制器
                    funCode: funCode,                    //指定mainLayout的funcode
                    detCode: detCode,                    //指定detailLayout的funcode
                    tabItemId: tabItemId,                //指定tab页的itemId
                    insertObj: insertObj,                //保存一些需要默认值，提供给提交事件中使用
                    funData: popFunData,                //保存funData数据，提供给提交事件中使用
                    items: [{
                        xtype: detLayout
                    }]
                });
                tabItem.add(item);

                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();

                self.setFormValue(formDeptObj, insertObj);

            }, 30);

        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);

    },


	//锁定或解锁菜单
	doLockOrUnlock: function(btn, cmd) {
		var self = this;
		var tree = btn.up("panel[xtype=system.menu.menutree]");
		
		var records = tree.getSelectionModel().getSelection();
		if (records.length <= 0) {
			self.msgbox("请选择要处理的菜单!");		
			return false;
		}

		//显示loadMask
		var myMask = self.LoadMask(tree);

		var ids = new Array();
		Ext.each(records, function(rec) {
			var pkValue = rec.get("id");
			ids.push(pkValue);
		}, this);

		//提交入库
		self.asyncAjax({
            url: comm.get('baseUrl') + "/SysMenu/doSetLockFlag",
			params: {
				ids: ids.join(","),
				lockFlag:cmd
			},
			//loadMask:true,
            //回调代码必须写在里面
            success: function(response) {
				data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

				if (data.success) {	
					//静态的更新数据
					Ext.each(records, function(rec) {
						rec.set("isHidden",cmd);	//改变数据
						rec.commit();	//提交一下 
					}, this);
										
					self.msgbox(data.obj);		
				}else{
					self.Error(data.obj);	
				}
				myMask.hide();
			},
			failure: function(response) {			
				Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);			
				myMask.hide();
			}
        });             
	},

	hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="MENUMANAGE";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
                var btnAdd = grid.down("button[ref=gridAdd_Tab]");
                btnAdd.setHidden(true);                        
            }
            if(userBtn.indexOf(menuCode+"_gridAddBrother_Tab")==-1){
                var btnAddBro = grid.down("button[ref=gridAddBrother_Tab]");
                btnAddBro.setHidden(true);
            }
            if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                var btnEdit = grid.down("button[ref=gridEdit_Tab]");
                btnEdit.setHidden(true);
            }
            if(userBtn.indexOf(menuCode+"_gridUnLock")==-1){
                var btnUnLock = grid.down("button[ref=gridUnLock]");
                btnUnLock.setHidden(true);
            }
            if(userBtn.indexOf(menuCode+"_gridLock")==-1){
                var btnLock = grid.down("button[ref=gridLock]");
               	btnLock.setHidden(true);
            }
        }
	},

	disabledFuncBtn:function(grid){
		var basePanel = grid.up("basepanel");
		var funCode = basePanel.funCode;
		var basegrid = basePanel.down("basetreegrid[funCode=" + funCode + "]");
		var records = basegrid.getSelectionModel().getSelection();
		var btnEdit = basegrid.down("button[ref=gridEdit_Tab]");
		var btnAdd = basegrid.down("button[ref=gridAdd_Tab]");
		var btnAddBrother = basegrid.down("button[ref=gridAddBrother_Tab]");
		var btnUnLock = basegrid.down("button[ref=gridUnLock]");
		var btnLock = basegrid.down("button[ref=gridLock]");
		if (records.length == 0) {
			btnEdit.setDisabled(true);
			btnAdd.setDisabled(true);
			btnAddBrother.setDisabled(true);
			btnUnLock.setDisabled(true);
			btnLock.setDisabled(true);
		} else if (records.length == 1) {
			btnEdit.setDisabled(false);
			btnAdd.setDisabled(false);
			btnAddBrother.setDisabled(false);
			btnUnLock.setDisabled(false);
			btnLock.setDisabled(false);
		} else {
			btnEdit.setDisabled(true);
			btnAdd.setDisabled(true);
			btnAddBrother.setDisabled(true);
			btnUnLock.setDisabled(false);
			btnLock.setDisabled(false);
		}
	},

	refreshTree:function(btn){
		var baseGrid = btn.up("basetreegrid");
		var funCode = baseGrid.funCode;
		var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
		var funData = basePanel.funData;
		var store = baseGrid.getStore();
		// var proxy = store.getProxy();
		// proxy.extraParams = {
		// 	whereSql: funData.whereSql,
		// 	orderSql: funData.orderSql
		// };
		store.load(); //刷新父窗体的grid
	}

});