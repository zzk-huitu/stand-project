Ext.define("core.wisdomclass.classstar.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classstar.othercontroller',
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
    	 "baseformtab[detCode=classstar_detail] button[ref=formSave]": {
            beforeclick: function(btn) {
            	this.saveDetail_Tab(btn);
            	return false;
            }
        },
       "baseform[xtype=wisdomclass.classstar.detailform] ": {
            afterrender: function (grid) {
              var baseformtab = grid.up("baseformtab");
              var classContainer =  grid.down("container[ref=classContainer]");
              var cmd = baseformtab.operType;
              if(cmd=="edit"){
                 classContainer.setVisible(true);
             }else{
                classContainer.setVisible(false);
           }
           return false;
       }
   },
    },

    saveDetail_Tab:function(btn){
        var self=this;

        //获取组件
        var basetab = btn.up('baseformtab');
        
        //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var cmd = basetab.operType;
        var starLevel = basetab.starLevel;
        //找到详细布局视图和详细表单
        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");

        var formObj = objForm.getForm();    //获取表单对象
        var funData = detPanel.funData;     //获取详细视图下面的funData数据
        var pkName = funData.pkName;        //获取主键字段
        var pkField = formObj.findField(pkName);    //获取主键表单文本对象
        var params = self.getFormValue(formObj);    //获取表单的值
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
                            var proxy = store.getProxy();
                            proxy.extraParams.starLevel=starLevel;
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

    doSave: function(btn, cmd) {
    	var self = this;
    	var win = btn.up('window');
    	var funCode = win.funCode;
    	var doType = win.cmd;
    	var grid = win.funData.grid;
    	var basePanel = win.down("basepanel[funCode=" + funCode + "]");
    	var objForm = basePanel.down("baseform[funCode=" + funCode + "]");
    	var formObj = objForm.getForm();
    	var funData = basePanel.funData;
    	var pkName = funData.pkName;
    	var pkField = formObj.findField(pkName);
    	var params = self.getFormValue(formObj);
    	if (doType == "addReturn") {
    		var isSelectGrid = basePanel.down("panel[xtype=classstar.isclassgrid]");
    		var isSelectStore = isSelectGrid.getStore();
    		var ids = [];
    		var className = [];
    		isSelectStore.each(function(record) {
    			ids.push(record.getData().uuid);
    			className.push(record.getData().className);
    		})
    		if (ids.length == 0) {
    			self.Warning("请选择班级");
    			return false;
    		}
    		params = Ext.apply(params, {
    			claiId: ids.join(","),
    			className: className.join(",")
    		})
    	}
        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doadd" : "doupdate";
        if (formObj.isValid()) {
        	var resObj = self.ajax({
        		url: funData.action + "/" + act,
        		params: params
        	});
        	if (resObj.success) {
        		self.msgbox("保存成功!");
        		if (grid) {
        			var store = grid.getStore();
        			var proxy = store.getProxy();
        			proxy.extraParams = {
        				filter: win.funData.filter
        			}
        			store.load();
        		}
        		win.close();
        	} else {
        		if (!Ext.isEmpty(resObj.obj))
        			self.Info(resObj.obj);
        	}
        } else {
        	var errors = ["前台验证失败，错误信息："];
        	formObj.getFields().each(function(f) {
        		if (!f.isValid()) {
        			errors.push("<font color=red>" + f.fieldLabel + "</font>:" + f.getErrors().join(","));
        		}
        	});
        	self.msgbox(errors.join("<br/>"));
        }
    },
});