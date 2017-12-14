Ext.define("core.accesscontrol.useraccess.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.accesscontrol.useraccess.maincontroller',
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
    	     "basepanel basegrid[xtype=accesscontrol.useraccess.mjuserrightgrid]": {
              afterrender : function(grid) {
                if(comm.get("isAdmin")!="1"){
                    var menuCode="USERACCESS";     // 此菜单的前缀
                    var userBtn=comm.get("userBtn");
                    if(userBtn.indexOf(menuCode+"_selectPersonnel")==-1){
                        var btnSelPer = grid.down("button[ref=selectPersonnel]");
                          if(btnSelPer){
                          btnSelPer.setHidden(true);
                         }
                     }
                 }
                  return false;
            },

          },


          "basepanel basegrid[xtype=accesscontrol.useraccess.maingrid]": {
            afterrender : function(grid) {
              if(comm.get("isAdmin")!="1"){
                    var menuCode="USERACCESS";     // 此菜单的前缀
                    var userBtn=comm.get("userBtn");
                    if(userBtn.indexOf(menuCode+"_gridDeletePer")==-1){
                      var btnDel = grid.down("button[ref=gridDeletePer]");
                      if(btnDel){
                        btnDel.setHidden(true);
                      }

                    }
                    if(userBtn.indexOf(menuCode+"_gridDeleteAll")==-1){
                        var btnDelALL = grid.down("button[ref=gridDeleteAll]");
                        if(btnDelALL){
                          btnDelALL.setHidden(true);
                        }
                      }

                 }
                return false;
            },

        },
    
    	//房间列表刷新按钮
    	"basetreegrid[xtype=accesscontrol.useraccess.roominfotree] button[ref=gridRefresh]": {
          beforeclick: function(btn) {
             btn.up('basetreegrid').getStore().load();
             var baseGrid = btn.up("basetreegrid");
             var mainLayout= baseGrid.up("panel[xtype=accesscontrol.useraccess.mainlayout]");
             var mjuserrightGrid = mainLayout.down("panel[xtype=accesscontrol.useraccess.mjuserrightgrid]");
             var mjuserrightstore = mjuserrightGrid.getStore();
             mjuserrightstore.removeAll();
             return false;
          }
        },
    	
    	 //选择人员按钮
    	 "basegrid[xtype=accesscontrol.useraccess.mjuserrightgrid] button[ref=selectPersonnel]": {
            beforeclick: function(btn) {
                this.openRoomAccess_Win(btn);
                return false;
            }
        },
    	
        //保存数据按钮
    	"basegrid[xtype=accesscontrol.useraccess.mjuserselectgrid] button[ref=gridSave]": {
            beforeclick: function(btn) {
                this.saveRoomAccess(btn);
                return false;
            }
        },
    	
        //删除人员权限
        "panel[xtype=accesscontrol.useraccess.maingrid] button[ref=gridDeleteAll]": {
          	beforeclick: function(btn) {
              this.deleteUserAccess(btn);
              return false;
            }
        },
        "basegrid[xtype=accesscontrol.useraccess.maingrid] button[ref=gridDeletePer]": {
            beforeclick: function (btn) {
              this.doDeleteRecords(btn);
              return false; 
            }
        },
        "basegrid[xtype=accesscontrol.useraccess.mjuserrightgrid] actioncolumn": {
             selectPersonnel_Win: function(data) {
               this.openRoomAccess_Win(null,data.view,data.record); 
               return false;          
           }

       },
     
    },
    
    	/*
    	 * 选择人员事件
    	 */
  	openRoomAccess_Win: function(btn,grid,record) {
      
    		var self = this;
        var baseGrid;
        var selectGrid; 
        if(btn){
          baseGrid=btn.up("basegrid");
          selectGrid = baseGrid.getSelectionModel().getSelection();
        }else{
          baseGrid=grid;
          selectGrid = new Array();
          selectGrid.push(record);
       }

        var basePanel = baseGrid.up("basepanel");
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var pkName=funData.pkName;
        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图

        if (selectGrid <= 0) {
            self.msgbox("需选择设备才能继续操作!");
            return;
        }
        var termids=new Array(),termSNs=new Array(),termNames=new Array(); 
        for (var i = 0; i < selectGrid.length; i++) {
          var temp=selectGrid[i];
          termids.push(temp.get('uuid'));
          termSNs.push(temp.get('termSN'));
          termNames.push(temp.get('termName'));
        };

        var termid = termids.join(",");
        var termSN = termSNs.join(",");
        var termName = termNames.join(",");

        var otherController = basePanel.otherController;    
        if (!otherController)
          otherController = '';  
        var width = 1200;
        var height = 600;
        var iconCls= 'x-fa fa-plus-circle';
        var winTitle = "人员列表";

        var operType="add";
        //创建tab内部组件                     
        var insertObj =  Ext.apply(new Object(),funData.defaultObj);
             var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
              grid: baseGrid
            });

       var win = Ext.create('core.base.view.BaseFormWin', {
              iconCls:iconCls,
              title: winTitle,
              operType: operType,
              width: width,
              height: height,
              termid: termid,
              termSN: termSN,
              termName: termName,
              controller: otherController,
              funData: popFunData,
              funCode: detCode,
              insertObj: insertObj,        
              items: [{
                xtype: "pubselect.selectuserlayout"
              }]
            }).show();

    },

    /*
  	 * 删除人员的权限
  	 */
      deleteUserAccess: function(btn) {
  		    var self = this;

          //得到组件
          var baseGrid=btn.up("basegrid");
          var basePanel = baseGrid.up("basepanel");

          //得到配置信息
          var funData = basePanel.funData;                //主界面的配置信息  
          var pkName=funData.pkName;

          var funCode = basePanel.funCode;          //主界面的funCode
          var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
          var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
          
          var selectGrid = baseGrid.getSelectionModel().getSelection();
          if (selectGrid <= 0) {
              self.msgbox("需选择要删除权限的角色!");
              return false;
          };
          if(selectGrid.length>1){
          	self.msgbox("只能选择一个角色!");
              return false;
          }
          var stuId = selectGrid[0].get('stuId');
          var uuid = selectGrid[0].get('uuid');
          var xm = selectGrid[0].get('xm');
          
          var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
          if (!otherController)
              otherController = '';  

          //设置window的参数
          var width = 800;
          var height = 500;
          var winTitle = xm+"的权限列表";
          var recordData=null;
           //创建tab内部组件                     
           var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
              grid: baseGrid
           });

           var win = Ext.create('core.base.view.BaseFormWin', {
                title: winTitle,
                baseGrid:baseGrid,
                width: width,
                height: height,
                controller: otherController,
                funData: popFunData,
                funCode: detCode,
                items: [{
                    xtype: "accesscontrol.useraccess.detaillayout"
                }],
                listeners: {
                    beforerender: function(win) {
                        // //隐藏按钮
                        baseGrids = win.down("panel[xtype=accesscontrol.useraccess.useraccessgrid]");
                        var store = baseGrids.getStore();
                        var proxy = store.getProxy();
                        proxy.extraParams.filter="["+"{\"type\":\"string\",\"value\":"+"\""+stuId+"\""+",\"field\":\"stuId\",\"comparison\":\"\"}"+"]";
                    }
                },
            }).show();
  	
    } ,
    doDeleteRecords:function(btn){
        var self=this;
        //得到组件
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length > 0) {
            var msg='是否删除数据?';
            if(btn.msg)
                msg=btn.msg;
            
            //封装ids数组
            Ext.Msg.confirm('提示', msg, function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    var ids = new Array();
                    Ext.each(records, function (rec) {
                        var pkValue = rec.get(pkName);
                        ids.push(pkValue);
                    });

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                            ids: ids.join(","),
                            pkName: pkName
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                var store=baseGrid.getStore();
                                //如果当前页的数据量和删除的数据量一致，则翻到上一页
                                if(store.getData().length==records.length&&store.currentPage>1){    
                                    store.loadPage(store.currentPage-1);
                                }else{
                                    //store.load();
                                    store.remove(records); //不刷新的方式
                                }
                            
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