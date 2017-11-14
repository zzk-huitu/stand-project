Ext.define("core.basedevice.smartdevice.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.smartdevice.othercontroller',
    mixins: {
    	  suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil"
    },
    init: function () {
    },
    /** 该视图内的组件事件注册 */
    control: {
        "baseformtab[detCode=highparam_detail] button[ref=formSave]": {
            beforeclick: function (btn) {                
                this.saveHighParam_Tab(btn,"setHighParam");
                return false;
            }
        },
    },
    
    saveHighParam_Tab:function(btn,cmd){
        var self=this;
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页
        var uuid = tabItem.uuid;

        var detCode = basetab.detCode;
        var detLayout = basetab.detLayout;  

        var objForm = basetab.down("baseform");
        var formObj = objForm.getForm();
        var params = self.getFormValue(formObj); 
       
        //高级参数
        var valInt = '';
        for (var i = 1; i <= 4; i++) {
            valInt += Ext.util.Format.date("0 "+params["time" + i + ""], 'H:i') + "|";
        };
        valInt = valInt.substring(1, valInt.length - 1);
        //基本参数                    
        Ext.apply(params, objForm.highFormData,{
            'tlvs[0].valStr': valInt
        });
        params.termRadio=objForm.down("radiogroup[ref=termRadio]").getChecked()[0].inputValue;
        params.termTypeID= basetab.recordData.termTypeID;
        
        //判断当前是保存还是修改操作
        if (formObj.isValid()) {

            var loading = new Ext.LoadMask(basetab, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            self.asyncAjax({
                url: comm.get('baseUrl') + "/BasePtTerm/doSetHighParam",
                params: params,
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                        basetab.baseGrid.getStore().load();
                        loading.hide();
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
   
    
});