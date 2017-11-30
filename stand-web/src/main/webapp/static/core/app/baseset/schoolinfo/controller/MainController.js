Ext.define("core.baseset.schoolinfo.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.schoolinfo.maincontroller',
    mixins: {
        /*
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        */
    },
    init: function () {
         
    },
    control: {
       /*  "basegrid[xtype=baseset.schoolinfo.maingrid] button[ref=gridDetail_Tab]": {
                beforeclick: function(btn) {
                    this.doDetail_Tab(btn);
                    return false;
                }
            },*/
             "basegrid[xtype=baseset.schoolinfo.maingrid] actioncolumn": {
                detailClick_Tab: function (data) {
                    this.doDetail_Tab(null,data.view,data.record);
                    return false;
                }
            },

    },
     doDetail_Tab:function(btn,grid,record) {
        var self = this;
        var recordData="";
        var baseGrid=grid;
        if(!baseGrid) { //如果找不到，就找treegrid
            baseGrid = btn.up("basegrid");  
            var rescords = baseGrid.getSelectionModel().getSelection();
            if (rescords.length != 1) {
                this.msgbox("请选择一条数据！");
                return;
            }
            recordData = rescords[0].getData();
        }else{
         recordData =  record.getData();
        }
        var funCode = baseGrid.funCode;                 //主界面的funCode
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");
        
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = "baseset.schoolinfo.detailhtml";            //打开的tab页的布局视图
        var tabConfig = funData.tabConfig;
        var insertObj =  Ext.apply(new Object(),funData.defaultObj);

        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        var titleName = recordData[tabConfig.titleField];
        if(titleName)
            tabTitle = titleName+"-"+tabConfig.detailTitle;
        else
            tabTitle = tabConfig.detailTitle;
        var pkName = funData.pkName;
        var pkValue= recordData[pkName];
        var tabItemId =funCode+"_gridDetail"+pkValue;
        var operType="detail";
        insertObj = recordData;

        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

           var tabItem = Ext.create({
            xtype:'container',
            title: tabTitle,
            scrollable :true, 
            itemId:tabItemId,
            itemPKV:pkValue,
            layout:'fit', 
        });
           tabPanel.add(tabItem); 
              setTimeout(function(){
               var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,
                    detLayout:detLayout,                   
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                    //保存一些需要默认值，提供给提交事件中使用
                    baseGrid:baseGrid,                     //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout,
                    }]
                }); 

               tabItem.add(item);
               var detailHtml = item.down("container[xtype=baseset.schoolinfo.detailhtml]");
               detailHtml.setData(insertObj);  
           },30);

        }

        tabPanel.setActiveTab( tabItem);   
    },
});
