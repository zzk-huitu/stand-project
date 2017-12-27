Ext.define("core.wisdomclass.eccset.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.eccset.othercontroller',
    mixins: {  
       suppleUtil: "core.util.SuppleUtil",
       messageUtil: "core.util.MessageUtil",
       formUtil: "core.util.FormUtil"
   },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
            "baseformtab[detCode=eccset_detail] button[ref=formSave]": {
                beforeclick: function(btn) {
                    this.saveDetail_Tab(btn);
                    return false;
                }
            },
    },
   
    saveDetail_Tab: function(btn, cmd) {
        var self=this;
        var basetab = btn.up('baseformtab');
       

        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");

        var formObj = objForm.getForm();
        var funData = detPanel.funData;
        var pkName = funData.pkName;
        var pkField = formObj.findField(pkName);
         //考勤模式的单选按钮组
        var checkMode = self.getCheckMode();
        //是否需要签退选择框
        var needCheckout = 0;
        var temp = formObj.findField("needCheckout").getValue();
        if (temp) {
            needCheckout = 1;
        }
        var params = self.getFormValue(formObj);
        params = Ext.apply(params, {
            checkMode: checkMode,
            needCheckout: needCheckout,
            startUsing: 0
        });

        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate"; 
        if (formObj.isValid()) {    
            var loading = self.LoadMask(basetab);
    
            self.asyncAjax({
                url: funData.action + "/" + act,
                params: params,                
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {
                        self.msgbox("提交成功!");
                       
                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            act=="doAdd"?store.loadPage(1):store.load();                            
                        }
                        loading.hide();

                        var tabPanel = btn.up("tabpanel[xtype=app-main]");
                        var tabItem = tabPanel.getComponent(basetab.tabItemId);   
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


        } else {
            var errors = ["前台验证失败，错误信息："];
            formObj.getFields().each(function (f) {
                if (!f.isValid()) {
                    errors.push("<font color=red>" + f.fieldLabel + "</font>：" + f.getErrors().join(","));
                }
            });
            self.msgbox(errors.join("<br/>"));
        }

    },
        /**
     * 处理考勤模式单选框组
     * @param  {[type]} cmd [description]
     * @return {[type]}     [description]
     */
    getCheckMode: function(cmd) {
        var sValue = "";
        var select = Ext.getCmp('radcheckMode').getChecked();
        Ext.Array.each(select, function(item) {
            sValue = item.inputValue;
        });

        return sValue;
    }
});