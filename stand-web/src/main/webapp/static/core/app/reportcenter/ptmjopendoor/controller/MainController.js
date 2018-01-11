Ext.define("core.reportcenter.ptmjopendoor.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.ptmjopendoor.maincontroller',
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
        "basetreegrid[xtype=reportcenter.ptmjopendoor.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                var baseGrid = btn.up("basetreegrid[xtype=reportcenter.ptmjopendoor.roominfotree]");
                var store = baseGrid.getStore();
                    store.load(); // 刷新父窗体的grid
                    return false;
                }
            },
             "basegrid[xtype=reportcenter.ptmjopendoor.maingrid] button[ref=gridExport]": {
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
            var baseGrid = btn.up("basegrid[xtype=reportcenter.ptmjopendoor.maingrid]");
            var basepanel = baseGrid.up('basepanel');
            var roominfotreegrid = basepanel.down("basetreegrid[xtype=reportcenter.ptmjopendoor.roominfotree]");
            var records = roominfotreegrid.getSelectionModel().getSelection();
            if(records.length>0){
              var roomId = records[0].get('id');
          }

          var title = "确定要导出门禁开门记录吗？";
          Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/PtMjOpenDoor/doExportExcel?roomId='+roomId+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/PtMjOpenDoor/checkExportEnd',
                        timeout: 1000 * 60 * 30,      
                        success: function (response) {
                            data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            if (data.success) {
                                Ext.Msg.hide();
                                self.msgbox(data.obj);
                                component.destroy();
                            } else {
                                if (data.obj == 0) {    
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
                }, 1000);   
              }
          });
            return false;
       },
    queryFastSearchForm:function(btn){
        var self = this;
        var baseGrid = btn.up("basegrid");
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue!=null){
            filter.push({"type": "date", "value": girdSearchTexts[0].getValue(), "field": "openDate", "comparison": ">="})

        }
        if(girdSearchTexts[1].getValue!=null){
            filter.push({"type": "date", "value": girdSearchTexts[1].getValue(), "field": "openDate", "comparison": "<="})

        }
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);

    },
});