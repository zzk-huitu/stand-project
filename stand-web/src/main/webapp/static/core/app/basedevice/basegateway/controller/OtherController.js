Ext.define("core.basedevice.basegateway.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.basegateway.othercontroller',
     mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil"
    },
    init: function () {
    	this.control({
    		//网络参数单个设置
    		 "baseformtab[detCode=networkform] button[ref=formSave]": {
                beforeclick: function (btn) {                
                    this.saveDetail_Tab(btn,"netWork");
                    return false;
                }
            },
            //网关参数设置
    		 "baseformtab[detCode=baseandhighform] button[ref=formSave]": {
                beforeclick: function (btn) {                
                    this.saveDetail_Tab(btn,"baseAndHigh");
                    return false;
                }
            },
            
        })
    },

      saveDetail_Tab:function(btn,cmd){
        var self=this;
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页
        var uuid = tabItem.uuid;

        var detCode = basetab.detCode;
        var detLayout = basetab.detLayout;  

        var objForm = basetab.down("baseform[xtype=" +detLayout+ "]");
        var formObj = objForm.getForm();
        var params = self.getFormValue(formObj); 
        var url="";  

        /*处理提交的参数*/
        switch (cmd) {

            case "netWork":
                Ext.apply(params, objForm.formData, {
	            	uuid: uuid
	            });
	            url=comm.get('baseUrl') + "/BaseGateway/gatewayParam";
                break;
            case "baseAndHigh":
	            var valInt = '';
	            for (var i = 1; i <= 4; i++) {
	            	valInt += Ext.util.Format.date("0 "+params["time" + i + ""], 'H:i') + "|";
	            };
	            valInt = valInt.substring(1, valInt.length - 1);
	            Ext.apply(params, objForm.highFormData, {
	            	uuid: uuid,
	            	'tlvs[0].valStr': valInt,
	            });

	            Ext.apply(params, objForm.baseFormData);

	            url= comm.get('baseUrl') + "/BaseGateway/baseAndHighParam";//基础和高级sava合并一个方法
	            break;
         }
        
        //判断当前是保存还是修改操作
        if (formObj.isValid()) {

            var loading = new Ext.LoadMask(basetab, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            self.asyncAjax({
            	url: url,
                params: params,
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                  
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