
Ext.define("core.wisdomclass.roomterm.controller.OtherController", {
	  extend: "Ext.app.ViewController",
	    alias: 'controller.wisdomclass.roomterm.othercontroller',
	    mixins: {
	    	suppleUtil: "core.util.SuppleUtil",
	        messageUtil: "core.util.MessageUtil",
	        formUtil: "core.util.FormUtil",
	        gridActionUtil: "core.util.GridActionUtil",
	        dateUtil: 'core.util.DateUtil'
	     },
	    init: function() {
	    },
	    /** 该视图内的组件事件注册 */
	    control: {
	    	"baseformtab[detCode=roomterm_detail] button[ref=formSave]": {
	    		beforeclick: function(btn) {
	    			this.saveDetail_Tab(btn);
	    			return false;
	    		}
	    	},
            "mtfuncwindow[funcPanel=baseset.terminal.mainlayout]": {
                afterrender: function(grid) {
                    var basegrid = grid;
                    var toolbar = basegrid.down("toolbar[ref=panelTopBar]");
                    toolbar.removeAll();
                    return false;
                }
            },
      } ,

    saveDetail_Tab:function(btn){
        var self=this;
        //获取组件
        var basetab = btn.up('baseformtab');
        //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var roomId = basetab.funData.roomId;
        var roomName = basetab.funData.roomName;
        //找到详细布局视图和详细表单
      
        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");
        var funData = detPanel.funData;
        var formObj = objForm.getForm();    //获取表单对象
        var upData = new Array();
        var termId, termCode, mpNumb;
        for (var i = 0; i < 5; i++) {
            var k = i + 1;
            termId = Ext.valueFrom(formObj.findField("termId" + k).getValue(), null);
            termCode = Ext.valueFrom(formObj.findField("termCode" + k).getValue(), null);
            mpNumb = Ext.valueFrom(formObj.findField("houseNumb" + k).getValue(), null);
            if (!Ext.isEmpty(mpNumb)) {
                for (var j = i + 1; j < 5; j++) {
                    var l = j + 1
                    var termCodett = Ext.valueFrom(formObj.findField("termCode" + l).getValue(), null);
                    if (termCode!=null&&termCode === termCodett) {
                        self.msgbox("终端配置重复，请重新设置");
                        return false;
                        break;
                    } else {
                        if (!Ext.isEmpty(mpNumb) && !(Ext.isEmpty(termCode))) {
                            upData.push("{'uuid':'" + termId + "','termCode':'" + termCode + "','houseNumb':'" + mpNumb + "'}");
                        }
                        break;
                    }
                }
            } else {
                break;
            }
        }

        //验证表单是否通过
        if (formObj.isValid()) {    

            var loading = self.LoadMask(basetab);
    
            self.asyncAjax({
            	url: funData.action + "/doSetTerminal",
            	params: {
            		terminals: "[" + upData.join(",") + "]",
            		roomId: roomId,
            		roomName: roomName
            	},              
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                        
                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            var proxy = store.getProxy();
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