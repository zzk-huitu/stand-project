Ext.define("core.coursemanage.specialcourseattend.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.specialcourseattend.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
        var self = this;
        this.control({
            "basegrid[xtype=coursemanage.specialcourseattend.maingrid] actioncolumn": {
               detailClick: function (data) {
                this.doDetail_Tab(data.view,data.cmd,data.record);
                return false;
            }

           },

           
        });
    },

    doDetail_Tab:function(grid,cmd,record){
        var self = this;
        var baseGrid = grid;
        var recordData = record.getData();
   
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var tabPanel= baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
        var pkName = funData.pkName;

        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = ''; 
        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });
        var tabTitle =recordData['titleName']+"_考勤人员";
        var tabItemId = funCode+"UserAttend";  
        var pkValue= recordData[pkName];;
        var operType ="detail";
        insertObj = recordData;
        var itemXtype=[{
            xtype:detLayout,                        
            funCode: detCode,
            items: [{
                xtype: "coursemanage.specialcourseattend.userattendgrid",
                funCode: detCode                  
            }]
        }];
        var gridXtype = "coursemanage.specialcourseattend.userattendgrid";
        switch(cmd){
            case "setTerms":
             tabTitle = recordData['titleName']+"_考勤设备";
             tabItemId = funCode+"TermAttend";
             gridXtype = "coursemanage.specialcourseattend.settermsgird";
             itemXtype=[{
                    xtype:detLayout,                        
                    funCode: detCode,
                    items: [{
                        xtype: "coursemanage.specialcourseattend.settermsgird",
                        funCode: detCode                  
                    }]
                }]
            break;
            case "setTimes":
             tabTitle = recordData['titleName']+"_考勤时间";
             tabItemId = funCode+"TimeAttend";
             gridXtype = "coursemanage.specialcourseattend.settimesgird";
             itemXtype=[{
                xtype:detLayout,                        
                funCode: detCode,
                items: [{
                    xtype: "coursemanage.specialcourseattend.settimesgird",
                    funCode: detCode                  
                }]
            }]
            break;

        }
   
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            //创建一个新的TAB
            tabItem=Ext.create({
                xtype:'container',
                title: tabTitle,
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
                    items:itemXtype
                }); 
                tabItem.add(item);  
               
            //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中） 
            var attendGrid = item.down("basegrid[xtype=" + gridXtype + "]");
            var attendStore = attendGrid.getStore();
            var attendProxy = attendStore.getProxy();
            var filter=new Array();
            filter.push({"type": "string", "value": insertObj.uuid, "field": "titleId", "comparison": "="})
            attendProxy.extraParams = {
                filter: JSON.stringify(filter)
            };
            attendStore.load();

        },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);  
        

    }, 

});