Ext.define("core.basedevice.basedeviceallot.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.basedeviceallot.maincontroller',
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
    	
    	//分配设备按钮
    	"basegrid[xtype=basedevice.basedeviceallot.maingrid] button[ref=gridAllot]": {
            beforeclick: function(btn) {
           	 this.doallot(btn);
            }
        }
    	
    },
    
    
  //绑定品牌列表事件
    doallot: function (btn) {
    	var self = this;
        var mainlayout = btn.up('panel[xtype=basedevice.basedeviceallot.mainlayout]');
        var tree = mainlayout.down('panel[xtype=basedevice.basedeviceallot.roominfotree]');
        var rows = tree.getSelectionModel().getSelection();
        var roomId = "";
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('level') == 5) {
                roomId += rows[i].get('id') + ",";
            }
        };
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
		var win = Ext.getCmp(winId);
		
		if (!win) {
			win = Ext.create('core.base.view.BaseFormWin', {
				id: winId,
				title: "设备型号选择",
				/*zzk: 必须指定一个viewController控制器，否则，里面的control无法生效*/
				controller: otherController,
				width: 1350,
				height: 600,
				resizable: false,
				iconCls: iconCls,
				txtformSave: "确定",
				funData: popFunData,
				funCode: detCode,
				roomId :roomId,
				baseGrid :baseGrid,
				items: [{
					xtype: "basedevice.basedeviceallot.deviceallotlayout"													
				}],
        })
		}
		win.show(true,function(){},baseGrid);//打开自定义窗口
        return false;
    },
    
    
});