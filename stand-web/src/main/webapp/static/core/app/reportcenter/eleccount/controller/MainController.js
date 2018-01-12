Ext.define("core.reportcenter.eleccount.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.eleccount.maincontroller',
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
        "basetreegrid[xtype=reportcenter.eleccount.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                var baseGrid = btn.up("panel[xtype=reportcenter.eleccount.roominfotree]");
                var store = baseGrid.getStore();
                    store.load(); // 刷新父窗体的grid
                    return false;
                }
            },

            "basegrid[xtype=reportcenter.eleccount.maingrid] button[ref=gridExport]": {
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
            var baseGrid = btn.up("basegrid[xtype=reportcenter.eleccount.maingrid]");
            var mainlayout = baseGrid.up('basepanel');
            var wheresql1 = mainlayout.funData.wheresql1;
            var wheresql2 = mainlayout.funData.wheresql2;
            var title = "确定要导出用电统计表吗？";
            Ext.Msg.confirm('提示', title, function (btn, text) {
                if (btn == "yes") {
                    Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/PtEcTermStatus/doExportExcel?wheresql1='+wheresql1+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/PtEcTermStatus/checkExportEnd',
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
            filter.push({"type": "date", "value": girdSearchTexts[0].getValue(), "field": "beginDate", "comparison": ">="})

        }
        if(girdSearchTexts[1].getValue!=null){
            filter.push({"type": "date", "value": girdSearchTexts[1].getValue(), "field": "beginDate", "comparison": "<="})

        }
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);

    },
});