Ext.define("core.baseset.teacherdorm.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.teacherdorm.othercontroller',
    mixins: {
    },
    init: function () {
    	var self=this;
    	this.control({
    		"baseformtab[detCode=teacherdorm_detail] button[ref=formSave]": {
    			beforeclick: function (btn) {    
    				this.saveDetail_Tab(btn);
    				return false;
    			}
    		},
    	})
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
        var params;

		var grid = basetab.funData.grid; //此tab是否保存有grid参数

		var resObj = self.ajax({
		  url: funData.action + "/getDefineInfo",
		  params: {
		  	dormId:win.funData.dormId
		  }
		});
        var bedCount=formObj.findField("bedCount").getValue().split(",");
		var arkCount=formObj.findField("arkCount").getValue().split(",");

		var defined=grid.store.totalCount;
		if (resObj.dormBedCount < bedCount.length+defined) {
			self.msgbox("床位数量不能超过已经定义的");
			return;
		}
		if (resObj.dormChestCount < arkCount.length+defined) {
			self.msgbox("柜子数量不能超过已经定义的");
			return;
		}

        //验证表单是否通过
        if (formObj.isValid()) {    
            params = self.getFormValue(formObj);    //获取表单的值
            var loading = self.LoadMask(basetab);
    
            self.asyncAjax({
                url: funData.action + "/doAdd",
                params: params,                
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {
                        self.msgbox("提交成功!");
                    	grid.getStore().store.load();                         
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