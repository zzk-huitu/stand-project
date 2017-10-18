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
    	 },
    
    	//选择品牌类型绑定时候弹窗的快速查询
     	"basegrid[xtype=basedevice.ptirroomdevice.irdevicegrid] button[ref=gridFastSearchBtn]": {
            	 click:function(btn){             
                     this.doFastSearch(btn);
                     return false;
             }
         },
    },
    
    //确认绑定事件
    savebinding_Win:function(btn){
      var win = btn.up('window');
      var baseGrid =win.baseGrid;
      var grid = win.down('basegrid[xtype=basedevice.ptirroomdevice.irdevicegrid]');
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
          url: comm.get('baseUrl') + "/BasePtIrRoomDevice/doAdd",
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
    },
    
    //快速搜索
    doFastSearch:function(component){
        //得到组件 
        var baseGrid = component.up("basegrid"); 
        if(!baseGrid)
            return false;

        var toolBar= component.up("toolbar");
        if(!toolBar)
            return false;

        var filter= [];
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        for(var i in girdSearchTexts){
            var name = girdSearchTexts[i].getName();
            var value = girdSearchTexts[i].getValue();

            filter.push({"type":"string","value":value,"field":name,"comparison":""});
        }
        
        var store = baseGrid.getStore();
        var proxy = store.getProxy();                        
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);
    },
    
});