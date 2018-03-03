Ext.define("core.smartcontrol.climatecontrol.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.climatecontrol.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
        "basepanel basegrid": {
            beforeitemclick: function(grid, record, item, index, e, eOpts) {
                this.hideFuncBtn(grid);
            }
        },
    	"panel[xtype=smartcontrol.climatecontrol.maintree] button[ref=gridRefresh]": {
    		click: function(btn) {
                this.refreshMainGridStore(btn);
                return false;
            }
        },
      "basetreegrid[xtype=smartcontrol.climatecontrol.maintree]": {
            itemclick: function(tree, record, item, index, e, eOpts) {
                this.loadMianGridStore(tree,record);
                return false;
            }
        },

        "basegrid button[ref=gridOpen]": {
            beforeclick: function(btn) {

                this.doControl(btn,"开");

                return false;           
            }
        },
        "basegrid button[ref=gridClose]": {
            beforeclick: function(btn) {
                
                this.doControl(btn,"关");

                return false;
            }
        },
        "basegrid button[ref=gridSet]": {
            beforeclick: function(btn) {
                var self=this;
                var basegrid = btn.up('basegrid');
                   
                var tempValue=basegrid.down("numberfield[ref=tempSet]").getValue();
                if(!tempValue){
                    self.Warning('输入温度');
                    return false; 
                }else if(tempValue<17||tempValue>35){
                    self.Warning('温度在17~35度之内，请重新设定！');
                    return false; 
                }

                this.doControl(btn,tempValue);

                return false;
            }
        },

        //操作列
        "basegrid actioncolumn": {
            opneClick: function (data) {
                console.log(11);
                return false;
            },           
            closeClick:function(data){
                console.log(22);
                return false;
            },           
            setClick:function(data){
                console.log(33);
                return false;
            },
        },
    },

    doControl:function(btn,opt){
        var self=this;
        var basegrid = btn.up('basegrid');
        var selection = basegrid.getSelectionModel().getSelection();
        if(selection.length<=0){
            self.Warning('请至少选择一行数据');
            return false; 
        }
             
        var loading = self.LoadMask(basegrid,'正在执行，请稍等...');              

        var selRecords = new Array();
        for(var i=0;i<selection.length;i++){
            selRecords.push(selection[i].get("roomId"));
        }

        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtIrRoomDevice/doIrSend",
            params: {
                roomid: selRecords.join(','),
                opt: opt,
            },
            //回调代码必须写在里面
            success: function (response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if (data.success) {

                    loading.hide();

                    self.msgbox(data.obj);        

                } else {
                    self.Error(data.obj);
                    loading.hide();
                }
            },
            failure: function(response) {
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                loading.hide();
            }
        });

    },
     getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "deviceTypeCode", "comparison": ""})
        }
        return filter;

    },

    hideFuncBtn:function(grid){    
        var basePanel = grid.up("basepanel");
        var funCode = basePanel.funCode;
        var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
        var records = baseGrid.getSelectionModel().getSelection();
        var btnOpen = baseGrid.down("button[ref=gridOpen]");
        var btnClose = baseGrid.down("button[ref=gridClose]");
        var btnSet = baseGrid.down("button[ref=gridSet]");
        if (records.length == 0) {
            btnOpen.setDisabled(true);     
            btnClose.setDisabled(true);                   
            btnSet.setDisabled(true);       
        }else if (records.length == 1) {
           btnOpen.setDisabled(false);     
           btnClose.setDisabled(false);                   
           btnSet.setDisabled(false);  
       }else {
          btnOpen.setDisabled(false);     
          btnClose.setDisabled(false);                   
          btnSet.setDisabled(false);                 
        }
    },

    refreshMainGridStore:function(btn){    
        var baseGrid = btn.up("basetreegrid");
        var store = baseGrid.getStore();
        store.load(); //刷新父窗体的grid
        var mainlayout = btn.up("basepanel[xtype=smartcontrol.climatecontrol.mainlayout]");
        var mianGrid = mainlayout.down("basegrid[xtype=smartcontrol.climatecontrol.maingrid]");
        var store = mianGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.roomId="";
        proxy.extraParams.roomLeaf="";
    },

    loadMianGridStore:function(tree,record){    
        var self = this;
        var mainLayout = tree.up("panel[xtype=smartcontrol.climatecontrol.mainlayout]");
        var funData = mainLayout.funData;
        mainLayout.funData = Ext.apply(funData, {
            roomId: record.get("id"),
            roomLevel: record.get("level")
       });
        var storeGrid = mainLayout.down("panel[xtype=smartcontrol.climatecontrol.maingrid]");
        var store = storeGrid.getStore();
        var proxy = store.getProxy();

        //获取右边筛选框中的条件数据
        var filter=self.getFastSearchFilter(storeGrid); 
        filter.push({"type":"string","comparison":"","value":"空调","field":"deviceTypeName"});      
        filter = JSON.stringify(filter);
        //获取点击树节点的参数       
        var roomId= record.get("id");
        var roomLeaf=record.get("leaf");
        if(roomLeaf==true)
            roomLeaf="1";
        else
            roomLeaf="0";
        proxy.extraParams = {
            roomId: roomId,
            roomLeaf:roomLeaf,
            filter :filter
        };  
        store.loadPage(1); 
    }
    
});