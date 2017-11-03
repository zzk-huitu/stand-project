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
              //推送消息
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=dormTs]": {
                beforeclick: function(btn) {
                    self.pushMessage(btn);
                    return false;
                }
            },
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=exportExcel]": {
                beforeclick: function(btn) {
                    this.doExportExcel(btn);
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
       pushMessage:function(btn) {
           var self=this;
           var mainLayout = btn.up("basepanel[xtype=baseset.studentdorm.mainlayout]");
           var storeyGrid = mainLayout.down("basegrid[xtype=baseset.studentdorm.maingrid]");
           var jwtrTree = mainLayout.down("basetreegrid[xtype=baseset.studentdorm.studentdormtree]");
           var selectTreeObject = jwtrTree.getSelectionModel().getSelection();
           if (selectTreeObject.length <= 0) {
                self.msgbox("请选择要推送的班级！");
                return;
           }
           var objDic = selectTreeObject[0];
           var classId = objDic.get("id");
           var nodeType = objDic.get("nodeType");
           if (nodeType != "05") {
                self.msgbox("推送消息时，请选择本班。");
                return ;
            }
            var count = storeyGrid.getStore().getCount();
            if (count <= 0) {
                self.msgbox("列表中无任何数据!");
                return;
            }
            Ext.Msg.confirm("推送消息", "您确定要推送信息吗？", function(btns) {
                if (btns == 'yes') {
                    var loading = self.LoadMask(mainLayout,'正在推送消息中，请等待...');
                    self.asyncAjax({
                      url: comm.get('baseUrl') + "/BaseStudentDorm/pushMessage",
                      params: {
                         classId: classId,
                     },                 
                     success: function(response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        if(data.success){
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
            })

        },
        doExportExcel: function(btn){
            var self = this;
            var baseGrid = btn.up("basegrid");
            var basepanel = baseGrid.up("basepanel[xtype=baseset.studentdorm.mainlayout]");
            var basetreegrid = basepanel.down("basetreegrid[xtype=baseset.studentdorm.studentdormtree]");
            var selectObject = basetreegrid.getSelectionModel().getSelection();
            if (selectObject.length <= 0) {
                self.msgbox("请选择班级");
                return;
            }
            var objDic = selectObject[0];
            var classId = objDic.get("id");
            var nodeType = objDic.get("nodeType");
            if (nodeType != "05") {
                self.msgbox("请先选择班级");
                return;
            }
            var title = "确定要导出宿舍学生的信息吗？";
            Ext.Msg.confirm('提示', title, function (btn, text) {
                if (btn == "yes") {
                    Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                    var component = Ext.create('Ext.Component', {
                        title: 'HelloWorld',
                        width: 0,
                        height: 0,
                        hidden: true,
                        html: '<iframe src="' + comm.get('baseUrl') + '/BaseStudentDorm/exportExcel?claiId='+classId+'"></iframe>',
                        renderTo: Ext.getBody()
                    });

                    var time = function () {
                        self.syncAjax({
                            url: comm.get('baseUrl') + '/BaseStudentDorm/checkExportEnd?claiId='+classId,
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

        },
 });