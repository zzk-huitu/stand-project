
Ext.define("core.system.appupdate.controller.MainController", {
	extend: "Ext.app.ViewController",
	alias: 'controller.system.appupdate.maincontroller',
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
        "basepanel basegrid[xtype=system.appupdate.maingrid]": {
            afterrender : function(grid) {
                this.hideFuncBtn(grid);
                
            },
            beforeitemclick: function(grid, record, item, index, e, eOpts) {
                this.disabledFuncBtn(grid);
            }

        },
        "basegrid[xtype=system.appupdate.maingrid] button[ref=gridUse]": {
            beforeclick: function(btn) {
                this.doUseOrCancel(btn,"use");
                return false;
            }
        },
        "basegrid[xtype=system.appupdate.maingrid] button[ref=gridCancel]": {
            beforeclick: function(btn) {
                this.doUseOrCancel(btn,"cancel");
                return false;
            }
        },
        "basegrid[xtype=system.appupdate.maingrid] actioncolumn": {
            userClick_Tab: function (data) {
                this.doUseOrCancel(null,"use",data.view,data.record);
                return false;
            },
                 cancelClick: function (data) {
                this.doUseOrCancel(null,"cancel",data.view,data.record);
                return false;
            }, 
        },
     },  
     doUseOrCancel: function(btn,cmd,grid,record){
     	var self = this;
        var baseGrid;
        var recordes;
        var tittle="您确定要对选中的APP进行启用吗？";
        if(btn){
            baseGrid=btn.up("basegrid");
            recordes=baseGrid.getSelectionModel().getSelection();
        }else{
            baseGrid=grid;
            recordes = new Array();
            recordes.push(record);
        }
        var appIsuse = 1;
     	if(cmd == "cancel"){
     		appIsuse=0;
            tittle ="您确定要对选中的APP取消启用吗？";
     	}
     	if(recordes.length==1){
     		Ext.Msg.confirm('启用此APP', tittle, function(btn, text) {
     			var loading = self.LoadMask(baseGrid);
     			if (btn == 'yes') {
     				self.asyncAjax({
     					url: comm.get('baseUrl') + "/SysAppinfo/doUpdateState",
     					params: {
     						id: recordes[0].data.uuid,
     						appType:recordes[0].data.appType,
     						appIsuse:appIsuse,
     						appUrl:recordes[0].data.appUrl                                  
     					},
     					success: function (response) {
     						var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
     						if (data.success) {
     							baseGrid.getStore().load();
     							self.msgbox(data.obj);
     							loading.hide();
     						} else {
     							self.Error(data.obj); 
     							loading.hide();
     						}
     					},
     				
     					failure: function(response) {                   
     						Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
     						loading.hide();
     					}
     				});     			
     			}else{
                    loading.hide();
                }
     		});  
     	}else{
     		self.msgbox("请选择一条数据！"); 
     	}
    },

    hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="APPUPDATE";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridUse")==-1){
                var btnUse = grid.down("button[ref=gridUse]");
                btnUse.setHidden(true);
                
             }
             if(userBtn.indexOf(menuCode+"_gridCancel")==-1){
                var btnUse = grid.down("button[ref=gridCancel]");
                btnUse.setHidden(true);
                
            }
        }
    },

    disabledFuncBtn:function(grid){
        var basePanel = grid.up("basepanel");
        var basegrid = basePanel.down("basegrid[xtype=system.appupdate.maingrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnCancel = basegrid.down("button[ref=gridCancel]");
        var btnUse = basegrid.down("button[ref=gridUse]");
        if (records.length == 0) {
            btnCancel.setDisabled(true);
            btnUse.setDisabled(true);
        } else if (records.length == 1) {
            if(records[0].get("appIsuse")!=1){
                btnCancel.setDisabled(true);
                btnUse.setDisabled(false);
            }else{
                btnCancel.setDisabled(false);
                btnUse.setDisabled(true);
            }
            
        } else {
            btnCancel.setDisabled(true);
            btnUse.setDisabled(true);
        }
    }
});