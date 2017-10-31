Ext.define("core.accesscontrol.useraccess.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.accesscontrol.useraccess.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
    	var self = this;
    },
    /** 该视图内的组件事件注册 */
    control: {

		"baseformwin[funCode=useraccess_detail] button[ref=formSave]": {
			beforeclick: function (btn) {    
				this.saveDetail_Win(btn);
				return false;
			}
		},
	
    },
    
    saveDetail_Win:function(btn){
        var win = btn.up('window');
        var termid = win.termid;
        var termSN = win.termSN;
        var termName = win.termName;
        var funCode = win.funCode;
        //找到详细布局视图
        var selectUserlayout = win.down("panel[xtype=pubselect.selectuserlayout]");
        var isselectusergrid = selectUserlayout.down("panel[xtype=pubselect.isselectusergrid]");
        var selectroomgrid = selectUserlayout.down("basegrid");
        var getCount = isselectusergrid.getStore().getCount();
        if (getCount <= 0) {
        	this.msgbox("有数据才能继续操作!");
        	return;
        }
        var uuid = new Array();
        var isSelectStore = isselectusergrid.getStore();
        for (var i = 0; i < getCount; i++) {
        	 var record = isSelectStore.getAt(i);
        	 var pkValue = record.get("uuid");
             uuid.push(pkValue);
        };
        if (uuid.length > 0) {

	        this.asyncAjax({
	        	url: comm.get('baseUrl') + "/BaseMjUserright/doAdd",
	        	params: {
	        		userIds: uuid.join(","),
	        		termid: termid
	        	},              
	                //回调代码必须写在里面
	                success: function (response) {
	                	var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        var baseGrid = win.funData.grid; //此tab是否保存有grid参数
	                	if (data.success) {
	                		this.msgbox("提交成功!");
	                        if (!Ext.isEmpty(baseGrid)) {
	                        	var store = baseGrid.getStore();
	                        	store.load();                         
	                        }
	                        loading.hide();
	                        win.close();

	                    } else {
	                    	loading.hide();
	                    	this.Warning(data.obj);
	                    	var store = baseGrid.getStore();
	                        store.load();      
	                    	win.close();
	                    }
	                },
	                failure: function(response) {                   
	                	Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
	                	loading.hide();
	                }
	            });
		    }else {
		    	this.Warning("没有选择房间");
	        }

    },
    
});