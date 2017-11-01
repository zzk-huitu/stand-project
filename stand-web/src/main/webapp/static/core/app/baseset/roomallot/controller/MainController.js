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
           "basegrid[xtype=baseset.roomallot.maingrid] button[ref=allotOffRoom]": {
                beforeclick: function(btn) {
                    self.openRoomAllot_Win(btn);
                    return false;
                }
            },
            "basegrid[xtype=baseset.roomallot.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    self.doDeleteRecords(btn);
                    return false;
                }
            },
            "basegrid[xtype=baseset.roomallot.maingrid] button[ref=officeTs]": {
                beforeclick: function(btn) {
                    self.officeTs(btn);
                    return false;
                 
                }
            },
          
             /**
             * 操作列的操作事件
             */
             "basegrid[xtype=baseset.roomallot.maingrid] actioncolumn": {

                deleteClick: function(data) {
                    self.doDeleteRecords(null,data.view,data.record);
                     return false;
                },
                
            }, 
 
      });
 },

 openRoomAllot_Win: function(btn) {
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
        
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        //设置window的参数
        var width = 1200;
        var height = 550;
        var iconCls= 'x-fa fa-plus-circle';
        var winTitle = "教师列表";
        var recordData=null;
        var operType="add";

         // 选择的字典项信息
         var basetreegrid = baseGrid.up("panel[xtype=baseset.roomallot.mainlayout]").down("panel[xtype=baseset.roomallot.roomallottree]");
         var selectObject = basetreegrid.getSelectionModel().getSelection();
         if (selectObject.length <= 0) {
             self.msgbox("请选择办公室!");
             return;
         }
                            // 得到选择的字典
         var objDic = selectObject[0];
         var leaf = objDic.get("leaf");
         var roomId = objDic.get("id");
         if (leaf != true) {//true: 房间 false:区域
            self.msgbox("只能选择办公室操作!"); 
            return;
          }
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
                    height: height,
                    roomId: roomId,
                    controller: otherController,
                    funData: popFunData,
                    funCode: detCode,
                    insertObj: insertObj,        
                    items: [{
                        xtype: detLayout
                    }]
                }).show();
                var selecTeacherPanel = win.down("basepanel[xtype=baseset.roomallot.selectteacherlayout]");
                var selectGrid=selecTeacherPanel.down("basegrid[xtype=baseset.roomallot.selectteachergrid]");
                var selectStore = selectGrid.getStore();
                var selectProxy = selectStore.getProxy();
                selectProxy.extraParams = {
                    filter: '[{"type":"string","comparison":"=","value":"1","field":"category"}]',
                };
                selectStore.loadPage(1);         
     },

   
       doDeleteRecords:function(btn,grid,record){
            var self=this;
            var records;
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
                Ext.Msg.confirm('提示',"是否解除设置", function (btn, text) {
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
       officeTs:function(btn) {
           var self=this;
           var mainLayout = btn.up("basepanel[xtype=baseset.roomallot.mainlayout]");
           var storeyGrid = mainLayout.down("basegrid[xtype=baseset.roomallot.maingrid]");
           var jwtrTree = mainLayout.down("basetreegrid[xtype=baseset.roomallot.roomallottree]");
           var selectTreeObject = jwtrTree.getSelectionModel().getSelection();
           if (selectTreeObject.length <= 0) {
                self.msgbox("请选择要推送的办公室！");
                return;
           }
           var objDic = selectTreeObject[0];
           var roomId = objDic.get("id");
           var leaf = objDic.get("leaf");
           if (leaf != true) {//true: 房间 false:区域
                self.msgbox("推送消息时，请选择单个办公室!"); 
                return;
           }
            var count = storeyGrid.getStore().getCount();
            if (count <= 0) {
                self.msgbox("列表中无任何数据!");
                return;
            }
            Ext.Msg.confirm("推送消息", "您确定要推送信息吗？", function(btns) {
                if (btns == 'yes') {
                    var loading = self.LoadMask(mainLayout,'正在推送消息中，请等待...');
                    self.asyncAjax({
                      url: comm.get('baseUrl') + "/BaseOfficeAllot/pushMessage",
                      params: {
                         roomId: roomId,
                     },                 
                     success: function(response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        if(data.success){
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
            })

        },

    });