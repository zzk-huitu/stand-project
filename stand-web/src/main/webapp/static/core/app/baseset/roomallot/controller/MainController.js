Ext.define("core.baseset.roomallot.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.roomallot.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    init: function() {
        var self = this
        // 事件注册
        this.control({
            //区域列表刷新按钮事件
            "panel[xtype=baseset.roomallot.roomallottree] button[ref=gridRefresh]": {
                click: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },
            
          "basegrid[xtype=baseset.roomallot.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    self.openRoomAllot_Tab(btn,"add");
                    return false;
                }
            },

            "basegrid[xtype=baseset.roomallot.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    self.doDeleteRecords(btn);
                    return false;
                }
            },
 
      });
 },


      //作息时间详细信息增加、修改和详细的处理
    openRoomAllot_Tab: function(btn,cmd) {
        var self = this;

        //得到组件
        var baseGrid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
        }

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

        //获取Tab相关数据,根据cmd的类型，来获取不同的数据
        var tabConfig=funData.tabConfig;
        var tabTitle = tabConfig.addTitle; 
        var tabItemId =funCode + "_gridAdd"; ;
        var operType="add";
        var recordData=null;
       
         // 选择的字典项信息
         var basetreegrid = baseGrid.up("panel[xtype=baseset.roomallot.mainlayout]").down("panel[xtype=baseset.roomallot.roomallottree]");
         var selectObject = basetreegrid.getSelectionModel().getSelection();
         if (selectObject.length <= 0) {
             self.msgbox("请选择办公室!");
             return;
        }
                            // 得到选择的字典
        var objDic = selectObject[0];

        var level = objDic.get("level");
        var roomId = objDic.get("id");
        if (level != 5) {
            self.msgbox("只能选择办公室操作!");
            return;
        }
        /*var areaType = objDic.get("areaType");
        if (areaType != "02") {
            self.msgbox("只能选择办公室操作!");
            return;
        }
*/
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){

                //创建tab内部组件                     
                var insertObj =  Ext.apply(new Object(),funData.defaultObj);
                var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
                    grid: baseGrid
                });
                if(recordData!=null){
                    insertObj=recordData;
                }

                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    roomId: roomId,                
                    insertObj:insertObj,                    //保存一些需要默认值，提供给提交事件中使用
                    funData:popFunData,                     //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout
                    }]
                }); 
              
                tabItem.add(item); 
                var selecRoomPanel = item.down("basepanel[xtype=baseset.roomallot.selectroomlayout]");
                var selectGrid=selecRoomPanel.down("basegrid[xtype=baseset.roomallot.selectroomgrid]");
                var selectStore = selectGrid.getStore();
                var selectProxy = selectStore.getProxy();
                selectProxy.extraParams = {
                    //roomId:roomId,   
                    filter: '[{"type":"string","comparison":"=","value":"1","field":"category"}]',
                };
                selectStore.loadPage(1);

     },30);
                           
        }
        tabPanel.setActiveTab(tabItem);   
    },
   doDeleteRecords:function(btn,grid,record){
        var self=this;
        var records;
            //得到组件
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
            records = baseGrid.getSelectionModel().getSelection();
        }else{
            records=new Array();
            records.push(record);
        }
         funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        //得到配置信息
        var funData = basePanel.funData;
        var tteacId = '';
        var uuid = '';
        if (records.length <= 0) {
            self.msgbox('请选择一条数据');
            return;
        }
        var roomId = records[0].get('roomId');
        for (var i = 0; i < records.length; i++) {
            tteacId += records[i].get('tteacId') + ',';
            uuid += records[i].get('uuid') + ',';
        };
        if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm('提示',"是否删除数据", function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                             uuid: uuid,
                             roomId: roomId,
                             tteacId: tteacId
                        },                    
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                 baseGrid.getStore().remove(records); //不刷新的方式
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