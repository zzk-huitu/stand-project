Ext.define("core.public.importExcel.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.public.importExcel.maincontroller',
    mixins: {
        messageUtil: "core.util.MessageUtil",
        /*
        suppleUtil: "core.util.SuppleUtil",
       
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        */
    },
    init: function () {

    },

    control:{
        "panel[xtype=public.importExcel.importform] button[ref=formSave]": {
            beforeclick: function (btn) {            
                var self = this;
                var formPanel = btn.up('form');
                var url=formPanel.url;
                var downUrl=formPanel.downUrl;
                var objForm = formPanel.getForm();

                if (objForm.isValid()) {
                    objForm.submit({
                        url: url,
                        waitMsg: '正在导入文件...',
                        timeout: 1000 * 30 * 60,
                        success: function (form, action) {
                            if (action.result.obj == "-1") {
                                self.Info("数据部分导入成功，请查看错误信息或联系管理员！");
                          
                                //window.open(url);
                                window.location.href = downUrl;
                            } else {
                                self.Info("数据全部导入成功！");

                            }

                            var win = btn.up('window');
                            var grid = win.grid;
                            //刷新列表
                            grid.getStore().loadPage(1);
                            win.close();
                        },
                        failure: function (form, action) {
                            if (action.result == undefined) {
                                self.Error("文件导入失败，文件有误或超过限制大小！");
                            } else {
                                self.Error(action.result.obj);
                            }
                        }
                    });
                } else {
                    self.Error("请选择要上传Excel文件！")
                }

                return false
            }
        },
        "panel[xtype=public.importExcel.importform] button[ref=formClose]": {
            click: function (btn) {
                var win = btn.up('window');
                //关闭窗体
                win.close();
                return false;
            }
        },
    }
});