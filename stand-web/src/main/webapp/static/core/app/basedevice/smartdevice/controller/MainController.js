Ext.define("core.basedevice.smartdevice.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.smartdevice.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    
    init: function() {
    },
    control: {
    	
    	//绑定品牌列表事件
    	"basegrid[xtype=basedevice.smartdevice.maingrid] button[ref=gridBinDing]": {
            beforeclick: function(btn) {
           	 this.dobinding(btn);
            }
        },
        
        //房间列表刷新按钮
    	"basetreegrid[xtype=basedevice.smartdevice.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
             btn.up('basetreegrid').getStore().load();
             return false;
            }
        },
    },
    
    //绑定品牌列表事件
    dobinding: function (btn) {
    	var self = this;
        var mainlayout = btn.up('panel[xtype=basedevice.smartdevice.mainlayout]');
        var tree = mainlayout.down('panel[xtype=basedevice.smartdevice.roominfotree]');
        var rows = tree.getSelectionModel().getSelection();
        var roomId = "";
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('level') == 5) {
                roomId += rows[i].get('id') + ",";
            }
        };
        if (roomId == '') {
            self.Warning("请选择需要绑定的房间!");
            return false;
        }
        var  baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
		var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
		
		//关键：window的视图控制器
        var otherController=mainlayout.otherController;  
        if(!otherController)
            otherController='';

		//得到配置信息
		var funData = basePanel.funData;
		
		var popFunData = Ext.apply(funData, {
			grid: baseGrid
		});
		var detCode = basePanel.detCode;
		var iconCls = "x-fa fa-user-secret";
		var winId = detCode + "_win";
	    var win = Ext.create('core.base.view.BaseFormWin', {
				id: winId,
				title: "品牌型号选择",
				/*zzk: 必须指定一个viewController控制器，否则，里面的control无法生效*/
				controller: otherController,
				width: comm.get("clientWidth") * 0.8,
				height: 600,
				resizable: false,
				iconCls: iconCls,
				operType: "edit",
				txtformSave: "确定",
				funData: popFunData,
				funCode: detCode,
				roomId :roomId,
				baseGrid :baseGrid,
				items: [{
					xtype: "basedevice.smartdevice.irdevicegrid"													
				}],
        })
		
		win.show(true,function(){},baseGrid);//打开自定义窗口
        return false;
    },
    
});