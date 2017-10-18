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
            //宿舍分配
          "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    self.openStuRoom_Win(btn,"add");
                    return false;
                }
            },
            //虚拟宿舍调整(或换宿舍)
            "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=dormAdjust]": {
                beforeclick: function(btn) {
                    self.doDormAdjust(btn);
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
             //导出Excel
           "basegrid[xtype=baseset.studentdorm.maingrid] button[ref=onKeyallotDorm]": {
                beforeclick: function(btn) {
                    self.doImportExcel(btn);
                    return false;
                }
            },
 
      });
 },
     openStuRoom_Win: function(btn,cmd) {
        var self = this;

            //得到组件
            var baseGrid;
            if(!baseGrid){
                baseGrid=btn.up("basegrid");
            }

            var basePanel = baseGrid.up("basepanel");

            //得到配置信息
            var funData = basePanel.funData;                //主界面的配置信息  
            var pkName=funData.pkName;

            var funCode = basePanel.funCode;          //主界面的funCode
            var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
            var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
            
            var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
            if (!otherController)
                otherController = '';  

             var basetreegrid = basePanel.down("panel[xtype=baseset.studentdorm.studentdormtree]");
             var selectObject = basetreegrid.getSelectionModel().getSelection();
             if (selectObject.length <= 0) {
                 self.msgbox("请选择宿舍!");
                 return;
             }
                                // 得到选择的字典
            //设置window的参数
            var width = 1200;
            var height = 550;
            var iconCls= 'x-fa fa-plus-circle';
            var winTitle = "学生分配宿舍";
            var recordData=null;
            var operType="add";


             //创建tab内部组件                     
            var insertObj =  Ext.apply(new Object(),funData.defaultObj);
            var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
                grid: baseGrid
            });
            if(recordData!=null){
                insertObj=recordData;
            }  


            var win = Ext.create('core.base.view.BaseFormWin', {
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
                }]
            }).show();

            var areaId = selectObject[0].get("id");
            var filter = "[{'type':'string','comparison':'=','value':'" + areaId + "','field':'claiId'}]"

            basePanel.funData = Ext.apply(funData, {
             areaId: areaId,
             filter: filter
            });
             // 加载班级下面宿舍列表
            var detailLayout=win.down("basepanel[xtype=baseset.studentdorm.detaillayout]");
            var classDormGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.dormallotgrid]");
            var store = classDormGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter
                };
            store.loadPage(1); //刷新
            //获取未分配宿舍学生列表
            var dormNotAllotGrid = detailLayout.down("panel[xtype=baseset.studentdorm.dormnotallotgrid]");
            var dormNotAllotGridstore = dormNotAllotGrid.getStore();
            var proxy = dormNotAllotGridstore.getProxy();
            whereSql = " where studentId not in (select stuId from DormStudentDorm where isDelete=0) and claiId='" + areaId + "' and isDelete=0";
            proxy.extraParams = {
                whereSql: whereSql
                };
            dormNotAllotGridstore.loadPage(1); //刷新
    },


     doImportExcel: function(btn) {

        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var funData = basePanel.funData;
        if(funData.claiId==null){
            self.msgbox("请先选择班级!");
            return;
        }
        Ext.Msg.wait('正在生成中,请稍后...', '温馨提示');
        Ext.create('Ext.panel.Panel', {
            title: 'Hello',
            width: 200,
            html: '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + comm.get('baseUrl') + '/BaseStudentDorm/exportExcel?claiId=' + funData.claiId + '"></iframe>',
            renderTo: Ext.getBody(),
            listeners: {
                afterrender: function () {
                    var task = new Ext.util.DelayedTask(function () {
                        Ext.Msg.hide();
                    });
                    task.delay(3000);
                }
            }
        });
    },

  


});