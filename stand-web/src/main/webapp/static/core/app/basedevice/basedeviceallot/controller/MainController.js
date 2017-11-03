Ext.define("core.basedevice.basedeviceallot.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.basedeviceallot.maincontroller',
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
    	
        //区域列表刷新按钮
        "basetreegrid[xtype=basedevice.basedeviceallot.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
             btn.up('basetreegrid').getStore().load();
             return false;
            }
        },
    	
        //分配设备按钮
    	"basegrid[xtype=basedevice.basedeviceallot.maingrid] button[ref=gridAllot]": {
            beforeclick: function(btn) {
           	 this.doAllot(btn);
            }
        },
        
        //分配设备按钮
    	"basegrid[xtype=basedevice.basedeviceallot.maingrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
           	 this.doDelete(btn);
            }
        },
        
    },
    
    //分配设备事件
    doAllot: function (btn) {
    	var self = this;
    	 //得到组件
    	var baseGrid=btn.up("basegrid");

    	var basePanel = baseGrid.up("basepanel");
      var detCode =  "deviceallot_layout";               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
       
    	var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
    	if (!otherController)
    		  otherController = '';  
       var itemXtype = "basedevice.basedeviceallot.deviceallotlayout";
       var xItemType=[{
          xtype:itemXtype,
          funCode:detCode
        }];
        var win = Ext.create('core.base.view.BaseFormWin', {
                    title: "添加型号",
                    width: 1300,
                    height: 700,
                    operType: "add",
                    controller: otherController,
                    detCode: detCode,
                    iconCls: 'x-fa fa-plus-circle',
                    items:xItemType,
         }).show();
  },
  
  		//分配设备事件
  		doDelete: function (btn) {
  			var self = this;
  			var baseGrid =btn.up("basegrid");
  			var allotlayout = btn.up('panel[xtype=basedevice.basedeviceallot.mainlayout]');
  			var treegrid = allotlayout.down('panel[xtype=basedevice.basedeviceallot.roominfotree]');
  			var rows = baseGrid.getSelectionModel().getSelection();
  	      
  			if (rows <= 0) {
  				Ext.Msg.alert("提示", "请选择列表中的数据!");
  				return false;
  			}
  			var  roomId = "";
  			var uuid ="";
  			for (var i = 0; i < rows.length; i++) {
  				var store = rows[i];
  				uuid = store.data.uuid + "," + uuid;
  			}
  			var sss = Ext.Msg.wait('正在处理中...', '等待');
  			var resObj = null;
  			setTimeout(function() {
  				resObj = self.ajax({
  					url: comm.get('baseUrl') + "/BasePtTerm/doDelete",
  					params: {
  	                  uuid: uuid
  	              }
  	          });
  	          if (resObj.success) {
  	        	  baseGrid.getStore().removeAll();
  	              sss.hide();
  	              self.msgbox(resObj.obj);
  	              baseGrid.getStore().loadPage(1);
  	          } else {
  	              self.msgbox(resObj.obj);
  	              sss.hide();
  	          }
  	      }, 200)
  	      return false;
  	}
});