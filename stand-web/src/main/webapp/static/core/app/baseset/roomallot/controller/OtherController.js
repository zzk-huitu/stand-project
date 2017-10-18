Ext.define("core.baseset.roomallot.controller.OtherController", {
	extend: "Ext.app.ViewController",
	alias: 'controller.baseset.roomallot.othercontroller',
	mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        queryUtil: "core.util.QueryUtil"
    },
    init: function () {
		var self=this;
		this.control({
			"baseformtab[detCode=roomallot_detail] button[ref=formSave]": {
				beforeclick: function (btn) {    
					this.saveDetail_Tab(btn);
					return false;
				}
			},
			"baseformwin[funCode=roomallot_detail] button[ref=formSave]": {
				beforeclick: function (btn) {    
					this.saveDetail_Win(btn);
					return false;
				}
			},
		})
	},
  saveDetail_Win:function(btn){
        var self=this;
        var win = btn.up('window');
        var funCode = win.funCode;
        //找到详细布局视图
        var selectRoomlayout = win.down("basepanel[funCode=" + funCode + "]");
        var isselectroomgrid = selectRoomlayout.down("panel[xtype=baseset.roomallot.isselectteachergrid]");
        var selectroomgrid = selectRoomlayout.down("basegrid");
        var getCount = isselectroomgrid.getStore().getCount();
        if (getCount <= 0) {
        	self.msgbox("有数据才能继续操作!");
        	return;
        }
        var uuid = new Array();
        var isSelectStore = isselectroomgrid.getStore();
        for (var i = 0; i < getCount; i++) {
        	 var record = isSelectStore.getAt(i);
        	 var pkValue = record.get("uuid");
             uuid.push(pkValue);
        };
       var roomId = win.roomId;
        if (uuid.length > 0) {
	        var loading = self.LoadMask(win);

	        self.asyncAjax({
	        	url: comm.get('baseUrl') + "/BaseOfficeAllot/doAdd",
	        	params: {
	        		tteacId: uuid.join(","),
	        		roomId: roomId
	        	},              
	                //回调代码必须写在里面
	                success: function (response) {
	                	var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

	                	if (data.success) {

	                		self.msgbox("提交成功!");
	                        var baseGrid = win.funData.grid; //此tab是否保存有grid参数
	                        if (!Ext.isEmpty(baseGrid)) {
	                        	var store = baseGrid.getStore();
	                        	store.load();                         
	                        }
	                        loading.hide();
	                        win.close();

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
		    }else {
	            self.Warning("没有选择房间");
	        }

    },

    saveDetail_Tab:function(btn){
        var self=this;
        var basetab = btn.up('baseformtab');
         //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        //找到详细布局视图
        var selectRoomlayout = basetab.down("basepanel[funCode=" + detCode + "]");
        var isselectroomgrid = selectRoomlayout.down("panel[xtype=baseset.roomallot.isselectteachergrid]");
        var selectroomgrid = selectRoomlayout.down("basegrid");
        var getCount = isselectroomgrid.getStore().getCount();
        if (getCount <= 0) {
        	self.msgbox("有数据才能继续操作!");
        	return;
        }
        var uuid = new Array();
        var isSelectStore = isselectroomgrid.getStore();
        for (var i = 0; i < getCount; i++) {
        	 var record = isSelectStore.getAt(i);
        	 var pkValue = record.get("uuid");
             uuid.push(pkValue);
        };
        var roomId = basetab.roomId;
        if (uuid.length > 0) {
	        var loading = self.LoadMask(basetab);

	        self.asyncAjax({
	        	url: comm.get('baseUrl') + "/BaseOfficeAllot/doAdd",
	        	params: {
	        		tteacId: uuid.join(","),
	        		roomId: roomId
	        	},              
	                //回调代码必须写在里面
	                success: function (response) {
	                	var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

	                	if (data.success) {

	                		self.msgbox("提交成功!");
	                        var baseGrid = basetab.funData.grid; //此tab是否保存有grid参数
	                        if (!Ext.isEmpty(baseGrid)) {
	                        	var store = baseGrid.getStore();
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
		    }else {
	            self.Warning("没有选择房间");
	        }

	},

});