Ext.define("core.coursemanage.specialcourseattend.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.specialcourseattend.othercontroller',
    mixins: {  
       suppleUtil: "core.util.SuppleUtil",
       messageUtil: "core.util.MessageUtil",
       formUtil: "core.util.FormUtil",
       gridActionUtil: "core.util.GridActionUtil",
   },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
      /*考勤人员添加事件*/
      "basegrid[xtype=coursemanage.specialcourseattend.userattendgrid] button[ref=gridAdd]":{
        beforeclick: function(btn){
          this.addAttendUser_Win(btn);
            return false;
        }
      },
     /*考勤人员删除事件*/
      "basegrid[xtype=coursemanage.specialcourseattend.userattendgrid] button[ref=gridDelete]": {
        beforeclick: function(btn) {
          this.deleteAttendUser(btn);
            return false;
        },
      },
       /**
         * 考勤用户选择保存按钮事件
         */
        "baseformwin[funCode=selectuser_main] button[ref=formSave]": {
            beforeclick: function (btn) {
                this.saveAttendUser(btn);            
                return false;
            }
        },
    },
   
   addAttendUser_Win: function(btn){
     var self = this;
     //得到组件
     var baseGrid = btn.up("basegrid");
     var funCode = baseGrid.funCode;
     var basePanel = baseGrid.up("basepanel[funCode=" +funCode + "]");
     var basetab = btn.up('baseformtab');
     var titleId = basetab.insertObj.uuid;
     //得到配置信息
     var funData = basePanel.funData;
     var detCode = "selectuser_main"; 
     var detLayout = "pubselect.selectstulayout";
     var defaultObj = funData.defaultObj;
     //关键：window的视图控制器
     var otherController = 'system.role.othercontroller';
      //处理特殊默认值
      var insertObj = self.getDefaultValue(defaultObj);
      var popFunData = Ext.apply(funData, {
        grid: baseGrid,
      });
      var width = 1200;
      var height = 600;
      var win = Ext.create('core.base.view.BaseFormWin', {
        iconCls: 'x-fa fa-plus-circle',
        operType: 'add',
        width: width,
        height: height,
          controller: "coursemanage.specialcourseattend.othercontroller", //指定视图控制器，从而能够使指定的控制器的事件生效
          funData: popFunData,
          funCode: detCode,
          insertObj: insertObj,
          titleId:titleId,
          items: [{
            xtype: detLayout
          }]
        });
      win.show();

    },


   deleteAttendUser: function(btn){
      var self = this;
      var baseGrid = btn.up("basegrid");
      //选择的考勤用户
      var selectUser= baseGrid.getSelectionModel().getSelection();
      if (selectUser.length == 0) {
        self.msgbox("没有选择要删除的考勤用户，请选择!");
        return false;
      }
         
      //拼装所选择的考勤用户
      var userIds = new Array();
      Ext.each(selectUser, function(rec) {
        var pkValue = rec.get("uuid");
        userIds.push(pkValue);
      });
      var title = "确定删除绑定该课程的考勤用户吗？";
      Ext.Msg.confirm('警告', title, function(btn, text) {
        if (btn == 'yes') {
           //发送ajax请求
           var resObj = self.ajax({
            url: comm.get('baseUrl') + "/AttUser/doUserAttendDelete",
            params: {
              userIds: userIds.join(","),
            }
          });
           if (resObj.success) {
            var store = baseGrid.getStore();
            store.load();
            self.msgbox(resObj.obj);
          } else {
            self.Error(resObj.obj);
          }
        }
      });
    },
     saveAttendUser:function(btn){
        var self = this;
        var win = btn.up('window');
        var titleId = win.titleId;
        var funData = win.funData;
        var baseGrid = funData.grid;
        var funCode = win.funCode;
        var basePanel = win.down("basepanel[funCode=" + funCode + "]");
        var isSelectGrid = basePanel.down("grid[xtype=pubselect.isselectstugrid]");
        var isSelectStore = isSelectGrid.getStore();
        var storeCount = isSelectStore.getCount();
        if (storeCount == 0) {
            self.msgbox("没有要设置的考勤用户，请重新选择");
            return false;
        }
        var userIds = new Array();
        for (var i = 0; i < storeCount; i++) {
            var tempId=isSelectStore.getAt(i).get("uuid");
            if(userIds.indexOf(tempId)==-1)
                userIds.push(tempId);
        }
        var title = "确定设置这些考勤用户吗？";
        Ext.Msg.confirm('提示', title, function (btnOper, text) {
            if (btnOper == 'yes') {
                //发送ajax请求
                var loading = self.LoadMask(win);
                self.asyncAjax({
                      url: comm.get('baseUrl') + "/AttUser/doUserAttendBind",
                    params: {
                        userIds: userIds,
                        titleId:titleId
                    },            
                    //回调代码必须写在里面
                    success: function (response) {
                        var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
console.log(data);
                        
                        if (data.success) {
                            var store = baseGrid.getStore();
                            store.load();
                            self.msgbox(data.obj);
                            loading.hide();
                            win.close();
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
            }
        });
    }
});