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
    	
    	//选择人员事件
    	"basegrid[xtype=accesscontrol.useraccess.maingrid] button[ref=gridAdd_Win]": {
            beforeclick: function(btn) {
                this.openRoomAccess_Win(btn,"add");
                return false;
            }
        },
    	
    	
    },
    
    openRoomAccess_Win: function(btn,cmd) {
//        	var self = this;
//        	 //得到组件
//        	var baseGrid=btn.up("basegrid");
//
//        	var basePanel = baseGrid.up("basepanel");
//        	var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
//
//        	//得到配置信息
//        	var funData = basePanel.funData;                //主界面的配置信息  
//        	var pkName=funData.pkName;
//
//        	var funCode = basePanel.funCode;          //主界面的funCode
//        	var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
//        	var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
//           
//        	var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
//        	if (!otherController)
//        		otherController = '';  
//           
//        	//默认的tab参数
//        	var tabTitle = funData.tabConfig.addTitle; //标签页的标题
//        	var tabItemId = funCode + "_mainGridAdd";     //命名规则：funCode+'_ref名称',确保不重复
//        	var itemXtype = "pubselect.selectuserlayout";
//           
//        	var tabItem = tabPanel.getComponent(tabItemId);
//
//        	//判断是否已经存在tab了
//        	if (!tabItem) {
//               tabItem = Ext.create({
//                   xtype: 'container',
//                   title: tabTitle,
//                   scrollable: true,
//                   itemId: tabItemId,
//                   layout: 'fit',
//               });
//               tabPanel.add(tabItem);
//
//               //延迟放入到tab中
//               setTimeout(function () {
//                   //创建组件
//                   var item = Ext.widget("baseformtab", {
//                       controller: otherController,         //指定重写事件的控制器
//                       funCode: funCode,                    //指定mainLayout的funcode
//                       detCode: detCode,                    //指定detailLayout的funcode
//                       tabItemId: tabItemId,                //指定tab页的itemId
//                       items: [{
//                               xtype: itemXtype
//                       }]
//                   });
//                   tabItem.add(item);
//               }, 30);
//        	} else if (tabItem.itemPKV && tabItem.itemPKV != pkValue) {     //判断是否点击的是同一条数据，不同则替换数据
//               self.Warning("您当前已经打开了一个编辑窗口了！");
//               return;
//        	}
//        	
//        	tabPanel.setActiveTab(tabItem);
    	

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
            
            var usGrid = basePanel.down('panel[xtype=accesscontrol.useraccess.mjuserrightgrid]');
            if (usGrid.getStore().getCount() <= 0) {
                self.Warning("设备列表中无数据，请选择一条数据!");
                return false;
            }
            var selectGrid = usGrid.getSelectionModel().getSelection();
            if (selectGrid <= 0) {
                self.Warning("需选择设备才能继续操作!");
                return false;
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
            
            var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
            if (!otherController)
                otherController = '';  

            //设置window的参数
            var width = 1200;
            var height = 550;
            var iconCls= 'x-fa fa-plus-circle';
            var winTitle = "人员列表";
            var recordData=null;
            var operType="add";
             //创建tab内部组件                     
             var insertObj =  Ext.apply(new Object(),funData.defaultObj);
             var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
                grid: baseGrid
             });
             if(recordData!=null){
              insertObj=recordData;
              }  

             var win = Ext.create('core.base.view.BaseFormWin', {
                        iconCls:iconCls,
                        title: winTitle,
                        operType: operType,
                        width: width,
                        termid: termid,
                        termSN: termSN,
                        termName: termName,
                        height: height,
                        controller: otherController,
                        funData: popFunData,
                        funCode: detCode,
                        insertObj: insertObj,        
                        items: [{
                            xtype: "pubselect.selectuserlayout"
                        }]
                    }).show();
    	
      } ,
    
    
});