Ext.define("core.reportcenter.ptsktermstatus.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.ptsktermstatus.maincontroller',
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
        "basetreegrid[xtype=reportcenter.ptsktermstatus.roominfotree] button[ref=gridRefresh]": {
                beforeclick: function(btn) {
                var baseGrid = btn.up("panel[xtype=reportcenter.ptsktermstatus.roominfotree]");
                var store = baseGrid.getStore();
                store.load(); // 刷新父窗体的grid
                return false;
            }
        },
        "basetreegrid[xtype=reportcenter.ptsktermstatus.roominfotree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                var self = this;
                var mainLayout = tree.up("panel[xtype=reportcenter.ptsktermstatus.mainlayout]");
               
                var storeyGrid = mainLayout.down("panel[xtype=reportcenter.ptsktermstatus.maingrid]");
                var store = storeyGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId=record.get("id");
                store.loadPage(1); 
                return false;
            }
       },

        //快速搜索按按钮
        "basepanel basegrid button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
                this.queryFastSearchForm(btn);
                return false;
            }
        },
        //快速搜索文本框回车事件
        "basepanel basegrid field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    this.queryFastSearchForm(field);                
                }
                return false;
            }
        },


        "basegrid[xtype=reportcenter.ptsktermstatus.maingrid] button[ref=gridExport]": {
            beforeclick: function(btn) {
                this.doExport(btn);
                return false;
            }
        },
  
    

    },
    doExport:function(btn){
        var self = this;
        var baseGrid = btn.up("basegrid[xtype=reportcenter.ptsktermstatus.maingrid]");
        var basepanel = baseGrid.up('basepanel');
        var roominfotreegrid = basepanel.down("basetreegrid[xtype=reportcenter.ptsktermstatus.roominfotree]");
        var records = roominfotreegrid.getSelectionModel().getSelection();
        if(records.length>0){
          var roomId = records[0].get('id');
        }
      
        var title = "确定要导出水控使用状态吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/PtSkTermStatus/doExportExcel?roomId='+roomId+'"></iframe>',
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
        if(recs.length<=0){
            self.msgbox("至少选择一个房间。");
            return false;
        }
        var baseGrid = btn.up("basegrid");
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var filter=new Array();

        if(girdSearchTexts[0].getValue()){
            var value =girdSearchTexts[0].getValue();
            filter.push({"type": "date", "value": value, "field": "statusDate", "comparison": ">="})

        }
        if(girdSearchTexts[1].getValue()){
            var value =girdSearchTexts[1].getValue();
            filter.push({'type': 'date', 'value': value, 'field': 'statusDate', 'comparison': '<='})
        }
        var store = baseGrid.getStore();
        var proxy = store.getProxy();

        if(filter.length==0)
            delete proxy.extraParams.filter;
        else
            proxy.extraParams.filter = JSON.stringify(filter);

        store.loadPage(1);

    },

});