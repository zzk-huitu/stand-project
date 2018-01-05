
Ext.define("core.system.appupdate.controller.OtherController", {
	extend: "Ext.app.ViewController",
	alias: 'controller.system.appupdate.othercontroller',
	mixins: {
		suppleUtil: "core.util.SuppleUtil",
		messageUtil: "core.util.MessageUtil",
		formUtil: "core.util.FormUtil",
		gridActionUtil: "core.util.GridActionUtil",
		dateUtil: 'core.util.DateUtil'
	},
	init: function() {

	},
	control: {
		"baseformtab[detCode=appupdate_detail] button[ref=formSave]":{
			beforeclick: function(btn) {
				this.doSave_Tab(btn);
				return false;
			}
		},

	},   
	doSave_Tab:function(btn){
     	var self=this;
		var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");
		var formObj = objForm.getForm();
		var params = self.getFormValue(formObj);
		if (formObj.isValid()) {
			var loading = new Ext.LoadMask(basetab, {
				msg: '正在提交，请稍等...',
				removeMask: true
			});
			loading.show();
           objForm.submit({
                url: comm.get('baseUrl') + "/SysAppinfo/doUploadApp",
                waitMsg: '正在上传文件...',
                timeout : 300000,
                success: function(form, action) {
                    self.msgbox("上传文件成功！");
                    var grid = basetab.funData.grid;                            
                    grid.getStore().load(); 
                    loading.hide();
                    tabPanel.remove(tabItem);;
                    },
                failure:function(form, action){
                    if(action.result==undefined){
                        self.Error("上传失败，请检查文件！");
                         loading.hide();
                    }else{
                        self.Error(action.result.obj);
                         loading.hide();
                    }

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
              
	}
});