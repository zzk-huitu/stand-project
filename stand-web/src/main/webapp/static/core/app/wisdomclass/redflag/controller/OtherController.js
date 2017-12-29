Ext.define("core.wisdomclass.redflag.controller.Otherontroller", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.redflag.othercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	 "baseformtab[detCode=redflag_detail] button[ref=formSave]": {
            beforeclick: function(btn) {
            	this.saveDetail_Tab(btn);
            	return false;
            }
        },
       "baseform[xtype=wisdomclass.redflag.detailform] ": {
            afterrender: function (grid) {
              var baseformtab = grid.up("baseformtab");
              var flagContainer =  grid.down("container[ref=flagContainer]");
              var cmd = baseformtab.operType;
              if(cmd=="edit"){
                 flagContainer.setVisible(true);
             }else{
                flagContainer.setVisible(false);
           }
           return false;
       }
   },
    },
     saveDetail_Tab:function(btn){
        var self=this;
        //获取组件
        var basetab = btn.up('baseformtab');
        var redflagType = basetab.redflagType;
        //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var cmd = basetab.operType;
        //找到详细布局视图和详细表单
      
        if(cmd=="edit"){
             var objForm = basetab.down("baseform[xtype=wisdomclass.redflag.detailform]");
        }else{
             var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
             var objForm = detPanel.down("baseform[funCode=" + detCode + "]");
        }
        var formObj = objForm.getForm();    //获取表单对象
        var pkField = formObj.findField("uuid");    //获取主键表单文本对象
        var params = self.getFormValue(formObj);    //获取表单的值
        //var redflagType = formObj.findField("redflagType").getValue();
    	if (cmd == "add") {
    		var isSelectGrid = detPanel.down("panel[xtype=public.SelectClass.isselectclassgrid]");
    		var isSelectStore = isSelectGrid.getStore();
    		var ids = [];
    		var className = [];
    		isSelectStore.each(function(record) {
    			ids.push(record.getData().uuid);
    			className.push(record.getData().className);
    		})
    		if (ids.length == 0) {
    			self.msgbox("请选择班级");
    			return;
    		}
    		params = Ext.apply(params, {
    			claiId: ids.join(","),
    			className: className.join(",")
    		})
    	}

        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";

        //验证表单是否通过
        if (formObj.isValid()) {    

            var loading = self.LoadMask(basetab);
    
            self.asyncAjax({
                url: comm.get("baseUrl") + "/ClassRedflag/" + act,
                params: params,                
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                        
                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams.redflagType=redflagType;
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