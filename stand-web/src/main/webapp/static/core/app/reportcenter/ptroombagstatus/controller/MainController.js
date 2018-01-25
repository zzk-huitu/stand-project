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
        queryUtil:"core.util.QueryUtil",
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
          "basepanel basegrid[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid]": {
             afterrender : function(grid) {
                if(comm.get("isAdmin")!="1"){
                 var menuCode="PtRoombagStatus";    
                 var userBtn=comm.get("userBtn");
                 if(userBtn.indexOf(menuCode+"_gridfind")==-1){
                    var btnFind = grid.down("button[ref=gridfind]");
                    btnFind.setHidden(true);

                }
            }
         },
       },
        "basetreegrid[xtype=reportcenter.ptroombagstatus.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                var baseGrid = btn.up("panel[xtype=reportcenter.ptroombagstatus.roominfotree]");
                var store = baseGrid.getStore();
                store.load(); // 刷新父窗体的grid
                return false;
            }
        },
        "basetreegrid[xtype=reportcenter.ptroombagstatus.roominfotree]": {
            /*
                当点击了这个树的子项后，在查询列表的条件中，要做如下工作：
                1. 附带树节点的相关参数
                2. 当存在basegrid的默认参数，则附带上去
                3. 附带快速搜索中的参数（为了防止文本框的数据与实际查询的数据不一致，所以在下面代码中主动获取了文本框的数据）
                4. reset清除高级搜索中的条件数据 以及 proxy.extraParams中的相关数据
            */
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("basepanel[xtype=reportcenter.ptroombagstatus.mainlayout]");
                var roomLeaf = record.get("leaf");
                if(roomLeaf==false)
                    return false;
                var roomId=record.get('id');
                var roomName=record.get("text");
               
                this.loadBagInfo(mainLayout,roomId,roomName);

                return false;
            }
        },
        //查看所有设备按钮
        "basegrid[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid] button[ref=gridfind]": {
            beforeclick: function(btn) {
                this.openDeviceDetail(btn);
                return false;
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
        "basequeryform[xtype = reportcenter.ptroombagstatus.querypanelgrid] button[ref=gridSearchFormReset]": {
            beforeclick: function(btn) {
                var self=this;
                var queryPanel=btn.up("basequeryform");
                self.resetQueryPanel(queryPanel);  
                return false;   
            }
        },
    },

    openDeviceDetail:function(btn){
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
            iconCls: 'x-fa fa-search-plus',
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
    },

    queryFastSearchForm:function(component){
        var self = this;
        var queryPanel = component.up("basequeryform");
        var querySql = self.getQuerySql(queryPanel);

        if(querySql===""){
            self.msgbox("请输入搜索的条件！");
            return false;
        }

        var mainLayout = component.up("panel[xtype=reportcenter.ptroombagstatus.mainlayout]");
        var loadding=self.LoadMask(mainLayout);
       
        self.syncAjax({
            url: comm.get('baseUrl') + "/PtBag/getUserRoomId",
            params: {
                querySql: querySql
            },
            success: function (response) {
                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));         
                if (data.roomId) {       
                    var roomName=data.roomName;
                    var roomId=data.roomId;
                    self.loadBagInfo(mainLayout,roomId,roomName);
                    loadding.hide();

                }else{        
                    self.msgbox("找不到此人员的数据！");
                    self.clearBagInfo(mainLayout);      
                    loadding.hide();          
                }
            },
            failure: function (response) {
                loadding.hide();
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                component.destroy();
            }
        });

        return false;
    },

    loadBagInfo:function(mainLayout,roomId,roomName){
        var self=this;

        //房间钱包
        var storeGrid1 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptroomwalletgrid]");
        var store1 = storeGrid1.getStore();
        var proxy1 = store1.getProxy();
        proxy1.extraParams = {
            filter: "[{'type':'string','comparison':'=','value':'" + roomId+ "','field':'roomId'}]"
        };
        store1.load({
            scope: this,
            callback: function(records, operation, success) {
                if(success==false){
                    self.Error("读取房间钱包数据出错！");
                }
                if(success==true){
                    var data={};
                    data.roomName=roomName;
                    if(records.length>0){
                        var recordData=records[0].getData();                                                                            
                        data.roomValue=parseFloat(recordData.roomValue).toFixed(4)+" 元";
                        data.roomTotalUsed=parseFloat(recordData.roomTotalUsed).toFixed(4)+" 元";
                        data.roomTotalRecharge=parseFloat(recordData.roomTotalRecharge).toFixed(4)+" 元";
                        data.waterTotalused=parseFloat(recordData.waterTotalused).toFixed(4)+" 元";
                        data.waterUpdateTime=recordData.ecUpdateTime;
                        data.ecTotalUsed=parseFloat(recordData.ecTotalUsed).toFixed(4)+" 元";
                        data.ecUpdateTime=recordData.ecUpdateTime;
                    }else{
                        data.roomValue="无数据";
                        data.roomTotalUsed="无数据";
                        data.roomTotalRecharge="无数据";
                        data.waterTotalused="无数据";
                        data.waterUpdateTime="无数据";
                        data.ecTotalUsed="无数据";
                        data.ecUpdateTime="无数据";
                    }
                    var ptRoomWalletInfoContainer = mainLayout.down("container[ref=ptRoomWalletInfo]");
                    ptRoomWalletInfoContainer.setData(data);    
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
        var storeGrid2 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.userwalletgrid]");
        var store2 = storeGrid2.getStore();
        var proxy2 = store2.getProxy();
        proxy2.extraParams = {
            roomId:roomId
        };
        store2.load(); 

        //红外设备
        var storeGrid3 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid]");
        var store3 = storeGrid3.getStore();
        var proxy3 = store3.getProxy();
        proxy3.extraParams = {
            //filter:"[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]"
            roomId:roomId
        };
        store3.load(); 
    },

    clearBagInfo:function(mainLayout){
        var ptRoomWalletInfoContainer = mainLayout.down("container[ref=ptRoomWalletInfo]");
        ptRoomWalletInfoContainer.setData({});

        //设备钱包
        var storeyGrid = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.pttermwalletgrid]");
        storeyGrid.getStore().removeAll();

        //用户钱包
        var storeGrid2 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.userwalletgrid]");
        storeGrid2.getStore().removeAll();

        //红外设备
        var storeGrid3 = mainLayout.down("panel[xtype=reportcenter.ptroombagstatus.ptirroomdevicegrid]");
        storeGrid3.getStore().removeAll();
    }

});