Ext.define("core.basedevice.basedeviceallot.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.basedeviceallot.othercontroller',
    mixins: {
    	 suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
    	
    	
    },
    /** 该视图内的组件事件注册 */
    control: {
    	 "basetreegrid[xtype=basedevice.basedeviceallot.roominfotree2] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
             btn.up('basetreegrid').getStore().load();
             return false;
            }
        },
    	//弹出窗口的确认按钮
    	 "baseformwin[detCode=deviceallot_layout] button[ref=formSave]": {
            beforeclick: function(btn) {
                this.saveAllot(btn);
             },
    	 },
    },
    
  //确认绑定事件
    saveAllot:function(btn){
        var self = this; 
        var win = btn.up('window');
        var detCode = win.detCode;
        //找到详细布局视图
        var allotlayout = win.down("basepanel[funCode=" + detCode + "]");
        var treegrid = allotlayout.down('basetreegrid[xtype=basedevice.basedeviceallot.roominfotree2]');
        var baseGrid =allotlayout.down('panel[xtype=basedevice.basedeviceallot.devicesysgrid]');
        var rows =  baseGrid.getStore().getCount();
        if (rows <= 0) {
          self.msgbox("提示", "请选择列表中的数据!");
          return;
        }
        var isSelectStore = baseGrid.getStore();
        var  roomId = "";
        var uuid ="";
        for (var i = 0; i < rows; i++) {
            var record = isSelectStore.getAt(i);
            roomId+= record.get("roomId")+",";
            uuid += record.get("uuid") + "," ;
          }

        var loading = self.LoadMask(win);

        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtTerm/doAdd",
            params: {
             roomId: roomId,
             uuid: uuid
           },              
         success: function (response) {
             var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
             if (data.success) {
                self.msgbox("提交成功!");
                baseGrid.getStore().removeAll();                         
                loading.hide();
                win.close();
             } else {
                loading.hide();
                self.Warning(data.obj);
                win.close();
              }
          },
        failure: function(response) {                   
            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
            loading.hide();
          }
      });


      },
      
});