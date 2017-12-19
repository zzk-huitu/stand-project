Ext.define("core.baseset.roomdefine.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.roomdefine.othercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil"
    },
    init: function () {
    	var self=this;
    	this.control({
    		"baseformtab[detCode=roomdefine_detail] button[ref=formSave]": {
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
        var sign=formObj.sign;

        var roomgrid = objForm.down("basegrid[xtype=baseset.roomdefine.roomgrid]");
        var roomName = objForm.down("textfield[name=roomName]").getValue();//房间标志
        if (roomName == null || roomName == '') {
            self.msgbox("房间名称不能为空。");
            return;
        }
       if(sign=="add"){
       /*处理提交的参数*/
        
        var selectObject = roomgrid.getSelectionModel().getSelection();
        // var roomName = objForm.down("textfield[name=roomName]").getValue();//房间标志
        var roomType = objForm.down("combobox[name=roomType]").getValue();//房间类型
        var areaId = basetab.areaId;
       
        if (selectObject.length <= 0) {
            self.msgbox("需选择房间才能继续操作!");
            return;
        }
        if (roomName != null && roomName != '') {
            if (selectObject.length > 1) {
                self.msgbox("一个房间只能配备一个名称!");
                return;
            }
        }
        var uuid = selectObject[0].get("uuid");
        params.uuid = uuid; 
        params.areaId = areaId;//树的id
        params.roomName = roomName;
        params.roomType = roomType;
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
                        loading.hide();
                        self.msgbox("提交成功!");
                        if(sign=="add"){
                            roomgrid.getStore().load();
                        }
                        var baseGrid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(baseGrid)) {
                            var store = baseGrid.getStore();
                            store.load();                         
                        }
                        

                        //获取当前tab页
                        var tabPanel = btn.up("tabpanel[xtype=app-main]");
                        var tabItem = tabPanel.getComponent(basetab.tabItemId);
                        if(sign=="edit"){
                           tabPanel.remove(tabItem);
                        }else
                            objForm.down("textfield[name=roomName]").setValue("");//房间标志 
                      } else {
                        loading.hide();
                        self.Error(data.obj);                    
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