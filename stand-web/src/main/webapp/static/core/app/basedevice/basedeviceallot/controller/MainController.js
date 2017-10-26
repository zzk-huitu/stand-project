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
    	var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");

    	//得到配置信息
    	var funData = basePanel.funData;                //主界面的配置信息  
    	var pkName=funData.pkName;

    	var funCode = basePanel.funCode;          //主界面的funCode
    	var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
    	var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
       
    	var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
    	if (!otherController)
    		otherController = '';  
       
    	//默认的tab参数
    	var tabTitle = funData.tabConfig.addTitle; //标签页的标题
    	var tabItemId = funCode + "_mainGridAdd";     //命名规则：funCode+'_ref名称',确保不重复
    	var itemXtype = "basedevice.basedeviceallot.deviceallotlayout";
       
    	var tabItem = tabPanel.getComponent(tabItemId);

    	//判断是否已经存在tab了
    	if (!tabItem) {
           tabItem = Ext.create({
               xtype: 'container',
               title: tabTitle,
               scrollable: true,
               itemId: tabItemId,
               layout: 'fit',
           });
           tabPanel.add(tabItem);

           //延迟放入到tab中
           setTimeout(function () {
               //创建组件
               var item = Ext.widget("baseformtab", {
                   controller: otherController,         //指定重写事件的控制器
                   funCode: funCode,                    //指定mainLayout的funcode
                   detCode: detCode,                    //指定detailLayout的funcode
                   tabItemId: tabItemId,                //指定tab页的itemId
                   items: [{
                           xtype: itemXtype
                   }]
               });
               tabItem.add(item);
           }, 30);
    	} else if (tabItem.itemPKV && tabItem.itemPKV != pkValue) {     //判断是否点击的是同一条数据，不同则替换数据
           self.Warning("您当前已经打开了一个编辑窗口了！");
           return;
    	}
    	
    	tabPanel.setActiveTab(tabItem);
  } ,
  
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