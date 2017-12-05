Ext.define("core.basedevice.ptirroomdevice.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.ptirroomdevice.maincontroller',
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
       "basepanel basegrid[xtype=basedevice.ptirroomdevice.maingrid]": {
              afterrender : function(grid) {
                if(comm.get("isAdmin")!="1"){
                    var menuCode="PTIRROOMDEVICE";     // 此菜单的前缀
                    var userBtn=comm.get("userBtn");
                    if(userBtn.indexOf(menuCode+"_gridBinDing")==-1){
                        var btnBinDing = grid.down("button[ref=gridBinDing]");
                        btnBinDing.setHidden(true);
                        
                     }
                 }
            },
        },
    	//绑定品牌列表事件
    	"basegrid[xtype=basedevice.ptirroomdevice.maingrid] button[ref=gridBinDing]": {
            beforeclick: function(btn) {
           	 this.dobinding(btn);
            }
        },
        "basegrid[xtype=basedevice.ptirroomdevice.maingrid] button[ref=exportExcel]": {
                beforeclick: function(btn) {
                    this.doExportExcel(btn);
                    return false;
                }
         },
        //房间列表刷新按钮
    	"basetreegrid[xtype=basedevice.ptirroomdevice.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                btn.up('basetreegrid').getStore().load();
                var mainlayout = btn.up("basepanel[xtype=basedevice.ptirroomdevice.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=basedevice.ptirroomdevice.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                 return false;
                }
        },
    },
    
    //绑定品牌列表事件
    dobinding: function (btn) {
    	var self = this;
        var mainlayout = btn.up('panel[xtype=basedevice.ptirroomdevice.mainlayout]');
        var tree = mainlayout.down('panel[xtype=basedevice.ptirroomdevice.roominfotree]');
        var rows = tree.getSelectionModel().getSelection();
        var roomId = "";
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('level') == 5) {
                roomId += rows[i].get('id') + ",";
            }
        };
        if (roomId == '') {
            self.msgbox("请选择需要绑定的房间!");
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
					xtype: "basedevice.ptirroomdevice.irdevicegrid"													
				}],
        })
		
		win.show(true,function(){},baseGrid);//打开自定义窗口
        return false;
    },
        doExportExcel:function(btn) {
            var self = this;
            var baseGrid = btn.up("basegrid");
            var toolBar = btn.up("toolbar");
            if (!toolBar)
            return false;
            var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
            var deviceTypeCode = "";
            if(girdSearchTexts[0].getValue()!=null){
                deviceTypeCode = girdSearchTexts[0].getValue();
            }
            var mainLayout = baseGrid.up("basepanel[xtype=basedevice.ptirroomdevice.mainlayout]")
            var mianGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
            var proxy = mianGrid.getStore().getProxy();
            var roomId = proxy.extraParams.roomId;
            if(roomId==undefined){
               roomId="";
            }
            var title = "确定要导出房间红外设备的信息吗？";
            Ext.Msg.confirm('提示', title, function (btn, text) {
                if (btn == "yes") {
                    Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                    var component = Ext.create('Ext.Component', {
                        title: 'HelloWorld',
                        width: 0,
                        height: 0,
                        hidden: true,
                        html: '<iframe src="' + comm.get('baseUrl') + '/BasePtIrRoomDevice/exportExcel?deviceTypeCode='+deviceTypeCode+'&roomId='+roomId+'"></iframe>',
                        renderTo: Ext.getBody()
                    });

                    var time = function () {
                        self.syncAjax({
                            url: comm.get('baseUrl') + '/BasePtIrRoomDevice/checkExportEnd',
                            timeout: 1000 * 60 * 30,        //半个小时
                            //回调代码必须写在里面
                            success: function (response) {
                                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                                if (data.success) {
                                    Ext.Msg.hide();
                                    self.msgbox(data.obj);
                                    component.destroy();
                                } else {
                                    if (data.obj == 0) {    //当为此值，则表明导出失败
                                        Ext.Msg.hide();
                                        self.Error("导出失败，请重试或联系管理员！");
                                        component.destroy();
                                    } else {
                                        setTimeout(function () {
                                            time()
                                        }, 1000);
                                    }
                                }
                            },
                            failure: function (response) {
                                Ext.Msg.hide();
                                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                                component.destroy();
                            }
                        });
                    };
                    setTimeout(function () {
                        time()
                    }, 1000);    //延迟1秒执行
                }
            });
           return false;
        }
});