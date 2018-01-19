Ext.define("core.reportcenter.sbxx.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.sbxx.maincontroller',
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
        "basegrid[xtype=reportcenter.sbxx.maingrid] button[ref=gridExport]": {
            beforeclick: function(btn) {
                this.doExport(btn);
                return false;
            }
        },

    },
    doExport:function(btn){
        var self = this;
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var termName= "";
        var roomName = "";
        if(girdSearchTexts[0].getValue()){
            termName = girdSearchTexts[0].getValue();
        }
        if(girdSearchTexts[1].getValue()){
            roomName = girdSearchTexts[1].getValue();
        }
      var title = "确定要导出电控使用状态吗？";
      Ext.Msg.confirm('提示', title, function (btn, text) {
        if (btn == "yes") {
            Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
            var component = Ext.create('Ext.Component', {
                title: 'HelloWorld',
                width: 0,
                height: 0,
                hidden: true,
                html: '<iframe src="' + comm.get('baseUrl') + '/BasePtTerm/doSbxxExportExcel?termName='+termName+'&roomName='+roomName+'"></iframe>',
                renderTo: Ext.getBody()
            });
            var time = function () {
                self.syncAjax({
                    url: comm.get('baseUrl') + '/BasePtTerm/checkSbxxExportEnd',
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
    
});