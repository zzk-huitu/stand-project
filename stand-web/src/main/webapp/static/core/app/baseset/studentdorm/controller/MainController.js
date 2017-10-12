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
                    self.openRoomAllot_Tab(btn,"add");
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