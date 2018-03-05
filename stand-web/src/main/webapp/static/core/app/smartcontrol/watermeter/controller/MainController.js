Ext.define("core.smartcontrol.watermeter.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.watermeter.maincontroller',
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
            /**
             * 表格单击事件
             */
            beforeitemclick: function(grid, record, item, index, e, eOpts) {
                this.hideFuncBtn(grid);
                //console.log(1231);
            }
        },

        
        "basegrid button[ref=gridBinding]": {
            beforeclick: function(btn) {
                this.doOpenBindDetail(btn,"edit");
                return false;
            }
        },            
        
         "basegrid  actioncolumn": {
            //计量设备 
             meterBingClick: function (data) {
               this.doOpenBindDetail(null, "bing", data.view, data.record);
               return false;
           },

       }

    },

    doOpenBindDetail:function(btn, cmd, grid, record){

        var self = this;
        var baseGrid;
        var recordData;

        //根据点击的地方是按钮或者操作列，处理一些基本数据
        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.getData();
        }

        //得到组件
        var funCode = baseGrid.funCode; //jobinfo_main
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel

        //得到配置信息
        var funData = basePanel.funData;
        var detCode =  "watermeter_binddetail";  
        var detLayout = "smartcontrol.watermeter.binddetaillayout";
        var defaultObj = funData.defaultObj;
                
        //关键：打开新的tab视图界面的控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });

      
        if (btn) {
            var rescords = baseGrid.getSelectionModel().getSelection();
            if (rescords.length != 1) {
                self.msgbox("请选择一条数据！");
                return;
            }
            recordData = rescords[0].getData();
        }
        //获取主键值
        var pkName = funData.pkName;
        var pkValue= recordData[pkName];
        
        var tabTitle = "计量绑定设备";
        var tabItemId = funCode+"_gridBindEdit"; 
        var operType = cmd; 
        insertObj = recordData;

        switch (cmd) {
          case "bing":
          tabTitle = recordData.measure+"-计量设备";
          tabItemId=funCode+"_meterBing"; 
          detCode =  "meter_bind";  
          detLayout = "smartcontrol.watermeter.meterbinggrid";
        break;   

      }
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            //创建一个新的TAB
            tabItem=Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
                scrollable :true, 
                itemId:tabItemId,
                itemPKV:pkValue,      //保存主键值
                layout:'fit', 
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){
                //创建组件
                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                //保存一些需要默认值，提供给提交事件中使用
                    funData: popFunData,                //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout,                        
                        funCode: detCode             
                    }]
                }); 
                tabItem.add(item);  
                if (cmd=="bing") {
                   var meterBingGrid = item.down("basegrid[xtype=smartcontrol.watermeter.meterbinggrid]");
                   var meterBingStore = meterBingGrid.getStore();
                   var meterBingProxy = meterBingStore.getProxy();
                   var filter=new Array();
                   filter.push({"type": "string", "value": insertObj.uuid, "field": "meterId", "comparison": "="})
                   meterBingProxy.extraParams = {
                    filter: JSON.stringify(filter)
                };
                meterBingStore.load();

            }                
                
            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }
        tabPanel.setActiveTab( tabItem);        
    
    },

    hideFuncBtn:function(grid){    
        var basePanel = grid.up("basepanel");
        var funCode = basePanel.funCode;
        var baseGrid = basePanel.down("basegrid[funCode=" + funCode + "]");
        var records = baseGrid.getSelectionModel().getSelection();
        var btnBinding = baseGrid.down("button[ref=gridBinding]");
                  
        if (records.length == 0) {
            if (btnBinding)
                btnBinding.setDisabled(true);                 

        } else if (records.length == 1) {
            if (btnBinding)
                btnBinding.setDisabled(false);                
            
        } else {
            if (btnBinding)
                btnBinding.setDisabled(true);                
        }
    }
});