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
                this.saveBinding_Win(btn);
                return false;
             },
    	 },
      "basegrid[xtype=basedevice.ptirroomdevice.irdevicegrid] button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
                var self = this;
                self.doFastSearch(btn);
                return false;
            }
        }
    },
    
    //确认绑定事件
    saveBinding_Win:function(btn){
        var self=this;
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

        var loading=self.LoadMask(win);
        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtIrRoomDevice/doAdd",
            params: {
                roomId: win.roomId,
                brandId: brandId
            },                       
          success: function(response) {
              var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

              loading.hide();
              if(data.success){
                   win.close();
                   baseGrid.getStore().load();
                   self.msgbox(data.obj);                               
               }else {
                  self.Error(data.obj);
              }           
              
            },
          failure: function(response) {                   
              Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
              loading.hide();
            }
        });     
   
    },
      doFastSearch: function (component) {
        //得到组件
        var baseGrid = component.up("basegrid");
        if (!baseGrid)
          return false;

        var toolBar = component.up("toolbar");
        if (!toolBar)
          return false;

        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var brandId= '';
        var level = '';
        if (girdSearchTexts[0].getValue() != ""){
             brandId = girdSearchTexts[0].getValue();
        }
        if (girdSearchTexts[1].getValue() != ""){

             level = girdSearchTexts[1].getValue();
        }
        var selectStore = baseGrid.getStore();
        var selectProxy = selectStore.getProxy();
        selectProxy.extraParams.brandId=brandId;
        selectProxy.extraParams.level=level;
        selectStore.loadPage(1);
    },
});