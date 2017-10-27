Ext.define("core.baseset.studentdorm.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.studentdorm.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    init: function() {
        var self = this
        // 事件注册
        this.control({
            //区域列表刷新按钮事件
            "panel[xtype=baseset.studentdorm.studentdormtree] button[ref=gridRefresh]": {
                click: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },
               //一键分配宿舍
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=onKeyallotDorm]": {
                beforeclick: function(btn) {
                    self.doOnKeyallotDorm(btn);
                    return false;
                }
            },
            //宿舍分配
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=dormAlllot]": {
                beforeclick: function(btn) {
                    self.roomAllot_Win(btn,"allot");
                    return false;
                }
            },
            //虚拟宿舍调整(或换宿舍)
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=dormAdjust]": {
                beforeclick: function(btn) {
                    self.roomAllot_Win(btn,"adjust");
                    return false;
                }
            },
         

        });
     },

      roomAllot_Win: function(btn,cmd) {
            var self = this;
            var baseGrid;
            if(!baseGrid){
                baseGrid=btn.up("basegrid");
            }

            var basePanel = baseGrid.up("basepanel");

            //得到配置信息
            var funData = basePanel.funData;                //主界面的配置信息  
            var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
            var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
            
            var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
            if (!otherController)
                otherController = '';  
            var width = 1250;
            var height = 550;
            var iconCls= 'x-fa fa-plus-circle';
            var winTitle = "学生分配宿舍";
            var operType="add";
            switch(cmd){
               case "adjust":
                width = 1380;
                height = 650;
                winTitle = "虚拟宿舍调整";
                operType="add";
                detCode =  "adjustdorm_detail";
                detLayout = "baseset.studentdorm.adjustdormlayout"; 
                break;
            } 
             //创建tab内部组件                     
            var insertObj =  Ext.apply(new Object(),funData.defaultObj);
            var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
                grid: baseGrid
            });
            var win = Ext.createWidget('mtfuncwindow', {
                iconCls:iconCls,
                title: winTitle,
                operType: operType,
                width: width,
                height: height,
                controller: otherController,
                funData: popFunData,
                funCode: detCode,
                insertObj: insertObj,        
                items: [{
                    xtype: detLayout
                }],
                listeners: {
                    render: function(win) {
                     var okBtn = win.down("button[ref=ssOkBtn]");
                     okBtn.hide();
                     var calBtn = win.down("button[ref=ssCancelBtn]");
                     calBtn.hide();   
                    }
                }
            }).show();
         },

       //一键分配宿舍
     doOnKeyallotDorm: function(btn) {
            var self=this;
            var mainLayout = btn.up("basepanel");
            var basegrid = mainLayout.down("basegrid[xtype=baseset.studentdorm.maingrid]");
            var basetreegrid = mainLayout.down("basetreegrid[xtype=baseset.studentdorm.studentdormtree]");
            var otherController = mainLayout.otherController;    
            if (!otherController)
                otherController = '';    

            var selectObject = basetreegrid.getSelectionModel().getSelection();
            if (selectObject.length <= 0) {
                self.msgbox("请选择要一键分配的年级");
                return;
            }
            var objDic = selectObject[0];
            var gradId = objDic.get("id");
            var nodeType = objDic.get("nodeType");
            if (nodeType != "04") {
                self.msgbox("一键分配宿舍，请选择年级。");
                return;
            }
            var detLayout = "baseset.studentdorm.onekeyallotdormlayout";
            var dormAllotDetail = "onekeyallotdorm_detail";
            var xItemType=[{
                xtype:detLayout,
                funCode:dormAllotDetail                       
                }];
            var win = Ext.create('core.base.view.BaseFormWin', {
                title: "一键分配宿舍",
                width: 1200,
                height: 700,
                operType: "add",
                controller: otherController,
                detCode:dormAllotDetail,
                gradId: gradId,
                iconCls: 'x-fa fa-plus-circle',
                resizable: false, //禁止缩放
                modal: true,
                items:xItemType,
                listeners: {
                    beforerender: function(win) {
                        var dormInfo = win.down("basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]");
                        var baseGrid = dormInfo.down("basegrid[xtype=baseset.studentdorm.dormallotdetailgrid]");
                        var proxy= baseGrid.getStore().proxy;
                        proxy.extraParams = {
                            whereSql: gradId
                        };
                        baseGrid.getStore().load();
                        var boyDormGrid = dormInfo.down("basegrid[xtype=baseset.studentdorm.boydormgrid]");
                        var girlDormGrid = dormInfo.down("basegrid[xtype=baseset.studentdorm.girldormgrid]");
                        boyDormGrid.getStore().removeAll();
                        girlDormGrid.getStore().removeAll();
                        var conutHtml="总数："+0;
                        boyDormGrid.down('panel[ref= boyTotalInfo]').setHtml(conutHtml);
                        girlDormGrid.down('panel[ref= girlTotalInfo]').setHtml(conutHtml);
                    }
                }
            }).show();      
        },
 });