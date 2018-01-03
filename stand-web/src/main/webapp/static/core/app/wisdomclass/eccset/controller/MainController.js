Ext.define("core.wisdomclass.eccset.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.eccset.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
        var self = this;
        this.control({

            "basegrid[xtype=wisdomclass.eccset.maingrid] button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    var self = this;
                    var baseGrid = btn.up("basegrid");
                    var records = baseGrid.getSelectionModel().getSelection();
                    if(records.length!=1){
                     self.msgbox("请选择一条要编辑的数据！");
                     return false;
                  }
                 var startUsing = records[0].get("startUsing");
                 if (startUsing === 1) {
                    self.msgbox("当前规则已启用，不能修改");
                    return false;
                }
            }
            },
            "basegrid[xtype=wisdomclass.eccset.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    self.doDelete(btn);
                    return false;
                }
            },
    
         "basegrid[xtype=wisdomclass.eccset.maingrid] actioncolumn": {
            detailClick: function (data) {
                switch (data.cmd) {
                    case "setusing":
                        this.doUsingStatu(null,data.view,data.record,"using");
                        break;
                    case "setnousing":
                        this.doUsingStatu(null,data.view,data.record,"nousing");
                        break;
                    }
                return false;
            }
        },
        });
    },

    doDelete: function(btn) {
        var self = this;
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var ids = new Array();
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm('提示', '是否删除数据?', function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    var ids = new Array();
                    Ext.each(records, function (rec) {
                        var pkValue = rec.get(pkName);
                        if(rec.get("startUsing") === 0){
                            ids.push(pkValue); 
                        }
                       
                    });

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                            ids: ids.join(","),
                            pkName: pkName
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            var store=baseGrid.getStore();
                            if(data.success){
                                store.loadPage(1);
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

    doUsingStatu: function(btn,grid,record,cmd) {
        var self = this;
        var recordDate="";
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
            records = baseGrid.getSelectionModel().getSelection();
        }else{
            records=new Array();
            records.push(record);
        }
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var ids = new Array();
        if (records.length <= 0) {
            self.msgbox('请选择要启用/停用的数据');
            return;
        }
        for (var i = 0; i < records.length; i++) {
             var pkValue = records[i].get(pkName);
             ids.push(pkValue);
        };
        var title="";
        if(cmd=="nousing"){
              title = "确定要停用所选数据吗？";
        }else if(cmd=="using"){
              title = "确定要启用所选数据吗？"; 
        }
    
        Ext.Msg.confirm('警告', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                self.asyncAjax({
                    url: funData.action + "/doUsingorNo",
                    params: {
                        ids: ids.join(","),
                        pkName: pkName,
                        using: cmd,
                    },                       
                    success: function(response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        var store=baseGrid.getStore();
                        if(data.success){
                            store.loadPage(1);
                            self.msgbox(data.obj);                               
                        }else {
                        self.Error(data.obj);
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

});