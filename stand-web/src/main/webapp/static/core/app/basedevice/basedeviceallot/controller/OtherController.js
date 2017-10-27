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
    	
    	//弹出窗口的确认按钮
    	 "panel[xtype=basedevice.basedeviceallot.devicesysgrid] button[ref=gridAdde]": {
            beforeclick: function(btn) {
                this.saveAllot(btn);
             },
    	 },
    	
    	 "panel[xtype=basedevice.basedeviceallot.deviceallotgrid] button[ref=gridFastSearchBtn]": {
             beforeclick: function(btn) {
                 this.doFastSearchTerm(btn);
                 return false;
              },
     	 },
    },
    
  //确认绑定事件
    saveAllot:function(btn){
      var self = this; 
      var baseGrid =btn.up("basegrid");
      var allotlayout = btn.up('panel[xtype=basedevice.basedeviceallot.deviceallotlayout]');
      var treegrid = allotlayout.down('panel[xtype=basedevice.basedeviceallot.roominfotree2]');
      var rows = baseGrid.getSelectionModel().getSelection();
      
      if (rows <= 0) {
          Ext.Msg.alert("提示", "请选择列表中的数据!");
          return false;
      }
      var  roomId = "";
      var uuid ="";
      for (var i = 0; i < rows.length; i++) {
          var store = rows[i];
          roomId = store.data.roomId;
          uuid = store.data.uuid + "," + uuid;
      }
      var sss = Ext.Msg.wait('正在处理中...', '等待');
      var resObj = null;
      setTimeout(function() {
          resObj = self.ajax({
              url: comm.get('baseUrl') + "/BasePtTerm/doAdd",
              params: {
                  roomId: roomId,
                  uuid: uuid
              }
          });
          if (resObj.success) {
        	  baseGrid.getStore().removeAll();
              sss.hide();
              self.msgbox(resObj.obj);
          } else {
              self.msgbox(resObj.obj);
              sss.hide();
          }
      }, 200)
      return false;
  },
      
    //快速搜索
  doFastSearchTerm:function(btn){
        //得到组件 
        var baseGrid = btn.up("basegrid"); 
        if(!baseGrid)
            return false;

        var toolBar= btn.up("toolbar");
        if(!toolBar)
            return false;
        var termSN;
        var termNo;
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        for(var i in girdSearchTexts){
            var name = girdSearchTexts[i].getName();
            var value = girdSearchTexts[i].getValue();
            if(name=="termSN"){
            	termSN=value;
            }
            if(name=="termNo"){
            	termNo=value;
            }	
        }
        
        var store = baseGrid.getStore();
        var proxy = store.getProxy();                        
        if(termSN!=""){
        	proxy.extraParams.termSN=termSN;
        }
        if(termNo!=""){
        	proxy.extraParams.termNo=termNo;
        }
        store.loadPage(1);
    },
    
});