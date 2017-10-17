Ext.define("core.basedevice.ptirroomdevice.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.ptirroomdevice.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil"
    },
    init: function () {
    },
    /** 该视图内的组件事件注册 */
    control: {
    	
    	//弹出窗口的确认按钮
    	"baseformwin[funCode=ptirroomdevice_branddetaillayout] button[ref=formSave]": {
            beforeclick: function(btn) {
                this.savebinding_Win(btn);
             },
    	 }
    
    },
    
    //确认绑定事件
    savebinding_Win:function(btn){
      var win = btn.up('window');
      var baseGrid =win.baseGrid;
      var mainlayout = win.down('panel[xtype=basedevice.irdevice.mainlayout]');
      var grid = mainlayout.down("panel[xtype=basedevice.irdevice.maingrid]");
      var rows = grid.getSelectionModel().getSelection();
      
      //定义品牌ID
      var brandId = '';
      if (rows.length <= 0) {
          self.Warning("请选择型号!");
          return false;
      } else {
          for (var i = 0; i < rows.length; i++) {
              brandId += rows[i].get('uuid') + ",";
          };
      }
      
      //发送请求
      resObj = this.ajax({
          url: comm.get('baseUrl') + "/PtIrRoomDevice/doadd",
          params: {
              roomId: win.roomId,
              brandId: brandId
          }
      });
      if (resObj.success) {
    	  win.close();
    	  this.msgbox('成功');
          baseGrid.getStore().load();
          return false;
      } else {
    	  this.msgbox(resObj.obj);
    	  return false;
      }
    }
    
});