
Ext.define("core.system.dept.controller.OtherController", {
    extend: "Ext.app.ViewController",

    alias: 'controller.system.dept.othercontroller',

    /*把不需要使用的组件，移除掉*/
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        queryUtil: "core.util.QueryUtil"
    },
   
    init: function() {
        var self = this;

        this.control({       
            "baseformtab[detCode=deptinfo_detail] button[ref=formSave]": {
                beforeclick: function(btn) {
                    self.doSave(btn, "addSave");
                    return false;
                }
            },           

            "mtfuncwindow button[ref=ssOkBtn]":{
                beforeclick:function(btn){
                    console.log("重写mtfuncwindow的确定按钮");
                }
            },

             //增加部门岗位事件
            "basegrid[xtype=system.dept.deptjobgrid] button[ref=gridAddJob]": {
                beforeclick: function(btn) {
                    this.openJobDetail(btn);                             
                    return false;
                }
            },
            /**
             * 部门岗位设置上级主管岗位事件
             * @type {[type]}
             */
            "basegrid[xtype=system.dept.deptjobgrid] button[ref=gridSetSuperJob]": {
                beforeclick: function(btn) {
                    var baseGrid=btn.up("basegrid[xtype=system.dept.deptjobgrid]")
                    self.setDeptJobSuperJob(baseGrid);
                    return false;
                }
            },
            /**
             * 部门岗位指定上级主管岗位确定事件，只获取最下面的叶子节点
             */
            "mtsswinview[funcPanel=dept.mainlayout.deptjobsuperjob] button[ref=ssOkBtn]": {
                beforeclick: function(btn) {
                    this.saveSuperJob(btn);
                    return false;
                }
            },

            /**
             * 部门指定上级主管岗位确定事件，只获取最下面的叶子节点
             */
            "mtsswinview[funcPanel=dept.mainlayout.deptsuperjob] button[ref=ssOkBtn]": {
                beforeclick: function(btn) {
                    this.saveDeptSuperJob(btn);
                    return false;         
                }
            },

            /**
             * 添加部门岗位确认事件
             * @type {[type]}
             */
            "baseformwin[funCode=selectjob_main] button[ref=formSave]": {
                beforeclick: function(btn) {
                    this.saveDeptJob(btn);    
                    return false;
                }
            },

            /**
             * 操作列的操作事件
             */
            "basegrid[xtype=system.dept.deptjobgrid] actiontextcolumn[ref=deptJobDetail]": {
                detailClick: function(grid, cmd, rowIndex) {
                    switch (cmd) {
                        case "delete":
                            self.delDeptJob(grid, cmd, rowIndex);
                            break;
                        case "setLeader":
                            self.setLeaderJob(grid, cmd, rowIndex);
                            break;
                        case "setSuperJob":
                            self.setDeptJobSuperJob(grid, cmd, rowIndex);
                            break;
                    }

                    return false;
                }
            },
    	       


        });
    },

    //保存处理的操作
    doSave: function(btn, cmd) {
        var self = this;
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页

        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");
        
        var formObj = objForm.getForm();
        var funData = detPanel.funData;
        var pkName = funData.pkName;
        var pkField = formObj.findField(pkName);
        var params = self.getFormValue(formObj);  

        var parent = formObj.findField("parentNode").getValue();
        var parentName = formObj.findField("parentName").getValue();
        var deptType = formObj.findField("deptType").getValue();
        var orderIndex = formObj.findField("orderIndex").getValue() + 1;
        var parentType = formObj.findField("parentType").getValue();

        //根据上级部门的类型业控制本部门的类型
        var info = "";
/*        switch (deptType) {
            case "01":
                info = "部门类型不能为学校";
                break;
            case "02":
                info = "部门类型不能为校区"
                break;
            case "03":
                if (parentType != "03" && parentType != "02") {
                    info = "上级部门类型只能是部门或校区";
                }
                break;
            case "04":
                if (parentType != "03") {
                    info = "年级的上级部门类型只能是部门";
                }
                break;
            case "05":
                if (parentType != "04") {
                    info = "班级的上级部门类型只能是年级";
                }
                break;
            case "06":
                if (parentType != "03") {
                    info = "学科的上级部门的类型只能是部门";
                }
                break;
        }*/
        if (info.length>0){
            self.Warning(info);
            return;
        }
        // if (deptType == "06" || deptType == "04") {
        //     //当前部门类型为学科组或年级组，上级部门只能是职能部门
        //     if (parentType != "03") {
        //         self.Warning("只能在类型为部门的部门下添加学科或年级");
        //         return;
        //     }
        // }
        // if (deptType == "03") {
        //     //当前部门类型为部门，上级部门只能是部门或校区
        //     if (parentType != "03" && parentType != "02") {
        //         self.Warning("当前部门类型为部门时，上级部门类型只能是部门或校区");
        //         return;
        //     }
        // }        
        // if (parentType == "03") {
        //     if (deptType != "04") {
        //         self.Warning("上级部门类型为年级时,只能添加班级");
        //         return;
        //     }
        // } else {
        //     if (deptType == "04") {
        //         self.Warning("上级部门类型不为年级时,不能直接添加班级");
        //         return;
        //     }
        // }
        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {

            var loading = self.LoadMask(basetab, '正在提交，请稍等...');
 
            self.asyncAjax({
                url: funData.action + "/" + act,
                params: params,
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                       
                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            act=="doAdd"?store.loadPage(1):store.load();                            
                        }
                        loading.hide();
                        tabPanel.remove(tabItem);
                     
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
                    errors.push("<font color=red>" + f.fieldLabel + "</font>：" + f.getErrors().join(","));
                }
            });
            self.msgbox(errors.join("<br/>"));
        }
    },
    /**
     * 删除部门岗位事件
     * @param  {[type]} btn      [description]
     * @param  {[type]} cmd      [description]
     * @param  {[type]} rowIndex [description]
     * @return {[type]}          [description]
     */
    delDeptJob: function(grid, cmd, rowIndex) {
        var self = this;
        var baseGrid = grid;
        var basePanel = grid.up("panel[xtype=system.dept.detaillayout]");
    
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var records = baseGrid.getStore().getAt(rowIndex);
        if (records.get("jobType") == 0) {
            self.msgbox("当前岗位是部门负责岗位，不能删除");
            return;
        }
     
        var loadMask=self.LoadMask(baseGrid);    //显示遮罩

        var pkValue = records.get(pkName);
        //发送ajax请求,检查删除的岗位是否是其它部门或岗位的上级岗位
        self.asyncAjax({
            url: comm.get('baseUrl') + "/SysDeptjob/chkIsSuperJob",
            params: {
                ids: pkValue
            },
            //回调代码必须写在里面
            success: function(response) {
                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if (data.success) {

                    var msg = data.obj;
                    if (msg == "") {
                        var title = "确定删除本岗位吗？";
                        Ext.Msg.confirm('删除确认', title, function(btn, text) {
                            if (btn == 'yes') {
                                self.asyncAjax({
                                    url:  comm.get('baseUrl') + "/SysDeptjob/doDelete",
                                    params: {
                                        ids: pkValue
                                    },
                                    //回调代码必须写在里面
                                    success: function(response) {
                                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                                        if (data.success) {
                                            //刷新部门岗位列表
                                            var deptJobStore = baseGrid.getStore();                                                        
                                            deptJobStore.remove(records);

                                            self.msgbox(data.obj);
                                        }else {
                                            self.Error(data.obj);
                                        }

                                        loadMask.hide();
                                    },
                                    failure: function(response) {      
                                        loadMask.hide();                         
                                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);                            
                                    }
                                });                            
                            }else{
                                loadMask.hide();
                            }
                        });
                    } else {
                        var errors = ["本岗位为其它部门或岗位上级，无法删除："];
                        var msgInfo = msg.split(",");
                        Ext.each(msgInfo, function(s) {
                            errors.push("<font color=red>" + s + "</font>");
                        }, this);
                        self.msgbox(errors.join("<br/>"));
                        loadMask.hide();
                    }

                } else {            
                    self.Error(data.obj);     
                    loadMask.hide();   
                }
            },
            failure: function(response) {      
                loadMask.hide();                         
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);                            
            }
        });  
    },
    /**
     * 设置指定岗位为部门负责岗位事件
     * @param {[type]} btn      [description]
     * @param {[type]} cmd      [description]
     * @param {[type]} rowIndex [description]
     */
    setLeaderJob: function(grid, cmd, rowIndex) {
        var self = this;
        var baseGrid = grid;
        var basetab = grid.up('baseformtab'); 
        var basePanel = grid.up("panel[xtype=system.dept.detaillayout]");
        
        var records = baseGrid.getStore().getAt(rowIndex);
        if (records.get("jobType") == 0) {
            //当前岗位已是部门负责岗位，不需要再设置
            var msg = '<span style="color:red;font-size:14px">当前岗位已是部门主负责岗位，不需要再设置</span>';
            self.msgbox(msg);
            return;
        }

        var funData = basePanel.funData;    
        var pkName = funData.pkName;
        var insertObj = basetab.insertObj; 
        var pkValue = records.get(pkName);
        var title = "确定设置本岗位为部门主负责岗位吗？";
        Ext.Msg.confirm('设置确认', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                var loadMask=self.LoadMask(baseGrid);    //显示遮罩

                //发送ajax请求,检查删除的岗位是否是其它部门或岗位的上级岗位
                self.asyncAjax({
                    url:  comm.get('baseUrl') + "/SysDeptjob/setLeaderJob",
                    params: {
                        ids: pkValue,
                        deptId: insertObj.deptId
                    },
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) {
                            //刷新部门岗位列表
                            var deptJobStore = baseGrid.getStore();                                                        
                            deptJobStore.loadPage(1);

                            self.msgbox(data.obj);
                        }else{
                            self.Error(data.obj);
                        }
                        loadMask.hide();

                    },
                    failure: function(response) {      
                        loadMask.hide();                         
                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);                            
                    }
                });
            }
        });
    },
    /*
        设置主负责岗位的界面
    */
    setDeptJobSuperJob: function(grid, cmd, rowIndex) {

        var self=this;
        var baseGrid = grid;
        var basetab = baseGrid.up('baseformtab');
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");    

        var funData = basePanel.funData;
        var insertObj = basetab.insertObj;
        
        if (!Ext.isEmpty(rowIndex)) {
            //通过Action列设置
            records = baseGrid.getStore().getAt(rowIndex);
            insertObj = records.getData();
            selCount = 1;
        } else {
            //选中后点击修改按钮设置
            records = baseGrid.getSelectionModel().getSelection();
            if (records.length < 1) {
                self.Warning("请选择要设置上级主管的岗位");
                return false;
            }
            insertObj = records[0].getData();
            selCount = records.length;
        }

        if (selCount < 1) {
            self.Warning("请选择要设置上级主管的岗位");
            return false;
        }
        var setIds = new Array();
        Ext.each(records, function(rec) {
            setIds.push(rec.get("uuid"));
        }, this);

        var title = "选择上级主管岗位";
        var funcPanel = 'dept.mainlayout.deptjobsuperjob'; //仅仅是用于为编写确定按钮事件提供一个判断的标识

        var configInfo = {
            rootId: "ROOT",
            model: "com.zd.school.plartform.baseset.model.BaseDpetJobTree",
            ddCode: "DEPTJOBTREE",
            multiSelect: false,
            whereSql: "",
            orderSql: " ",
            url: comm.get('baseUrl') + "/SysDeptjob/getDeptJobTree",
        }

        self.selTreeWin({
            controller:'system.dept.othercontroller',
            model: configInfo.model,
            title: title,
            funcPanel: funcPanel, //为了方便在控制器中捕获此窗口的确定事件
            multiSelect: configInfo.multiSelect,
            haveButton: true,
            isEmpty: true,
            setIds: setIds.join(","),
            funData: funData,
            grid: baseGrid,
            config: {
                url: configInfo.url,
                params: {
                    node: configInfo.rootId,
                    ddCode: configInfo.ddCode,
                    whereSql: configInfo.whereSql,
                    orderSql: configInfo.orderSql,
                    expanded: true
                }
            }
        });            
    },
    saveSuperJob:function(btn){
        var self=this;
        var win = btn.up("mtsswinview");
        var setIds = win.setIds;
        var funData = win.funData;
        var deptJobGrid = win.grid;

        var arry = new Array();
        //树形查询处理
        if (win.queryType == "mttreeview") {                    
            var tree = win.down("mttreeview");
            var records = tree.getChecked();
            if (records.length <= 0) {
                records = tree.getSelectionModel().getSelection();
            }
            if (records[0].get("level") < 99) {
                self.Warning("请选择岗位");
                return false;
            }
            var pkValue = records[0].get("id");
            
            self.asyncAjax({
                url: comm.get('baseUrl') + "/SysDeptjob/setSuperJob",
                params: {
                    ids: pkValue,
                    setIds: setIds,
                    types: "deptjob"
                },
                timeout: 360000,
                loadMask:true,
                //回调代码必须写在里面
                success: function(response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    Ext.Msg.hide(); //关闭loadMask

                    if (data.success) {
                        var deptJobStore = deptJobGrid.getStore();                       
                        deptJobStore.loadPage(1);
                        self.msgbox(data.obj);
                    } else
                        self.Error(data.obj);
                    win.close();            
                }
            }); 
        }
    },

    saveDeptSuperJob:function(btn){
        var self=this;
        var win = btn.up("mtsswinview");
        var setIds = win.setIds;
        var funData = win.funData;
        var deptJobGrid = win.grid;
        
        var arry = new Array();
        //树形查询处理
        if (win.queryType == "mttreeview") {                    
            var tree = win.down("mttreeview");
            var records = tree.getChecked();
            if (records.length <= 0) {
                records = tree.getSelectionModel().getSelection();
            }
            if (records[0].get("level") < 99) {
                self.Warning("请选择岗位");
                return false;
            }
            var pkValue = records[0].get("id");
            
            self.asyncAjax({
                url: comm.get('baseUrl') + "/SysDeptjob/setSuperJob",
                params: {
                    ids: pkValue,
                    setIds: setIds,
                    types: "dept"
                },
                timeout: 360000,
                loadMask:true,
                //回调代码必须写在里面
                success: function(response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    Ext.Msg.hide(); //关闭loadMask

                    if (data.success) {
                        self.msgbox("保存成功!");
                        win.close();
                    } else
                        self.Error(data.obj);
                    win.close();            
                }
            }); 
        }
    },

    /*
        保存部门岗位数据
    */
    saveDeptJob:function(btn){
        var self=this;
        var win = btn.up('window');
        var funCode = win.funCode;
        var funData = win.funData;
        var deptId = funData.deptId;
        var basePanel = win.down("basepanel[funCode=" + funCode + "]");

        var isSelectGrid = basePanel.down("panel[xtype=pubselect.isselectjobgrid]");
        var isSelectStore = isSelectGrid.getStore();
        var iCount = isSelectStore.getCount(); //已选的角色个数                
        //拼装所选择的数据
        var ids = new Array();
        for (var i = 0; i < iCount; i++) {
            var record = isSelectStore.getAt(i);
            var pkValue = record.get("uuid");
            ids.push(pkValue);
        }
        if (ids.length > 0) {

            var loadMask=self.LoadMask(win);    //显示遮罩

            self.asyncAjax({
                url: comm.get('baseUrl') + "/SysDeptjob/batchSetDeptJob",
                params: {
                    deptId: deptId,
                    ids: ids.join(",")
                },
                //回调代码必须写在里面
                success: function(response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    loadMask.hide();

                    if (data.success) {
                        self.msgbox("设置成功!");
                        var grid = funData.grid; //窗体是否有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            var proxy = store.getProxy();                               
                            store.loadPage(1); //刷新父窗体的grid
                            win.close();
                        }
                    } else {
                        if (!Ext.isEmpty(data.obj))
                            self.Error(data.obj);
                    }

                },
                failure: function(response) {      
                    loadMask.hide();                         
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);                            
                }
            });            
        } else {
            self.Warning("没有选择岗位");
        }
    },
    /*
        打开部门岗位设置窗口
    */
    openJobDetail:function(btn){
        var self = this;
                
        var baseGrid = btn.up("basegrid");                
        var basetab = btn.up('baseformtab');   

        var detCode =  basetab.detCode;   
        var basePanel = basetab.down("basepanel[funCode=" + detCode + "]");        
      
        var detCode = "selectjob_main";
        var detLayout = "pubselect.selectjoblayout";

        var insertObj = basetab.insertObj;      

        var popFunData = Ext.apply(basePanel.funData, {
            grid: baseGrid,
            deptId: insertObj.deptId
        });     

        var width = 1200;
        var height = 600;      

        var otherController="system.dept.othercontroller";

        var iconCls = 'x-fa fa-plus-circle';
        var operType = "edit";
        var title = "选择岗位";                        
    
        var win = Ext.create('core.base.view.BaseFormWin', {
            title: title,
            iconCls: iconCls,
            operType: operType,
            width: width,
            height: height,
            controller: otherController,
            funData: popFunData,
            funCode: detCode,    //修改此funCode，方便用于捕获window的确定按钮                       
            items: [{
                xtype:detLayout
            }]
        });
        win.show();  
    }
});