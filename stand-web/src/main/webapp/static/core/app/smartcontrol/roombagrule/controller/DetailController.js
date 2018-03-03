Ext.define("core.smartcontrol.roombagrule.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.roombagrule.detailcontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil"
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	//区域列表刷新按钮事件
        "basetreegrid[xtype=smartcontrol.roombagrule.roomdefinetree] button[ref=gridRefresh]": {
            click: function (btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                var proxy = store.getProxy();    
                store.load(); //刷新父窗体的grid          
                return false;
            }
        },

        "basegrid[xtype=smartcontrol.roombagrule.roomgrid]": {     
            select: function(row , record , index ) {
            	this.doRoomSelect(row,record,index);
	        },
	        deselect:function(row , record , index ) {
	        	this.doRoomDeSelect(row,record,index);
	        },
        },

        // 打开选择人员界面
        "basegrid[xtype=smartcontrol.roombagrule.dormallotfinishgridtwo] button[ref=gridAssign]": {
            beforeclick: function(btn) {
            	this.doSelectUser(btn);
            	return false;
            }
        },
    },

    doRoomSelect:function(row , record , index){
    	var self=this;

    	var grid=row.view;
        var baseformtab = grid.up("baseformtab");
        var deDuctionMode = baseformtab.deDuctionMode;
        var roomMainLayout = grid.up('basepanel[xtype=smartcontrol.roombagrule.binddetaillayout]');
        var dormGrid = roomMainLayout.down('panel[xtype=smartcontrol.roombagrule.dormallotfinishgrid]');
        var dormGrid2 = roomMainLayout.down('panel[xtype=smartcontrol.roombagrule.dormallotfinishgridtwo]');
        var store = dormGrid.getStore();
        var store2= dormGrid2.getStore();
        if(deDuctionMode==0){//不扣费
            return false;
        }else if(deDuctionMode==1){//平均扣费

        //若为多选，则追加数据
        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/userList",
            params: {
             roomId: record.get('uuid')
         },
            //回调代码必须写在里面
            success: function (response) {                   
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));  
                var rows=data.rows;
                for(var i=0;i<data.totalCount;i++){
                    rows[i].roomId=record.get('uuid');  //加入此房间id值
                }         
                store.add(rows);          
            },
            failure: function(response) {
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                loading.hide();
            }
        });

        }else if(deDuctionMode==2){//指定扣费

            self.asyncAjax({
                url: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/assignUserList",
                params: {
                 filter: "[{'type':'string','comparison':'=','value':'" + record.get('uuid') + "','field':'roomId'}]",
                 limit:0,
                 start:0
             },
            //回调代码必须写在里面
            success: function (response) {                  
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));  
                var rows=data.rows;                            
                store2.add(rows);         
            },
            failure: function(response) {
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                loading.hide();
            }
        });

        }	
     },

    doRoomDeSelect:function(row , record , index){    
    	var self=this;

    	var grid=row.view;

    	var len=grid.getSelectionModel().getSelection().length;
    
        var roomMainLayout = grid.up('basepanel[xtype=smartcontrol.roombagrule.binddetaillayout]');
        var dormGrid = roomMainLayout.down('panel[xtype=smartcontrol.roombagrule.dormallotfinishgrid]');
        var dormGrid2 = roomMainLayout.down('panel[xtype=smartcontrol.roombagrule.dormallotfinishgridtwo]');
        var store = dormGrid.getStore();
        var store2= dormGrid2.getStore();

        if(len>0){
        	var data1=store.getData().items;         
        	for(var i=data1.length-1;i>=0;i--){
        		if(record.get('uuid')==data1[i].get("roomId"))
        			store.remove(data1[i]);
        	}
        }else {
        	store.removeAll();
        	store2.removeAll();	 
        }
    },

    doSelectUser:function(btn){
    	var self = this;
        //得到组件
        var baseGrid = btn.up("basegrid");

    	var basetab = btn.up('baseformtab');

    	var roomMainLayout = btn.up('basepanel[xtype=smartcontrol.roombagrule.binddetaillayout]');
    	var roomGrid = roomMainLayout.down('basegrid[xtype=smartcontrol.roombagrule.roomgrid]');
                     
        var selectGrid = roomGrid.getSelectionModel().getSelection();
        if (selectGrid.length < 1) {
            self.Warning("选择房间才能继续操作。");
            return false;
        }
        if (basetab.insertObj.deDuctionMode != '2') {
            self.Warning("选择规则的扣费模式不是指定扣费，无法选择指定扣费人员!");
            return false;
        }

        var roomInfos=new Array();       
        //获取选择的房间
        for(var i=0;i<selectGrid.length;i++){
        	var info=new Object();
        	info.roomId=selectGrid[i].get('uuid');
        	info.roomName=selectGrid[i].get('roomName');
        	roomInfos.push(info);
        }

       
        //得到配置信息
        var detCode = "selectuser_detail"; 
        var detLayout = "pubselect.selectuserlayout";		     
        //关键：window的视图控制器
        var otherController = 'smartcontrol.roombagrule.othercontroller';
        
        
        var popFunData = {
            grid: baseGrid,
            roomInfos:roomInfos
        };
     
        var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls: 'x-fa fa-plus-circle',
            operType: 'add',
            width: 1000,
            height: 550,
            controller: otherController, //指定视图控制器，从而能够使指定的控制器的事件生效
            funData: popFunData,
            funCode: detCode,
            insertObj: basetab.insertObj,
            items: [{
                xtype: detLayout,
                items: [{
			        xtype:'pubselect.selectusergrid',
			        flex:1,
			        region: "center",
			        margin:'5',
			        extParams: {						        
				    },
				    selModel: {
				        type: "checkboxmodel",   
				        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
				        mode:'single',  //multi,simple,single；默认为多选multi						        
				    },
			    }]
            }]
        });
        win.show();	
    }
});