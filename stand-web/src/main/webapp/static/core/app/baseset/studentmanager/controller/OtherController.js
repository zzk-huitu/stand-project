/**
    此视图控制器，用于注册window之类的组件的事件，该类组件不属于 mainLayout和detailLayout范围内。
    但需要在创建window中，使用controller属性来指定此视图控制器，才可生效
*/
Ext.define("core.baseset.studentmanager.controller.OtherController", {
    extend: "Ext.app.ViewController",

    alias: 'controller.baseset.studentmanager.othercontroller',
    
    /*把不需要使用的组件，移除掉*/
    mixins: {
        messageUtil: "core.util.MessageUtil",
        suppleUtil: "core.util.SuppleUtil", 
        queryUtil: "core.util.QueryUtil"
    },
   
    init: function() {
    },

    /*该视图内的组件事件注册*/
    control:{   

        //添加用户所属角色事件
        "panel[xtype=baseset.studentmanager.studentrolegrid] button[ref=gridAdd]": {
            beforeclick: function(btn) {
               this.doAddStudentRole(btn);
               return false;
            }
        }, 
    
        //用户所属角色选择后确定事件
        "baseformwin[funCode=user_selectrolemain] button[ref=formSave]": {
            beforeclick: function(btn) {
              this.doSavaStuRole(btn);
              return false;
            },
       },


        //删除用户所属角色事件
        "panel[xtype=baseset.studentmanager.studentrolegrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.doDeleteStuRole(btn);
                return false;
            }
        },
                
        //添加用户部门岗位事件
        "panel[xtype=baseset.studentmanager.studentdeptjobgrid] button[ref=gridAdd]": {
            beforeclick: function(btn) {
                this.doAddDeptJob(btn);
                return false;
            }
        },
        //删除用户部门岗位事件
        "panel[xtype=baseset.studentmanager.studentdeptjobgrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.doDeleteDeptJob(btn);
                return false;
            }
        },
        //设置主部门
        "panel[xtype=baseset.studentmanager.studentdeptjobgrid] button[ref=setMasterDept]": {
            beforeclick: function(btn) {
                this.doSetMasterDeptJob(btn);
                return false;
                          
            }
        },
               /**
         * 用户设定岗位确定事件，只获取岗位
         * @type {[type]}
         */
        "mtsswinview[funcPanel=student.studentdeptjob] button[ref=ssOkBtn]": {
            beforeclick: function(btn) {
                this.doAddUserToDeptJob(btn);
                return false;
            }
        },

        //选择班主任，界面加载事件
        "window[funcPanel=pbselectRole.selectrolelayout]":{
            afterrender:function(win){
                this.loadSelectRoleStore(win);
                return false;
            }
        },
        //选择班主任，勾选后提交事件
        "window[funcPanel=pbselectRole.selectrolelayout] button[ref=ssOkBtn]":{
            beforeclick: function(btn) {
                this.doSelectedRole(btn);
                return false;
            }
        },

        "baseformtab button[ref=formSave]": {
            beforeclick: function (btn) {
                this.doSave(btn, "addSave");
                return false;
            }
        },
        
        //重写form表单中选取部门岗位时候的只能选择叶子节点的事件
        "mtsswinview[funcPanel=studentmanagerdeptJobfuncpanel] button[ref=ssOkBtn]": {
            beforeclick: function(btn) {
            	// console.log(1);
                this.doAddStudentDeptJob(btn);
                return false;
            }
        },

    },

    /**
     * 保存事件的处理
     * @param btn
     * @param cmd
     */
    doSave: function (btn, cmd) {
        var self = this;
        //得到组件
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页

        //得到配置信息
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = basePanel.down("baseform[funCode=" + detCode + "]");
        var formObj = objForm.getForm();
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var pkField = formObj.findField(pkName);

        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {
            formObj.submit({
                url: comm.get('baseUrl') + "/StuBaseinfo" + "/" + act,
                //params: params,       //表单的参数会自动上传
                submitEmptyText: false,     //不提交表单为空值的数据
                waitMsg: '正在提交，请等待...',
                success: function (fp, action) {
                    formObj.reset();
                    self.Info("保存成功!");

                     var grid = basetab.funData.grid; //此tab是否保存有grid参数
                     if (!Ext.isEmpty(grid)) {
                         var store = grid.getStore();
                         store.loadPage(1); //刷新父窗体的grid
                         tabPanel.remove(tabItem);
                     }
                    tabPanel.remove(tabItem);

                },
                failure: function (form, action) {
                    if (!Ext.isEmpty(action.result.obj))
                        self.Info(action.result.obj);
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
    
  doAddStudentRole: function(btn){
        var self=this;
        var studentRoleGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    
        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;

       //选择的用户
        var selectUserId = insertObj.uuid;
        var detCode = "user_selectrolemain";
        var popFunData = Ext.apply(funData, {
            grid: studentRoleGrid,
            userId: selectUserId
        }); 
        var cmd = "edit";
        var winId = detCode + "_win";
        var win = Ext.getCmp(winId);
        if (!win) {
        win = Ext.create('core.base.view.BaseFormWin', {
            id: winId,
            title: "学生用户角色选择",
            width: 1024,
            height: 600,
            resizable: false,
            controller:'baseset.studentmanager.othercontroller',
            iconCls: "x-fa fa-user",
            operType: cmd,
            funData: popFunData,
            funCode: detCode,
            txtformSave: "确定",
            items: [{
                xtype: "pbselectRole.selectrolelayout"
            }]
         });
       }
        win.show();
        //待选的项目中要过虑掉已选择的
        var selectRoleGrid = win.down("panel[xtype=pbselectRole.selectrolegrid]");
        var selectRoletore = selectRoleGrid.getStore();
        var selectRoleProxy = selectRoletore.getProxy();
        selectRoleProxy.extraParams = {
            userId: selectUserId
        };
        selectRoletore.load();
    },
    doSavaStuRole: function(btn){
        var self=this;
        var win = btn.up('window');
        var funCode = win.funCode;
        var funData = win.funData;
        var userId = funData.userId;
        var basePanel = win.down("basepanel[funCode=" + funCode + "]");
        var isSelectGrid = basePanel.down("panel[xtype=pbselectRole.isselectrolegrid]");
        var isSelectStore = isSelectGrid.getStore();
        var iCount = isSelectStore.getCount(); //已选的角色个数
        //拼装所选择的角色
        var ids = new Array();
        for (var i = 0; i < iCount; i++) {
            var record = isSelectStore.getAt(i);
            var pkValue = record.get("uuid");
            if(ids.indexOf(pkValue)==-1)
                ids.push(pkValue);
        }
        if (ids.length > 0) {
         var myMask = self.LoadMask(win);
         self.asyncAjax({
            url: funData.action + "/doAddUserRole",
            params: {
                userId: userId,
                ids: ids.join(",")
            },
            //回调代码必须写在里面
            success: function(response) {
                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                if (data.success) { 
                    self.msgbox("保存成功!");
                    var grid = win.funData.grid; //窗体是否有grid参数
                    if (!Ext.isEmpty(grid)) {
                        var store = grid.getStore();
                        var proxy = store.getProxy();
                        proxy.extraParams = {
                            whereSql: win.funData.whereSql,
                            orderSql: win.funData.orderSql,
                            userId: userId
                        };
                        store.load(); //刷新父窗体的grid
                        win.close();
                    }
                }else{
                    self.Error(data.obj);   
                }
                myMask.hide();
            },
            failure: function(response) {           
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                myMask.hide();
              }
            });                   
        }else{
            self.msgbox("没有设定角色");
        }

    },
    doDeleteStuRole: function(btn){
        var self=this;
        var studentRoleGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    
        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;
        //选择的用户
        var selectUserId =  insertObj.uuid;
        //选择的角色
        var selectStuRole = studentRoleGrid.getSelectionModel().getSelection();
        if (selectStuRole.length == 0) {
            self.msgbox("没有选择要删除的角色，请选择");
            return;
        }
        var store = studentRoleGrid.getStore();
        var recdCount = store.getCount();
        if (recdCount==1){
            self.Warning("每个用户至少要包含一个角色，不能再删除");
            return;                       
        }
        if (recdCount==selectStuRole.length){
            self.Warning("每个用户至少要包含一个角色，不能全部删除");
            return;      
        }
        //拼装所选择的角色
        var ids = new Array();
        Ext.each(selectStuRole, function(rec) {
            var pkValue = rec.get("uuid");
            ids.push(pkValue);
        });
        var title = "删除角色后，用户将不再拥有这些角色的权限，确定删除吗？";
        Ext.Msg.confirm('警告', title, function(btn, text) {
            if (btn == 'yes') {
                var resObj = self.ajax({
                    url: funData.action + "/doDeleteUserRole",
                    params: {
                        ids: ids.join(","),
                        userId: selectUserId
                    }
                });
                if (resObj.success) {
                    var store = studentRoleGrid.getStore();
                    var proxy = store.getProxy();
                    var filterArry = new Array();
                    filterArry.push("{'type':'numeric','comparison':'=','value':0,'field':'isDelete'}");
                    proxy.extraParams = {
                        filter: "[" + filterArry.join(",") + "]",
                        userId: selectUserId
                    };
                    store.load();
                    self.msgbox(resObj.obj);
                } else {
                    self.Error(resObj.obj);
                }
            }
        });

    },
    doAddDeptJob: function(btn){
        var self=this;
        var userDeptJobGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    
        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;
        var userId = insertObj.uuid;
        var title = "选择部门岗位";
        var funcPanel = 'student.studentdeptjob'; //仅仅是用于为编写确定按钮事件提供一个判断的标识
        var configInfo = {
            rootId: "ROOT",
            model: "com.zd.school.plartform.baseset.model.BaseDpetJobTree",
            ddCode: "DEPTJOBTREE",
            multiSelect: true,
            whereSql: "",
            orderSql: " ",
            excludes: "",
            url: comm.get('baseUrl') + "/SysDeptjob/getDeptJobTree",
        };
        self.selTreeWin({
            controller:'baseset.studentmanager.othercontroller',
            model: configInfo.model,
            title: title,
            funcPanel: funcPanel, //为了方便在控制器中捕获此窗口的确定事件
            multiSelect: configInfo.multiSelect,
            selModel: {
                selType: "checkboxmodel",
                headerWidth: 30,    //设置这个值为40。 但columns中的defaults中设置宽度，会影响他
            },
            haveButton: true,
            isEmpty: true,
            setIds: userId,
            funData: funData,
            grid: userDeptJobGrid,
            config: {
                url: configInfo.url,
                params: {
                    node: configInfo.rootId,
                    ddCode: configInfo.ddCode,
                    whereSql: configInfo.whereSql,
                    orderSql: configInfo.orderSql,
                    excludes: configInfo.excludes,
                    expanded: true
                }
            }
        });
    },
    doDeleteDeptJob: function(btn){
        var self=this;
        var deptJobGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    
        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;
        var userId = insertObj.uuid;
        var records = deptJobGrid.getSelectionModel().getSelection();
        if (records.length < 1) {
            self.msgbox("请选择要解除的部门岗位");
            return false;
        }
        var delJobs = new Array();
        var masterDept = 0;
        Ext.each(records, function(rec) {
            delJobs.push(rec.get("uuid"));
        }, this);
        var title = "确定解除这些部门岗位吗？";
        Ext.Msg.confirm('解除确认', title, function(btn, text) {
            if (btn == 'yes') {
                self.asyncAjax({
                    url: funData.action+ "/doRmoveUserFromDeptJob",
                    params: {
                        ids: delJobs.join(","),
                    },
                    timeout: 360000,
                    loadMask:true,

                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        Ext.Msg.hide();

                        if (data.success) {
                            var deptJobStore = deptJobGrid.getStore();
                            deptJobStore.load();
                            self.msgbox(data.obj);
                        } else
                        self.Warning(data.obj);
                    }
                });           
            }
        });
    },
    doSetMasterDeptJob:function(btn){
        var self=this;
        var deptJobGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    
        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;
        var userId = insertObj.uuid;
        var records = deptJobGrid.getSelectionModel().getSelection();
        if (records.length == 0) {
            self.msgbox("请选择要设置的部门岗位");
            return false;
        }
        if (records.length != 1) {
            self.msgbox("只能设置一个主部门岗位，请重新选择");
            return false;
        }
        var ids = records[0].get("uuid");
        var title = "确定设置岗位为主部门岗位吗？";
        Ext.Msg.confirm('设置确认', title, function(btn, text) {
            if (btn == 'yes') {
                self.asyncAjax({
                    url: funData.action+ "/doSetMasterDeptJob",
                    params: {
                        ids: ids,
                        setIds: userId
                    },
                    timeout: 360000,
                    loadMask:true,

                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        Ext.Msg.hide(); 

                        if (data.success) {
                            var deptJobStore = deptJobGrid.getStore();
                            deptJobStore.load();
                            self.msgbox(data.obj);
                        } else
                        self.Warning(data.obj);
                    }
                });                    
            }
        });

    },

    doAddUserToDeptJob:function(btn){
        var self=this;
        var win = btn.up("mtsswinview");
        var setIds = win.setIds;
        var funData = win.funData;
        var deptJobGrid = win.grid;
        var arry = new Array();
        //树形查询处理
        if (win.queryType == "mttreeview") {                    
            var tree = win.down("mttreeview");
            var records = tree.getSelectionModel().getSelection();
            if (records.length == 1) {                       
                if (records[0].get("level") < 99) {
                    self.msgbox("请选择岗位");
                    return false;
                }
            }
            Ext.each(records, function(rec) {
                if (rec.get("level") == 99)
                    arry.push(rec.get("id"));
            });
            if (arry.length == 0) {
                self.msgbox("请选择岗位");
                return false;
            }
            
            self.asyncAjax({
                url: funData.action + "/doAddUserToDeptJob",
                params: {
                    ids: arry.join(","),
                    setIds: setIds
                },
                timeout: 360000,
                loadMask:true,
                //回调代码必须写在里面
                success: function(response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    Ext.Msg.hide(); //关闭loadMask
                    if (data.success) {
                        var deptJobStore = deptJobGrid.getStore();
                        deptJobStore.load();
                        self.msgbox(data.obj);
                    } else
                        self.Warning(data.obj);
                    win.close();
                }
            });   
        }
    },

    loadSelectRoleStore:function(win){    
        var tabPanel=Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
        var tabItem=tabPanel.getActiveTab();
        var formpanel=tabItem.down('form[xtype=' + win.formPanel + ']');
        //var formpanel = Ext.ComponentQuery.query('form[xtype=' + win.formPanel + ']')[0];
        var classId = formpanel.getForm().findField("uuid").getValue();
        var grid = win.down("grid[xtype=pbselectRole.isselectrolegrid]");
        var store = grid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams = {
            uuid: classId
        };
        store.load();
    },

    doSelectedRole:function(btn){
        var win=btn.up("window[funcPanel=pbselectRole.selectrolelayout]");
        var grid=win.down("grid[xtype=pbselectRole.isselectrolegrid]");
        var baseGrid=win.down("basegrid");

        var tabPanel=Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
        var tabItem=tabPanel.getActiveTab();
        var formpanel=tabItem.down('form[xtype=' + win.formPanel + ']');
        var store=grid.getStore();
        var nameArray=new Array();
        var idArray=new Array();                            

        for(var i=0;i<store.getCount();i++){
            if(idArray.indexOf(store.getAt(i).get("uuid"))==-1||store.getAt(i).get("uuid")=="null"){
                nameArray.push(store.getAt(i).get("xm"));
                idArray.push(store.getAt(i).get("uuid")?store.getAt(i).get("uuid"):" ");  //为空的数据，要使用一个空格号隔开，否则后台split分割有误                        
            }                        
        }
                    
        formpanel.getForm().findField("mettingEmpid").setValue(idArray.join(","));
        formpanel.getForm().findField("mettingEmpname").setValue(nameArray.join(","));                  

        baseGrid.getStore().getProxy().extraParams.filter="[]";
        win.close();
    },
    
    doAddStudentDeptJob:function(btn){
    	var self = this;
		var win=btn.up("mtsswinview");
		//树形查询处理
		if(win.queryType=="mttreeview"){
			var tree=win.down("mttreeview");
            var selRecords=new Array();
//          var records=tree.getChecked();
//          if(records.length<=0){
                records=tree.getSelectionModel().getSelection();
//          }

            if (records.length == 1) {                       
                if (records[0].get("level") < 99) {
                    self.msgbox("请选择岗位");
                    return false;
                }
            }

            Ext.each(records, function(rec) {
                if (rec.get("level") == 99)
                    selRecords.push(rec);
            });

            if (selRecords.length == 0) {
                self.msgbox("请选择岗位");
                return false;

            }else if(selRecords.length>0){
                win.callback(win,selRecords);
                win.close();
            }
		}
	}
});