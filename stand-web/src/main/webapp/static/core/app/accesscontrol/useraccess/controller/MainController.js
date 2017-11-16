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
              self.Warning("需选择要删除权限的角色!");
              return false;
          };
          if(selectGrid.length>1){
          	self.Warning("只能选择一个角色!");
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
      
      
      
});