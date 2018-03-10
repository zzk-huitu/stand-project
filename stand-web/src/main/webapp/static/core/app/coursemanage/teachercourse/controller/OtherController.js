Ext.define("core.coursemanage.teachercourse.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.teachercourse.othercontroller',
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
    	
        "baseformwin[funCode=addTeacher] button[ref=formSave]": {
            beforeclick: function (btn) {
                this.saveDetail_Win(btn);
                return false;
            }
        },

        "baseformwin[funCode=replaceTeacher] button[ref=formSave]": {
            beforeclick: function (btn) {
                this.saveReplaceCourseTea(btn);
                return false;
            }
        },
        
    },

    saveDetail_Win:function(btn){
        var self=this;
        var win=btn.up("baseformwin");
        var detailLayout = win.down("panel[xtype=coursemanage.teachercourse.detaillayout]");
   
        var selectTeacherGrid = detailLayout.down("panel[xtype=coursemanage.teachercourse.selectedteachergrid]");
        if (selectTeacherGrid.getStore().getCount() == 0) {
            self.Warning("没有设置任课教师!");
            return false;
        }


        var loading = new Ext.LoadMask(win, {
            msg: '正在提交，请稍等...',
            removeMask: true// 完成后移除
        });
        loading.show();

        var recordData = new Array();
        Ext.each(selectTeacherGrid.getStore().getRange(), function(record) {
            var obj={
                claiId:record.get("claiId"),
                tteacId:record.get("tteacId"),
                studyYear:record.get("studyYear"),
                studyYearName:record.get("studyYearName"),
                semester:record.get("semester"),
                courseId:record.get("courseId")
            }
            recordData.push(obj);
        });
        var jsonData = Ext.encode(recordData);

        self.asyncAjax({
            url: comm.get('baseUrl') + "/CourseTeacher/doAddCourseTeacher",
            params: {
                jsonData: jsonData
            },                       
            success: function(response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if(data.success){
                    self.msgbox(data.obj);              
                    var baseGrid = win.baseGrid;
                    if (baseGrid){
                        var store = baseGrid.getStore();
                        store.load();
                    }

                    loading.hide();
                    win.close();
                                               
                }else {
                    self.Error(data.obj);
                    loading.hide();
                }           
                
            },
            failure: function(response) {                   
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                loading.hide();
            }
        });     
    },

    saveReplaceCourseTea:function(btn){
        var self=this;
        var win = btn.up('baseformwin');
        var grid = win.down("basegrid");
       

        var selectObject = grid.getSelectionModel().getSelection();
        
        if (selectObject.length !=1) {
            self.Warning("请选择一门教师课程进行替换!");
            return;
        }

        var loading = new Ext.LoadMask(win, {
            msg: '正在提交，请稍等...',
            removeMask: true// 完成后移除
        });
        loading.show();

    
        var detailLayout = win.down("panel[xtype=coursemanage.teachercourse.detaillayout]");
        var uuid=detailLayout.funData.uuid;
  
        self.asyncAjax({
            url: comm.get('baseUrl') + "/CourseTeacher/doReplaceCourseTeacher",
            params: {
                uuid:uuid,
                tteacId:selectObject[0].get("uuid")
            },                       
            success: function(response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if(data.success){
                    self.msgbox(data.obj);              
                    var baseGrid = win.baseGrid;
                    if (baseGrid){
                        var store = baseGrid.getStore();
                        store.load();
                    }

                    loading.hide();
                    win.close();
                                               
                }else {
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