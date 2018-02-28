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
                this.hideFuncBtn(grid);
            },
        },
    	//绑定品牌列表事件
    	"basegrid[xtype=basedevice.ptirroomdevice.maingrid] button[ref=gridBinDing]": {
            beforeclick: function(btn) {
           	 this.dobinding(btn);
            }
        },
        "basegrid[xtype=basedevice.ptirroomdevice.maingrid] button[ref=gridExport]": {
            beforeclick: function(btn) {
                this.doExportExcel(btn);
                return false;
            }
         },

         "basetreegrid[xtype=basedevice.ptirroomdevice.roominfotree] ": {
                /*
                    当点击了这个树的子项后，在查询列表的条件中，要做如下工作：
                    1. 附带树节点的相关参数
                    2. 当存在basegrid的默认参数，则附带上去
                    3. 附带快速搜索中的参数（为了防止文本框的数据与实际查询的数据不一致，所以在下面代码中主动获取了文本框的数据）
                    4. reset清除高级搜索中的条件数据 以及 proxy.extraParams中的相关数据
                */
                itemclick: function(tree, record, item, index, e, eOpts) {                   
                    this.loadMainGridStore(tree,record);   
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
                proxy.extraParams.roomLeaf="";
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
				width: 1000,
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
        
            var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
            var deviceTypeCode = "";
            if(girdSearchTexts[0].getValue()!=null){
                deviceTypeCode = girdSearchTexts[0].getValue();
            }
            var mainLayout = baseGrid.up("basepanel[xtype=basedevice.ptirroomdevice.mainlayout]")
            var roominfotreegrid = mainLayout.down("basetreegrid[xtype=basedevice.ptirroomdevice.roominfotree]");
            var records = roominfotreegrid.getSelectionModel().getSelection();
            var roomId ="";
            var roomLeaf ="";
            if(records.length>0){
                roomId = records[0].get('id');
                roomLeaf = records[0].get("leaf");
                if(roomLeaf==true)
                    roomLeaf="1";
                else
                    roomLeaf="0";
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
                        html: '<iframe src="' + comm.get('baseUrl') + '/BasePtIrRoomDevice/doExportExcel?deviceTypeCode='+deviceTypeCode+'&roomId='+roomId+'&roomLeaf='+roomLeaf+'"></iframe>',
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
        },

        loadMainGridStore:function(tree,record){
            var mainLayout = tree.up("panel[xtype=basedevice.ptirroomdevice.mainlayout]");
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                roomId: record.get("id"),
                leaf : record.get("leaf"),//true: 房间 false:区域
                arealevel: record.get("level"),
            });
            // 加载房间的人员信息
            var mianGrid = mainLayout.down("panel[xtype=basedevice.ptirroomdevice.maingrid]");
             var girdSearchTexts = mianGrid.query("field[funCode=girdFastSearchText]");
            var filter=new Array();
            if(girdSearchTexts[0].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "deviceTypeCode", "comparison": ""})
            }
            if(filter.length==0)
                filter=null;
            else
                filter = JSON.stringify(filter);

            //获取点击树节点的参数
            var roomId= record.get("id");
            var roomLeaf=record.get("leaf");
            if(roomLeaf==true)
                roomLeaf="1";
            else
                roomLeaf="0";
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams={
                roomId:roomId,
                roomLeaf:roomLeaf,
                filter:filter
            }; 
            //proxy.extraParams.roomId=roomId;
            store.loadPage(1); // 给form赋值
            return false;
        },

        hideFuncBtn:function(grid){        
            if(comm.get("isAdmin")!="1"){
                var menuCode="PTIRROOMDEVICE";     // 此菜单的前缀
                var userBtn=comm.get("userBtn");
                if(userBtn.indexOf(menuCode+"_gridBinDing")==-1){
                    var btnBinDing = grid.down("button[ref=gridBinDing]");
                    btnBinDing.setHidden(true);
                    
                 }
             }
        }
});