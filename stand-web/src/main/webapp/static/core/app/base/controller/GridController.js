/**
 * 表格控制器
 */
Ext.define("core.base.controller.GridController", {
	extend: "Ext.app.Controller",
	requires:[
		"Ext.ux.ComboPageSize",
	],
	initGrid: function() {
		var self = this;
		var gridCtr = {
            "basepanel basegrid basequeryform": {
                /**
                 * zzk 2014-4-5加入，同时在FormController中是公共高级查询功能生效
                 * 表格的高级查询表单的render事件
                 */
                render: function(view) {
                    var basePanel = view.up("basepanel");
                    if (basePanel) {
                        var funCode = basePanel.funCode;
                        view.funCode = funCode;                      
                    }
                }
            },
			"basepanel basegrid": {
				/**
				 * 表格的render事件
				 */
				render: function(grid) {
					var basePanel = grid.up("basepanel");
					//改动，为单用baseGrid的时候规划数据字典显示
					if (basePanel) {
						var funCode = basePanel.funCode;
						grid.funCode = funCode;
						//grid.itemId = funCode + "_basegrid";
						//暂时放到这里赋值
						//basePanel.itemId=funCode+"_basepanel";
					}

                    this.hideBtn(grid);

				},
				
				/**
				 * 表格单击事件
				 */
				beforeitemclick: function(grid, record, item, index, e, eOpts) {
					var basePanel = grid.up("basepanel");
					var funCode = basePanel.funCode;
					var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
					var records = baseGrid.getSelectionModel().getSelection();
					var btnEdit = baseGrid.down("button[ref=gridEdit]");
					var btnDelete = baseGrid.down("button[ref=gridDelete]");
					var btnDetail = baseGrid.down("button[ref=gridDetail]");
					
                    var btnEdit_Tab = baseGrid.down("button[ref=gridEdit_Tab]");
                    var btnDetail_Tab = baseGrid.down("button[ref=gridDetail_Tab]");


					if (records.length == 0) {
						if (btnEdit)
							btnEdit.setDisabled(true);
						if (btnDelete)
							btnDelete.setDisabled(true);
						if (btnDetail)
							btnDetail.setDisabled(true);

                        if (btnEdit_Tab)
                            btnEdit_Tab.setDisabled(true);
                        if (btnDetail_Tab)
                            btnDetail_Tab.setDisabled(true);

					} else if (records.length == 1) {
						if (btnEdit)
							btnEdit.setDisabled(false);
						if (btnDelete)
							btnDelete.setDisabled(false);
						if (btnDetail)
							btnDetail.setDisabled(false);

                        if (btnEdit_Tab)
                            btnEdit_Tab.setDisabled(false);
                        if (btnDetail_Tab)
                            btnDetail_Tab.setDisabled(false);
                        
					} else {
						if (btnEdit)
							btnEdit.setDisabled(true);
						if (btnDelete)
							btnDelete.setDisabled(false);
						if (btnDetail)
							btnDetail.setDisabled(true);

                        if (btnEdit_Tab)
                            btnEdit_Tab.setDisabled(true);
                        if (btnDetail_Tab)
                            btnDetail_Tab.setDisabled(true);
					}
					//console.log(1231);
				}
			},
			"basepanel basetreegrid": {
				render: function(grid) {
					var basePanel = grid.up("basepanel");
					if (basePanel) {
						var funCode = basePanel.funCode;
						grid.funCode = funCode;
						//grid.itemId = funCode + "_basetreegrid";
					}
				},
				/**
				 * 表格单击事件
				 */
				itemclick: function(grid, record, item, index, e, eOpts) {
					var basePanel = grid.up("basepanel");
					var funCode = basePanel.funCode;
					var baseGrid = basePanel.down("basetreegrid[funCode=" + funCode + "]");
					var records = baseGrid.getSelectionModel().getSelection();
					var btnEdit = baseGrid.down("button[ref=gridEdit_Tab]");
					//alert(btnEdit);
					if (!btnEdit) {
						return;
					}

					//因为树形图维护时可能有同级节点或下级节点增加，但操作时一定要先选择个节点
					var btnAdd = baseGrid.down("button[ref=gridAdd_Tab]");
					if (!btnAdd) {
						return;
					}
					var btnAddBrother = baseGrid.down("button[ref=gridAddBrother_Tab]");
					if (!btnAddBrother) {
						return;
					}
					var btnDelete = baseGrid.down("button[ref=gridDelete]");
					if (!btnDelete) {
						return;
					}
					if (records.length == 0) {
						btnEdit.setDisabled(true);
						btnAdd.setDisabled(true);
						btnAddBrother.setDisabled(true);
						btnDelete.setDisabled(true);
					} else if (records.length == 1) {
						btnEdit.setDisabled(false);
						btnAdd.setDisabled(false);
						btnAddBrother.setDisabled(false);
						btnDelete.setDisabled(false);
					} else {
						btnEdit.setDisabled(true);
						btnAdd.setDisabled(true);
						btnAddBrother.setDisabled(true);
						btnDelete.setDisabled(false);
					}
				}
			},

			/**
             * 操作列的操作事件
             */
            "basegrid actioncolumn": {
            	editClick: function(data) {
                    this.openDetail_Win_Column(data.view,data.record,"edit");        
                },
                detailClick: function(data) {
                    this.openDetail_Win_Column(data.view,data.record,"detail");                
                },              
                deleteClick:function(data){
                    this.doDeleteRecords_Column(data.view,data.record,data.msg);
                },

                //弹出tab页的方式
                editClick_Tab: function(data) {
                    this.openDetail_Tab_Column(data.view,data.record,"edit");        
                },
                 //弹出tab页的方式
                detailClick_Tab: function(data) {
                    this.openDetail_Tab_Column(data.view,data.record,"detail");
                },
            },
		}
		Ext.apply(self.ctr, gridCtr);
	},

    openDetail_Tab_Column:function(grid, record,cmd) {
        var self = this;
        var baseGrid=grid;

        //获取组件相关信息
        var moduleInfo = self.getModuleInfo(baseGrid);
        
        //获取Tab相关数据
        var funData=moduleInfo.funData;
        var tabInfo = self.getTabInfo(moduleInfo.funCode,funData.pkName,funData.tabConfig,null,null,cmd,record);

        if(tabInfo==null)
            return;

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabPanel=moduleInfo.tabPanel;
        var tabItem=tabPanel.getComponent(tabInfo.tabItemId);
        if(!tabItem){

            //创建tabItem
            tabItem = self.createTabItem(tabInfo);
            
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){

                //创建tab内部组件                
                var item = self.createBaseFormTab(baseGrid,moduleInfo,tabInfo);               
                tabItem.add(item);  
                
                //处理打开界面之后，显示的初始数据
                self.doInitFormValue(item,cmd);

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=tabInfo.pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);   

    },
    openDetail_Win_Column:function(grid,record,cmd){
        var self=this;
        //得到组件
        var baseGrid = grid ;
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");

        //得到配置信息
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';    
        
        //获取数据
        var insertObj = record.getData();

        var iconCls= '';
        if(cmd=="edit")
             iconCls= 'x-fa fa-pencil-square';
        else 
             iconCls= 'x-fa fa-file-text';
        
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });
        var width = 1000;
        var height = 650;
        if (funData.width)
            width = funData.width;
        if (funData.height)
            height = funData.height;

        var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls: iconCls,
            operType: cmd,
            width: width,
            height: height,
            controller: otherController,
            funData: popFunData,
            funCode: detCode,
            insertObj: insertObj,
            items: [{
                xtype: detLayout
            }]
        });
        win.show();

        var detPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();

        self.setFormValue(formDeptObj, insertObj);

        if(cmd=="detail")
            self.setFuncReadOnly(funData, objDetForm, true);
    },
    doDeleteRecords_Column:function(grid,record,msg){
        var self=this;
        //得到组件
        var baseGrid = grid;
        var record=record;
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                         
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        
        if(!msg)
            msg='是否删除数据?';

        Ext.Msg.confirm('提示', msg , function (btn, text) {
            if (btn == 'yes') {            

                var loading = new Ext.LoadMask(baseGrid, {
                    msg: '正在提交，请稍等...',
                    removeMask: true// 完成后移除
                });
                loading.show();

                self.asyncAjax({
                    url: funData.action + "/doDelete",
                    params: {
                        ids: record.get(pkName),
                        pkName: pkName
                    },                    
                    success: function(response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if(data.success){

                            baseGrid.getStore().remove(record); //不刷新的方式
                            self.msgbox(data.obj);

                            // //如果当前页的数据量和删除的数据量一致，则翻到上一页
                            // if(store.getData().length==rescords.length&&store.currentPage>1){    
                            //     store.loadPage(store.currentPage-1);
                            // }else{
                            //     store.load();
                            // }
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
    },
    hideBtn:function(grid){
        //如果此值为1，则表明此人是超级管理员，不需要进行验证
        if(comm.get("isAdmin")!="1"){
            var menuCode=grid.menuCode;     // 此菜单的前缀
            if(menuCode){
                var userBtn=comm.get("userBtn");
                if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
                    var btnAdd = grid.down("button[ref=gridAdd_Tab]");
                   if(btnAdd){
                       btnAdd.setHidden(true);
                     } 
                }
                if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                    var btnEdit = grid.down("button[ref=gridEdit_Tab]");
                    if(btnEdit){
                        btnEdit.setHidden(true);
                    }
                   
                }
                if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                    var btnDelete = grid.down("button[ref=gridDelete]");
                    if(btnDelete){
                        btnDelete.setHidden(true);
                    }
                  
                }
                if(userBtn.indexOf(menuCode+"_gridAdd")==-1){
                    var btnAdd = grid.down("button[ref=gridAdd]");
                     if(btnAdd){
                       btnAdd.setHidden(true);
                    }
                    
                }
                if(userBtn.indexOf(menuCode+"_gridEdit")==-1){
                    var btnEdit = grid.down("button[ref=gridEdit]");
                    if(btnEdit){
                       btnEdit.setHidden(true);  
                    }
                    
                }
                if(userBtn.indexOf(menuCode+"_gridDel")==-1){
                    var btnDel = grid.down("button[ref=gridDel]");
                    if(btnDel){
                        btnDel.setHidden(true);
                    }

                }//增加一个导出的按钮权限设置
                if(userBtn.indexOf(menuCode+"_gridExport")==-1){
                    var btnExport = grid.down("button[ref=gridExport]");
                    if(btnExport){
                        btnExport.setHidden(true);
                    }

                }
            }
        }           
    }

});