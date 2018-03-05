Ext.define("core.smartcontrol.roombagrule.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.roombagrule.maincontroller',
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

        "basegrid button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {
                var basePanel=btn.up("basepanel[funCode=roombagrule_main]");

                //添加时，把之前编辑时更新的值给清除
                basePanel.funData.finalObj = null;
            
            }
        },

        "basegrid button[ref=gridEdit_Tab]": {
            beforeclick: function(btn) {
                this.doHandleData(btn);            
            }
        },

        "basegrid button[ref=gridBinding]": {
            beforeclick: function(btn) {
                this.doOpenBindDetail(btn,"edit");
                return false;
            }
        },
        "basegrid actioncolumn":{
            ruleRoomClick:function(data){
                this.doOpenBindDetail(null,"bing",data.view,data.record);
                return false;
           }

        }
    },
    doHandleData:function(btn){
        var self=this;
        var basePanel=btn.up("basepanel[funCode=roombagrule_main]");

        var baseGrid=btn.up("basegrid");
        var rescords = baseGrid.getSelectionModel().getSelection();
        if (rescords.length != 1) {
            self.msgbox("请选择一条数据！");
            return null;
        }
        recordData = rescords[0].getData();

        var shutDownStart = Ext.util.Format.date(recordData.shutDownStart, 'H:i:s');
        var shutDownEnd = Ext.util.Format.date(recordData.shutDownEnd, 'H:i:s');

        //传入此值
        basePanel.funData.finalObj = {
            shutDownStart:shutDownStart,
            shutDownEnd:shutDownEnd
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
        var detCode =  "roombagrule_binddetail";  
        var detLayout = "smartcontrol.roombagrule.binddetaillayout";
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
        
        var tabTitle = recordData["roomRuleName"] + "-规则绑定房间";
        var tabItemId = funCode+"_gridBindEdit"; 
        var operType = cmd; 
        insertObj = recordData;
        var deDuctionMode = recordData.deDuctionMode; //扣费模式 ,渲染费率绑定时用到
        switch (cmd) {
          case "bing":
          tabTitle = recordData.roomRuleName+"-规则房间";
          tabItemId=funCode+"_ruleRoomBing"; 
          detCode =  "rule_room";  
          detLayout = "smartcontrol.roombagrule.ruleroomgrid";
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
                    deDuctionMode:deDuctionMode,
                    items:[{
                        xtype:detLayout,                        
                        funCode: detCode             
                    }]
                }); 
                tabItem.add(item);  
                if (cmd=="bing") {
                 var rulerRoomGrid = item.down("basegrid[xtype=smartcontrol.roombagrule.ruleroomgrid]");
                 var rulerRoomStore = rulerRoomGrid.getStore();
                 var rulerRoomProxy = rulerRoomStore.getProxy();
                 var filter=new Array();
                 filter.push({"type": "string", "value": insertObj.uuid, "field": "roomRuleId", "comparison": "="})
                 rulerRoomProxy.extraParams = {
                    filter: JSON.stringify(filter)
                };
                rulerRoomStore.load();

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