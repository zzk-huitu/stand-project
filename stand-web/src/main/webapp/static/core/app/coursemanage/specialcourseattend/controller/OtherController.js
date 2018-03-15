Ext.define("core.coursemanage.specialcourseattend.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.specialcourseattend.othercontroller',
    mixins: {  
     suppleUtil: "core.util.SuppleUtil",
     messageUtil: "core.util.MessageUtil",
     formUtil: "core.util.FormUtil",
     gridActionUtil: "core.util.GridActionUtil",
     treeUtil: "core.util.TreeUtil",
   },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
        /**
         * 考勤用户事件
         */

         /*考勤人员添加事件*/
         "basegrid[xtype=coursemanage.specialcourseattend.userattendgrid] button[ref=gridAdd]":{
          beforeclick: function(btn){
            this.openCourseAttend_Win(btn,"userAttend");
            return false;
          }
        },
        /*考勤人员删除事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.userattendgrid] button[ref=gridDelete]": {
          beforeclick: function(btn) {
            this.deleteAttend(btn,"userAttend");
            return false;
          },
        },
       /**
         * 考勤用户选择保存按钮事件
         */
         "baseformwin[funCode=selectuser_main] button[ref=formSave]": {
          beforeclick: function (btn) {
            this.saveAttend(btn,"userAttend");            
            return false;
          }
        },

          /**
         * 考勤设备事件
         */
        /*考勤设备添加事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.settermsgird] button[ref=gridAdd]":{
          beforeclick: function(btn){
            this.openCourseAttend_Win(btn,"termAttend");
            return false;
          }
        },
        /*考勤设备删除事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.settermsgird] button[ref=gridDelete]": {
          beforeclick: function(btn) {
            this.deleteAttend(btn,"termAttend");
            return false;
          },
        },
       /**
         * 考勤设备选择保存按钮事件
         */
         "baseformwin[funCode=roomterminal_main] button[ref=formSave]": {
          beforeclick: function (btn) {
            this.saveAttend(btn,"termAttend");            
            return false;
          }
        },

        /**
         * 考勤时间事件
         */
     
        /*考勤时间添加事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.settimesgird] button[ref=gridAdd]":{
          beforeclick: function(btn){
            this.openCourseAttend_Win(btn,"timeAttend");
            return false;
          }
        },
        /*考勤时间编辑事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.settimesgird] button[ref=gridEdit]":{
          beforeclick: function(btn){
            this.openCourseAttend_Win(btn,"timeEditAttend");
            return false;
          }
        },
        /*考勤时间删除事件*/
        "basegrid[xtype=coursemanage.specialcourseattend.settimesgird] button[ref=gridDelete]": {
          beforeclick: function(btn) {
            this.deleteAttend(btn,"timeAttend");
            return false;
          },
        },
         /**
         * 考勤时间 添加 选择保存按钮事件 

         */
         "mtfuncwindow[formPanel=coursemanage.specialcourseattend.settimesform] button[ref=ssOkBtn]": {
          beforeclick: function (btn) {
            this.saveAttendTime(btn);            
            return false;
          }
        },
          /**
         * 考勤时间表单保存按钮事件 

         */
        "baseformwin[detCode=specialcourseattend_detail] button[ref=formSave]": {
          beforeclick: function (btn) {
            this.saveAttendTimeForm(btn);            
            return false;
          }
        },
        /*考勤时间新增打开界面渲染*/
        "basegrid[xtype=baseset.calendar.maingrid]":{
          afterrender: function(grid){
            var baseGrid = grid;
            var toolbar = baseGrid.down("toolbar[ref=panelTopBar]");
            if (toolbar) {
              var buttons = toolbar.query("button[funCode=girdFuntionBtn]");
              for (var i in buttons) {
                buttons[i].setVisible(false);
              }
            } 

          }
        },

        "basetreegrid[xtype=roomterminal.roomtree] button[ref=gridRefresh]": {
         click: function(btn) {
          var baseGrid = btn.up("basetreegrid");
          var store = baseGrid.getStore().load();
          return false;
        }
      },

      "basetreegrid[xtype=roomterminal.roomtree]": {
          itemclick: function (tree, record, item, index, e) {
            var self = this;
            var mainLayout = tree.up("basepanel[xtype=coursemanage.specialcourseattend.selectterm.mainlayout]");
            var treePanel = mainLayout.down("panel[xtype=roomterminal.roomtree]");
           //var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'roomId'}]";
           var funData = mainLayout.funData;
           var map = self.eachChildNode(record);
           var ids = new Array();
           map.eachKey(function (key) {
            ids.push (key);
          });
           var filter = "[{'type':'string','comparison':'in','value':'" + ids.join(",") + "','field':'roomId'}]";
           mainLayout.funData = Ext.apply(funData, {
            roomId: record.get("id"),
            roomLevel: record.get("level"),
            roomName: record.get("text"),
            roomInfo: record,
            filter: filter
          });
            // 加载房间配置的终端
            var storeyGrid = mainLayout.down("panel[xtype=roomterminal.selecttermgrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
              filter: filter,
            };
             store.loadPage(1); // 给form赋值

             return false;
           }
         },
     },

     openCourseAttend_Win: function(btn,cmd){
         var self = this;
         //得到组件
         var baseGrid = btn.up("basegrid");
         var funCode = baseGrid.funCode;
         var basePanel = baseGrid.up("basepanel[funCode=" +funCode + "]");
         var basetab = btn.up('baseformtab');
         var titleId = basetab.insertObj.uuid;

         //得到配置信息
         var funData = basePanel.funData;
         var defaultObj = funData.defaultObj;
         var detCode = "selectuser_main"; 
         var detLayout = "pubselect.selectstulayout";
         //关键：window的视图控制器
         var otherController = 'coursemanage.specialcourseattend.othercontroller';
          //处理特殊默认值
          var insertObj = self.getDefaultValue(defaultObj);
          var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            titleId:titleId
          });
          var iconCls= 'x-fa fa-pencil-square';
          var width = 1200;
          var height = 600;
          switch(cmd){
            case "termAttend":
            iconCls= 'x-fa fa-pencil-square';
            width = 1200;
            height = 600;
            detCode = "roomterminal_main"; 
            detLayout = "coursemanage.specialcourseattend.selectterm.mainlayout";
          break;
            case "timeAttend":
            iconCls= 'x-fa fa-pencil-square';
            width = 660;
            height = 550;
            detCode = "specialcourseattend_detail"; 
            detLayout = "coursemanage.specialcourseattend.settimesform";
          break;
            case "timeEditAttend":
            iconCls= 'x-fa fa-pencil-square';
            width = 650;
            height = 550;
            detCode = "specialcourseattend_detail"; 
            detLayout = "coursemanage.specialcourseattend.settimesform";
            var rescords= baseGrid.getSelectionModel().getSelection();
            if (rescords.length != 1) {
              self.msgbox("请选择一条需要修改的考勤时间数据!");
              return ;
            };
            insertObj = rescords[0].getData();
          break;

          }
          var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls: iconCls,
            operType: 'add',
            width: width,
            height: height,
              controller: otherController, //指定视图控制器，从而能够使指定的控制器的事件生效
              funData: popFunData,
              funCode: detCode,
              detCode:detCode,
              insertObj: insertObj,
              titleId:titleId,
              items: [{
                xtype: detLayout
              }]
            });
          win.show();
          if(cmd=="timeEditAttend"){
           var objDetForm = win.down("baseform[xtype=coursemanage.specialcourseattend.settimesform]");
           var formDeptObj = objDetForm.getForm();
           insertObj['beginTime'] = Ext.Date.format(new Date(insertObj.beginTime), 'H:i');
           insertObj['endTime'] = Ext.Date.format(new Date(insertObj.endTime), 'H:i');
           insertObj['beginDate'] = Ext.Date.format(new Date(insertObj.beginDate), 'Y/m/d');
           insertObj['endDate'] = Ext.Date.format(new Date(insertObj.endDate), 'Y/m/d');
           self.setFormValue(formDeptObj, insertObj);

         }
         if(cmd=="timeAttend"){
          var objDetForm = win.down("baseform[xtype=coursemanage.specialcourseattend.settimesform]");
          var formObj = objDetForm.getForm();
          formObj.findField("titleId").setValue(titleId);
        }

     },


     deleteAttend: function(btn,cmd){
      var self = this;
      var baseGrid = btn.up("basegrid");

      var title = "确定删除绑定该课程的考勤用户吗？";
      var deleteUrl = "/AttUser/doUserAttendDelete";
      var deleteMsg = "没有选择要删除的考勤人员数据，请选择!";
      switch(cmd){
          case "termAttend":
          title = "确定删除绑定该课程的考勤设备吗？";
          deleteUrl = "/AttendTerm/doTermAttendDelete";
          deleteMsg = "没有选择要删除的考勤设备数据，请选择!";
        break;
          case "timeAttend":
          title = "确定删除绑定该课程的考勤时间吗？";
          deleteUrl = "/AttendTime/doTimeAttendDelete";
          deleteMsg = "没有选择要删除的考勤时间数据，请选择!";
        break;

      }
        //选择的考勤数据
        var isSelectStore= baseGrid.getSelectionModel().getSelection();
        if (isSelectStore.length == 0) {
          self.msgbox(deleteMsg);
          return;
        }

        //拼装所选择的考勤数据
        var isSelectedIds = new Array();
        Ext.each(isSelectStore, function(rec) {
          var pkValue = rec.get("uuid");
          isSelectedIds.push(pkValue);
        });
       
        Ext.Msg.confirm('警告', title, function(btn, text) {
          if (btn == 'yes') {
             //发送ajax请求
             var resObj = self.ajax({
              url: comm.get('baseUrl') + deleteUrl,
              params: {
                isSelectAttendIds: isSelectedIds.join(","),
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
    saveAttend:function(btn,cmd){
      var self = this;
      var win = btn.up('window');
      var titleId = win.titleId;
      var funData = win.funData;
      var baseGrid = funData.grid;
      var funCode = win.funCode;
      var basePanel = win.down("basepanel[funCode=" + funCode + "]");
      var isSelectGrid = basePanel.down("grid[xtype=pubselect.isselectstugrid]");
      var title = "确定设置这些考勤用户吗？";
      var addUrl = "/AttUser/doUserAttendBind";
      if(cmd=="termAttend"){
         isSelectGrid = basePanel.down("panel[xtype=roomterminal.isselecttermgrid]");
         title = "确定设置这些考勤设备吗？";
         addUrl = "/AttendTerm/doTermAttendAdd";
      }
     
      var isSelectStore = isSelectGrid.getStore();
      var storeCount = isSelectStore.getCount();
      if (storeCount == 0) {
        self.msgbox("没有要设置的考勤用户数据，请重新选择");
        return ;
      }

      var selectIds = new Array();
      for (var i = 0; i < storeCount; i++) {
        var tempId=isSelectStore.getAt(i).get("uuid");
        if(selectIds.indexOf(tempId)==-1)
          selectIds.push(tempId);
      }
      Ext.Msg.confirm('提示', title, function (btnOper, text) {
        if (btnOper == 'yes') {
          var loading = self.LoadMask(win);
          self.asyncAjax({
            url: comm.get('baseUrl') + addUrl,
            params: {
              userIds: selectIds,
              titleId:titleId
            },            
            success: function (response) {
              var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

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
   },
   saveAttendTime:function(btn){
       var self = this;
       var win = btn.up('window');

       var formPanel=Ext.ComponentQuery.query('baseform[xtype='+win.formPanel+']')[0];
       var objForm=formPanel.getForm();
       var basePanel = win.down("panel[xtype=" + win.funcPanel + "]");
       var baseGrid = basePanel.down("basegrid[xtype=baseset.calendar.maingrid]");

       var records = baseGrid.getSelectionModel().getSelection();
       var selCount = records.length;
       if (selCount != 1) {
        self.msgbox("请选择要一条设置的数据");
        return;
      }
      objForm.findField("beginTime").setValue(Ext.Date.format(new Date(records[0].get('beginTime')), 'H:i'));
      if(records[0].get('endTime')){
        objForm.findField("endTime").setValue(Ext.Date.format(new Date(records[0].get('endTime')), 'H:i'));
        
      }else{
        objForm.findField("endTime").setValue("");
      }
      objForm.findField("teachTime").setValue(records[0].get('jcCode'));
      win.close();
    },
   saveAttendTimeForm:function(btn){
       var self = this;
       var win = btn.up('window');
       var objForm = win.down("form[xtype=coursemanage.specialcourseattend.settimesform]");
       var formObj = objForm.getForm();    //获取表单对象
       var params = self.getFormValue(formObj);
       var pkField = formObj.findField('uuid');

       var beginDate = formObj.findField("beginDate").getValue();
       var endDate = formObj.findField("endDate").getValue();
       if (!Ext.isEmpty(beginDate)&&!Ext.isEmpty(endDate)) {
        var endTime = new Date(beginDate);
        var dBegin = new Date(endDate);
        if (Date.parse(dBegin) <= Date.parse(endTime)) {
          self.Warning("选课开始时间要早于选课结束时间，请重新设置");
          return;
        }
      }
      if (!Ext.isEmpty(beginDate)&&Ext.isEmpty(endDate)) {
        self.Warning("设置了选课开始时间必须设置选课结束时间");
        return;
      }
      if (Ext.isEmpty(beginDate)&&!Ext.isEmpty(endDate)) {
        self.Warning("设置了选课结束时间必须设置选课开始时间");
        return ;
      }
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";

       if (formObj.isValid()) {

            var loading = new Ext.LoadMask(win, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            self.asyncAjax({
                url: comm.get('baseUrl')  + "/AttendTime/"+act ,
                params: params,
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                       
                        var grid = win.funData.grid; //窗体是否有grid参数
                        if (!Ext.isEmpty(grid)) {
                          grid.getStore().loadPage(1);
                        }

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

        } else {

            var errors = ["前台验证失败，错误信息："];
            formObj.getFields().each(function (f) {
                if (!f.isValid()) {
                    errors.push("<font color=red>" + f.fieldLabel + "</font>:" + f.getErrors().join(","));
                }
            });
            self.msgbox(errors.join("<br/>"));
        }
    },     
  });