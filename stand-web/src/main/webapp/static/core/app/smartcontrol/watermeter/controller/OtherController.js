Ext.define("core.smartcontrol.watermeter.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.watermeter.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    

        "baseformtab[detCode=watermeter_binddetail] button[ref=formSave]":{
            beforeclick: function(btn) {
                this.doSaveBind(btn);
                return false;
            }
        },

        /*在打开视图显示之后的需要进行处理的数据*/
        "baseformtab[detCode=watermeter_detail]":{
            afterrender: function(cmp) {
                this.doLoadInfo(cmp);
                return false;
            }
        },
           //费率设备删除
        "basegrid[xtype=smartcontrol.watermeter.meterbinggrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.deleteMeterBingTerm(btn);
                return false;
             },
         },
    },


    doSaveBind:function(btn){   

        var self=this;

        //获取基本的容器
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页

        var deviceGrid = basetab.down('panel[xtype=smartcontrol.watermeter.deviceselsectgrid]');
       /* var selectGrid = deviceGrid.getSelectionModel().getSelection();
         if(selectGrid.length<1){
            self.msgbox("请选择绑定汇率的设备!");
            return false;
        }*/
       var getCount = deviceGrid.getStore().getCount();
       if (getCount <= 0) {
            self.msgbox("有数据才能继续操作!");
            return;
       } 
        //汇率规则
        var meterId = tabItem.itemPKV;
        //获取设置指定扣费的房间
       var termId =new Array();  
       var termSn =new Array();
       var isSelectStore = deviceGrid.getStore();
        for (var i = 0; i < getCount; i++) {
             var record = isSelectStore.getAt(i);
             termId.push(record.get('uuid'));
             termSn.push(record.get('termSN'))
        };
        Ext.Msg.confirm('提示', "您确定要绑定这些设备吗？", function (btn2, text) {
            if (btn2 == 'yes') {

                var loading = new Ext.LoadMask(basetab, {
                    msg: '正在提交，请稍等...',
                    removeMask: true// 完成后移除
                });
                loading.show();
                self.asyncAjax({
                    url: comm.get('baseUrl') + "/BasePtSkMeterbind/doAdd",
                    params: {
                        termId: termId,
                        termSn:termSn,
                        meterId:meterId
                    },
                    //回调代码必须写在里面
                    success: function (response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) {
                            loading.hide();

                            self.msgbox(data.obj);                            

                            tabPanel.remove(tabItem);         

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
            }
        });
    },

    doLoadInfo:function(cmp){
        var self=this;
        if(cmp.operType=='detail'){
            var recordData=cmp.insertObj;                
            var meterInfoContainer = cmp.down("container[ref=meterInfo]");
            meterInfoContainer.setData(recordData);

            self.asyncAjax({
                url: comm.get("baseUrl") + "/BasePtSkMeterbind/list",
                params: {
                    page: 1,
                    start: 0,
                    limit: 0,
                    filter: "[{'type':'string','comparison':'=','value':'" + recordData.uuid + "','field':'meterId'}]",
                },
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    var meterBindRoomsContainer = cmp.down("container[ref=meterBindRooms]");
                    meterBindRoomsContainer.setData(data);
                }
            });
        }

        
    },
    deleteMeterBingTerm:function(btn){
        var self=this;

        var baseGrid = btn.up("basegrid");
        //选择的设备
        var selectTerm= baseGrid.getSelectionModel().getSelection();
        if (selectTerm.length == 0) {
            self.msgbox("没有选择要删除的设备，请选择!");
            return false;
        }
       
        //拼装所选择的设备
        var termIds = new Array();
        Ext.each(selectTerm, function(rec) {
            var pkValue = rec.get("uuid");
            termIds.push(pkValue);
        });
        var title = "确定删除绑定该计量的设备吗？";
        Ext.Msg.confirm('警告', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                var resObj = self.ajax({
                    url: comm.get('baseUrl') + "/BasePtSkMeterbind/doPtTermDelete",
                    params: {
                        termIds: termIds.join(","),
                     }
                });
                if (resObj.success) {
                    var store = baseGrid.getStore();
                    store.load();
                    self.msgbox(resObj.obj);
                } else {
                    self.Error(resObj.obj);
                }
            }
        });
       
    },

});