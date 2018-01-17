Ext.define("core.reportcenter.watercount.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.watercount.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil',
        TreeUtil:'core.util.TreeUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
         // 树刷新
        "basetreegrid[xtype=reportcenter.watercount.roominfotree] button[ref=gridRefresh]": {
                beforeclick: function(btn) {
                btn.up('basetreegrid').getStore().load();
                var mainlayout = btn.up("basepanel[xtype=reportcenter.watercount.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=reportcenter.watercount.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                proxy.extraParams.roomLeaf="";
                return false;
            }
        },
        "basetreegrid[xtype=reportcenter.watercount.roominfotree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("panel[xtype=reportcenter.watercount.mainlayout]");
                mainLayout.funData.roomId=record.get("id");

                var storeyGrid = mainLayout.down("panel[xtype=reportcenter.watercount.maingrid]");
                var store = storeyGrid.getStore();
                var proxy = store.getProxy();

                var roomId="";
                if( record.get("id")!="2851655E-3390-4B80-B00C-52C7CA62CB39"){
                    roomId = record.get("id");
                }

                var roomLeaf=record.get("leaf");
                if(roomLeaf==true)
                    roomLeaf="1";
                else
                    roomLeaf="0"

                proxy.extraParams.roomId=roomId;
                proxy.extraParams.roomLeaf=roomLeaf;

                store.loadPage(1); 
                return false;
           }
       },
        "basegrid[xtype=reportcenter.watercount.maingrid] button[ref=gridExport]": {
            beforeclick: function(btn) {
                this.doExport(btn);
                return false;
            }
        },

        "basepanel basegrid button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
               this.queryFastSearchForm(btn);
                return false;
              }
        },

        "basepanel basegrid field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                   this.queryFastSearchForm(field);
                   return false;

               }
           }
        }

    },
    doExport:function(btn){
        var self = this;
        var baseGrid = btn.up("basegrid[xtype=reportcenter.watercount.maingrid]");
        var basepanel = baseGrid.up('basepanel');
        var roominfotreegrid = basepanel.down("basetreegrid[xtype=reportcenter.watercount.roominfotree]");
        var records = roominfotreegrid.getSelectionModel().getSelection();
        var roomId ="";
        if(records.length>0){
           roomId = records[0].get('id');
       }
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var statusDateStart= "";
        var statusDateEnd = "";
        if(girdSearchTexts[0].getValue()!=null){
            statusDateStart = girdSearchTexts[0].getValue();
        }
        if(girdSearchTexts[1].getValue()!=null){
            statusDateEnd = girdSearchTexts[1].getValue();
        }
  
      
        var title = "确定要导出水控统计表吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/PtSkTermStatus/doExpWaterCountExcel?roomId='+roomId+'&statusDateStart='+statusDateStart+'&statusDateEnd='+statusDateEnd+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/PtSkTermStatus/checkExportEnd',
                        timeout: 1000 * 60 * 30,        //半个小时
                        //回调代码必须写在里面
                        success: function (response) {
                            data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            if (data.success) {
                                Ext.Msg.hide();
                                self.msgbox(data.obj);
                                component.destroy();
                            } else {
                                if (data.obj == 0) {    //当为此值，则表明导出失败
                                    Ext.Msg.hide();
                                    self.Error("导出失败，请重试或联系管理员！");
                                    component.destroy();
                                } else {
                                    setTimeout(function () {
                                        time()
                                    }, 1000);
                                }
                            }
                        },
                        failure: function (response) {
                            Ext.Msg.hide();
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            component.destroy();
                        }
                    });
                };
                setTimeout(function () {
                    time()
                }, 1000);    //延迟1秒执行
            }
        });
       return false;
    },
    queryFastSearchForm:function(btn){
        var self = this;
        var basepanel = btn.up("basepanel");
        var roominfotree = basepanel.down("basetreegrid");
        var recs = roominfotree.getSelectionModel().getSelection();
        if(recs.length!=1){
            self.msgbox("请选择一个房间！");
            return false;
        }

        var baseGrid = btn.up("basegrid");
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");

        var querySql="";
       
        if(girdSearchTexts[0].getValue()){
            var value =girdSearchTexts[0].getValue();
            querySql+=" and a.statusDate>='"+value+"'";
        }
        if(girdSearchTexts[1].getValue()){
            var value =girdSearchTexts[1].getValue();
            querySql+=" and a.statusDate<='"+value+"'";
        }

        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.querySql =  querySql ;
        store.loadPage(1);

    },
});