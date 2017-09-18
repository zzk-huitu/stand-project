Ext.define("core.baseset.calendar.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.calendar.othercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil"
    },
    init: function () {
    	var self = this
            //事件注册
        this.control({
    	    
            "baseformtab[detCode=calendarMain_detail] button[ref=formSave]": {
                beforeclick: function (btn) {                
                    this.saveDetail_Tab(btn);
                    return false;
                }
            },

        });
    },


    saveDetail_Tab:function(btn){
        var self=this;

        //获取组件
        var basetab = btn.up('baseformtab');
        
        //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        //找到详细布局视图和详细表单
        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");

        var formObj = objForm.getForm();    //获取表单对象
        var funData = detPanel.funData;     //获取详细视图下面的funData数据
        var pkName = funData.pkName;        //获取主键字段
        var pkField = formObj.findField(pkName);    //获取主键表单文本对象
        var params = self.getFormValue(formObj);    //获取表单的值

        /*处理提交的参数*/
        params.beginTime = Ext.util.Format.date("0 "+params.beginTime, 'Y-m-d H:i:s');
        params.endTime = Ext.util.Format.date("0 "+params.endTime, 'Y-m-d H:i:s');

        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";

        //验证表单是否通过
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
                           // var proxy = store.getProxy();
                           // proxy.extraParams.filter='[{"type":"string","value":"'+funData.canderId+'","field":"canderId","comparison":""}]';
                            //act=="doAdd"?store.loadPage(1):store.load();    
                            store.load();                         
                        }
                        loading.hide();

                        //获取当前tab页
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

});