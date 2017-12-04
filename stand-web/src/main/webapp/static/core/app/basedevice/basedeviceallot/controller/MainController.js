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
    	
        //区域列表刷新按钮
        "basetreegrid[xtype=basedevice.basedeviceallot.roominfotree] button[ref=gridRefresh]": {
            beforeclick: function(btn) {
                btn.up('basetreegrid').getStore().load();
                var mainlayout = btn.up("basepanel[xtype=basedevice.basedeviceallot.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=basedevice.basedeviceallot.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                return false;
            }
        },
    	
        //分配设备按钮
    	"basegrid[xtype=basedevice.basedeviceallot.maingrid] button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {
           	    this.doAllot(btn);
                return false;
            }
        },
                
    	 "basegrid[xtype=basedevice.basedeviceallot.maingrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.doDeleteRecords(btn);
                return false;
            }
        },

         /**
         * 操作列的操作事件
         */
         "basegrid[xtype=basedevice.basedeviceallot.maingrid] actioncolumn": {

            deleteClick: function(data) {
                this.doDeleteRecords(null,data.view,data.record);
                return false;
            },
            
        }, 
        
    },
    
    //分配设备事件
    doAllot: function (btn) {
      	var self = this;
      	 //得到组件
      	var baseGrid=btn.up("basegrid");

      	var basePanel = baseGrid.up("basepanel");
        var detCode =  "deviceallot_layout";               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
         
      	var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
      	if (!otherController)
      		  otherController = '';  
         var itemXtype = "basedevice.basedeviceallot.deviceallotlayout";
         var xItemType=[{
            xtype:itemXtype,
            funCode:detCode
          }];
          var win = Ext.create('core.base.view.BaseFormWin', {
                      title: "分配设备",
                      width: 1150,
                      height: 650,
                      operType: "add",
                      controller: otherController,
                      detCode: detCode,
                      iconCls: 'x-fa fa-plus-circle',
                      baseGrid:baseGrid,
                      items:xItemType,
           }).show();
    },
    doDeleteRecords:function(btn,grid,record){
        var self=this;
        var records;
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
            records = baseGrid.getSelectionModel().getSelection();
        }else{
            records=new Array();
            records.push(record);
        }
        funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        //得到配置信息
        var funData = basePanel.funData;  
        var uuid = '';
        if (records.length <= 0) {
            self.msgbox('请选择一条数据');
            return;
        }

        if (records.length > 0) {
            //封装ids数组
            Ext.Msg.confirm('提示',"是否删除设备？", function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();


                    for (var i = 0; i < records.length; i++) {            
                        uuid += records[i].get('uuid') + ',';
                    };

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                             uuid: uuid                       
                        },                    
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                 baseGrid.getStore().remove(records); //不刷新的方式
                                 self.msgbox(data.obj);                               
                            }else {
                                self.Error(data.obj);
                            }           
                            loading.hide();
                        },
                        failure: function(response) {                   
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            loading.hide();
                        }
                    });     
                }
            });
        } else {
            self.msgbox("请选择数据");
        }
    },
});