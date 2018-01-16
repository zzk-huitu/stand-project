Ext.define("core.reportcenter.ptroombagstatus.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.ptroombagstatus.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
      //  gridActionUtil: "core.util.GridActionUtil",
        //dateUtil: 'core.util.DateUtil',
        SqlUtil:"core.util.SqlUtil",
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
            "basetreegrid[xtype=reportcenter.ptroombagstatus.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                var baseGrid = btn.up("panel[xtype=reportcenter.ptroombagstatus.roominfotree]");
                var store = baseGrid.getStore();
                store.load(); // 刷新父窗体的grid
                return false;
                }
            },
           //查看所有设备按钮
           "basegrid[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid] button[ref=gridfind]": {
            beforeclick: function(btn) {
                var self = this;
                var grid = btn.up('basegrid');
                var mainlayout = grid.up('panel[xtype=reportcenter.ptroombagstatus.mainlayout]');
                var treegrid = mainlayout.down("panel[xtype=reportcenter.ptroombagstatus.roominfotree]");
                var records = treegrid.getSelectionModel().getSelection();
                if(records.length!=1){
                    self.msgbox("请先选择一件房间");
                    return false;
                }
                var roomId = records[0].data.id;
                var win = Ext.create('core.base.view.BaseFormWin', {
                    title: "房间所有设备",
                    resizable: true,
                    width: 1200,
                    height: 600,
                    operType: "detail",
                    iconCls: 'x-fa fa-plus-circle',
                    items: [{
                        xtype: "reportcenter.ptroombagstatus.sysdevicegrid",
                    }]
                });
                var grid = win.down('basegrid[xtype=reportcenter.ptroombagstatus.sysdevicegrid]');
                var store = grid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams = {
                    roomId: roomId
                };
                store.load(); 
                win.show(); 
            }
        },
        "basequeryform[xtype = reportcenter.ptroombagstatus.querypanelgrid] field": {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    this.queryFastSearchForm(field);       
                    return false;         
                }
            }
        },
        "basequeryform[xtype = reportcenter.ptroombagstatus.querypanelgrid] button[ref=gridSearchFormOk]": {
            beforeclick: function(btn) {
                this.queryFastSearchForm(btn);       
                return false;   
            }
        },
    },
    queryFastSearchForm:function(component){
        var self = this;
        var queryPanel = component.up("basequeryform");
        var querySql = self.getQuerySql(queryPanel);
        var resObj = self.ajax({
            url: comm.get('baseUrl') + "/PtBag/getUserRoomId",
            params: {
                querySql: querySql
            }
        });

         var mainLayout = component.up("panel[xtype=reportcenter.ptroombagstatus.mainlayout]");
         var roomWalletForm = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptroomwalletform]");
         var roomName=resObj.roomName;
         var roomId=resObj.roomId;
         var formObj=roomWalletForm.getForm();

         var roomNameobj=Ext.getCmp("roomName1");
         var roomValueobj=Ext.getCmp("roomValue1");
         var roomTotalUsedobj=Ext.getCmp("roomTotalUsed1");
         var roomTotalRechargeobj=Ext.getCmp("roomTotalRecharge1");
         var waterTotalusedobj=Ext.getCmp("waterTotalused1");
         var waterUpdateTimeobj=Ext.getCmp("waterUpdateTime1");
         var ecTotalUsedobj=Ext.getCmp("ecTotalUsed1");
         var ecUpdateTimeobj=Ext.getCmp("ecUpdateTime1");
        
         //房间钱包
         var storeyGrid1 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptroomwalletgrid]");
         var store1 = storeyGrid1.getStore();
         var proxy1 = store1.getProxy();
         proxy1.extraParams = {
            filter: "[{'type':'string','comparison':'=','value':'" + roomId + "','field':'roomId'}]"
         };
         var reader =proxy1.reader;
         store1.load({
            scope: this,
            callback: function(records, operation, success) {
                if(success==false){
                    self.Error(reader.jsonData.obj);
                }
                if(success==true){
                    var records=store1.getAt(0);
                    roomNameobj.setValue(roomName);
                    if(records!=null){
                       roomValueobj.setValue(parseFloat(records.data.roomValue).toFixed(4)+" 元");
                       roomTotalUsedobj.setValue(parseFloat(records.data.roomTotalUsed).toFixed(4)+" 元");
                       roomTotalRechargeobj.setValue(parseFloat(records.data.roomTotalRecharge).toFixed(4)+" 元");
                       waterTotalusedobj.setValue(parseFloat(records.data.waterTotalused).toFixed(4)+" 元");
                       waterUpdateTimeobj.setValue(records.data.waterUpdateTime);
                       ecTotalUsedobj.setValue(parseFloat(records.data.ecTotalUsed).toFixed(4)+" 元");
                       ecUpdateTimeobj.setValue(records.data.ecUpdateTime);
                   }
                   
                }
            }
        });
               //设备钱包
            var storeyGrid = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.pttermwalletgrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                    roomId:roomId
            };
            store.load(); 
            //用户钱包
            var storeyGrid2 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.userwalletgrid]");
            var store2 = storeyGrid2.getStore();
            var proxy2 = store2.getProxy();
            proxy2.extraParams = {
                    roomId:roomId
            };
            store2.load(); 
            return false;
    },

});