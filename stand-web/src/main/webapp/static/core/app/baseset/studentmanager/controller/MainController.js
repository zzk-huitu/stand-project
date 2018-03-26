Ext.define("core.baseset.studentmanager.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.studentmanager.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    
    init: function () {
        this.getRightDeptIds();
    },

    control: {
            "basepanel basegrid[xtype=baseset.studentmanager.studentgrid]": {
               afterrender : function(grid) {
                    this.hideFuncBtn(grid);
                },
                beforeitemclick: function(grid) {
                    this.disabledFuncBtn(grid);
                },

            },
            //锁定账户事件
            "basegrid[xtype=baseset.studentmanager.studentgrid] button[ref=gridLock]": {
                click: function(btn) {
                    this.doList(btn, "lock");
                    return false;
                }
            },

            //解锁账户事件
            "basegrid[xtype=baseset.studentmanager.studentgrid] button[ref=gridUnLock]": {
                click: function(btn) {
                    this.doList(btn, "unlock");
                    return false;
                }
            },

            //重置密码事件
            "basegrid[xtype=baseset.studentmanager.studentgrid] button[ref=gridSetPwd]": {
                click: function(btn) {
                    this.doList(btn, "setpwd");
                    return false;
                }
            },
            //导出
            "basegrid[xtype=baseset.studentmanager.studentgrid] button[ref=gridExport]": {
                beforeclick: function(btn) {
                    this.doExport(btn);
                    return false;
                }
            },
             //同步人员数据到UP
            "panel[xtype=baseset.studentmanager.studentgrid] button[ref=syncToUP]": {
                beforeclick: function(btn) {   
                    this.doSyncToUP(btn); 
                    return false;     
                }
            },
            //操作列
            "basegrid[xtype=baseset.studentmanager.studentgrid] actioncolumn": {
                detailClick_Tab: function (data) {
                    this.doDetail_Tab(null,"detail",data.view,data.record);
                    return false;
                },
                //角色管理 userRole
                gridUserRoleClick:function(data){
                    this.doDetail_Tab(null, data.cmd, data.view, data.record);
                    return false;
                },
                //部门岗位 deptJob
                gridDeptJobClick:function(data){
                    this.doDetail_Tab(null, data.cmd, data.view, data.record);
                    return false;
                },
                //编辑按钮
                editClick_Tab: function (data) {
                    this.doEditClick_Tab(null,data.cmd,data.view,data.record);
                    return false;
                },
            },
            
            "basegrid[xtype=baseset.studentmanager.studentgrid] button[ref=gridEdit_Tab]": {
                beforeclick: function (btn) {
                	this.doEditClick_Tab(btn, "edit", null, null);
                    return false;
                }
            },
   },

    //锁定账户、解锁账户及重置密码
    doList: function(btn, cmd) {
        var self = this;
        var studentGrid = btn.up("basegrid");
        var mainLayout = studentGrid.up("panel[xtype=baseset.studentmanager.mainlayout]");
        var funData = mainLayout.funData;
        var info = "";
        var title = "";
        var url = "";
        switch (cmd) {
            case "lock":
                info = "请选择要锁定的账户";
                title = "确定要锁定选择的账户吗？<br/>（只能操作有部门权限的用户）";
                url = funData.action + "/doLock";
                break;
            case "unlock":
                info = "请选择要解锁的账户";
                title = "确定要解锁选择的账户吗？<br/>（只能操作有部门权限的用户）";
                url = funData.action + "/doUnlock";
                break;
            case "setpwd":
                info = "请选择要重置密码的账户";
                title = "确定要重置所选账户的密码吗？<br/>（只能操作有部门权限的用户）";
                url = funData.action + "/doSetPwd";
                break;
        }
        //选择的用户
        var selecStudent = studentGrid.getSelectionModel().getSelection();
        if (selecStudent.length == 0) {
            self.msgbox(info);
            return;
        }
       

        //ajax的方式提交数据
        Ext.Msg.confirm('温馨提示', title, function(btn, text) {
            if (btn == 'yes') {
                //显示loadMask
                var myMask = self.LoadMask(studentGrid);

                //拼装所选择的用户
                var ids = new Array();
                var selectedUsers=new  Array();
                Ext.each(selecStudent, function(rec) {
                    if(comm.get("userRidhtDeptIds").indexOf(rec.get("deptId"))!=-1){
                        var pkValue = rec.get("uuid");
                        ids.push(pkValue);
                        selectedUsers.push(rec);
                    }             
                });

                //提交入库
                self.asyncAjax({
                    url: url,
                    params: {
                        ids: ids.join(",")
                    },
                    //loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) { 

                            switch (cmd) {
                                case "lock":
                                    //静态的更新数据
                                    Ext.each(selectedUsers, function(rec) {
                                        rec.set("state","1");    //改变数据
                                        rec.commit();   //提交一下 
                                    }, this);
                                    break;
                                case "unlock":
                                    //静态的更新数据
                                    Ext.each(selectedUsers, function(rec) {
                                        rec.set("state","0");    //改变数据
                                        rec.commit();   //提交一下 
                                    }, this);
                                    break;
                                case "setpwd":                                    
                                    break;
                            }            
                            self.msgbox(data.obj);      
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
            }
        });
    },
    doExport:function(btn){
        var self = this;
        var StudentGrid = btn.up("basegrid");
        var proxy = StudentGrid.getStore().getProxy();
        var deptId = proxy.extraParams.deptId;
        if(deptId==undefined){
            deptId="";
        }
        var girdSearchTexts = StudentGrid.query("field[funCode=girdFastSearchText]");
        var userName ="";
        var xm = "";
        if(girdSearchTexts[0]!=null){
           userName = girdSearchTexts[0].getValue();
        }
         if(girdSearchTexts[1]!=null){
           xm = girdSearchTexts[1].getValue();
        }
        var title = "确定要导出学生用户管理的信息吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/SysUser/doExportExcel?deptId='+deptId+'&userName='+userName+'&xm='+xm+'&category='+2+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/SysUser/checkExportEnd',
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
       return false;
    },
    doDetail_Tab:function(btn, cmd, grid, record) {
        var self = this;
        var baseGrid;
        var recordData;       

        if (btn) {
            baseGrid = btn.up("basegrid");
            var rescords = baseGrid.getSelectionModel().getSelection();
            if (rescords.length != 1) {
                self.msgbox("请选择一条数据！");
                return;
            }
            recordData = rescords[0].getData();
        } else {
            baseGrid = grid;
            recordData = record.getData();
        }       


        if(cmd!='detail'){  
            if( comm.get("userRidhtDeptIds").indexOf(recordData.deptId)==-1){
                self.Warning("您没有操作此部门用户的权限，不能操作！");
                return;
            }
        }



        //得到组件
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");

        //得到配置信息
        var funData = basePanel.funData;
        var detCode =  basePanel.detCode;  
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;
                
        //关键：window的视图控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });

        insertObj = recordData;

         //本方法只提供班级详情页使用
        var tabTitle =insertObj.xm+"-角色管理";
        //设置tab页的itemId
        var pkValue= null;
        var operType = "detail";    // 只显示关闭按钮
        switch(cmd){
            case 'userRole':
                var tabTitle =insertObj.xm+"-角色管理";
                //设置tab页的itemId
                var tabItemId=funCode+"_gridUserRole"+insertObj.uuid;    //详细界面可以打开多个
                items=[{
                    xtype:detLayout,
                    defaults:null,
                    items:[{
                        xtype:'baseset.studentmanager.studentrolegrid',
                        title:null
                    }]
                }];
                break;
            case 'deptJob':
                var tabTitle =insertObj.xm+"-部门岗位";
                //设置tab页的itemId
                var tabItemId=funCode+"_gridDeptJob"+insertObj.uuid;    //详细界面可以打开多个
                items=[{
                    xtype:detLayout,
                    defaults:null,
                    items:[{
                        xtype:'baseset.studentmanager.studentdeptjobgrid',
                        title:null
                    }]
                }];
                break;
            case 'detail':
                var tabTitle =insertObj.xm+"-用户详情";
                //设置tab页的itemId
                var tabItemId=funCode+"_gridDetail"+insertObj.uuid;    //详细界面可以打开多个
                items=[{
                    xtype:detLayout,
                    defaults:null,
                    items:[{
                        xtype:'baseset.studentmanager.detailhtml',
                        title:null
                    }]
                }];
                break;
        }
       //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
    
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
                    items:items
                }); 
                tabItem.add(item);  
                
                switch(cmd){
                    case 'userRole':

                        var roleGrid = item.down("panel[xtype=baseset.studentmanager.studentrolegrid]");
                        var roleStore = roleGrid.getStore();
                        var roleProxy = roleStore.getProxy();
                        roleProxy.extraParams = {
                            userId: insertObj.uuid
                        };
                        roleStore.load();

                        break;
                    case 'deptJob':
                        var deptJobGrid = item.down("panel[xtype=baseset.studentmanager.studentdeptjobgrid]");
                        var deptJobStore = deptJobGrid.getStore();
                        var deptJobProxy = deptJobStore.getProxy();
                        deptJobProxy.extraParams = {
                            userId: insertObj.uuid
                        };
                        deptJobStore.load();
                        break;
                    case 'detail':
                        /*处理数据字典值*/
                        var ddCodes = ['XLM', 'ZZMMM','ZXXBZLB','HYZKM','JKZKM','XZQHM','GJDQM','GATQWM','XYZJM','XXM','XZQHM','HKLBM','MZM'];
                        var propNames = ['xlm', 'zzmmm','bzlbm','hyzkm','jkzkm','csdm','gjdqm','gatqwm','xyzjm','xxm','hkszdxzqhm','hklbm','mzm'];
                        for (var i = 0; i < ddCodes.length; i++) {
                            var ddItem = factory.DDCache.getItemByDDCode(ddCodes[i]);   //取出字典项值
                            var resultVal = "";
                            var value = insertObj[propNames[i]];        //原始值
                            for (var j = 0; j < ddItem.length; j++) {   //遍历该字典所有值
                                var ddObj = ddItem[j];
                                if (value == ddObj["itemCode"]) {       //判断
                                    resultVal = ddObj["itemName"];      
                                    break;
                                }
                            }
                            insertObj[propNames[i]] = resultVal;    //替换为具体值
                        }
                        var userInfoContainer = tabItem.down("container[ref=studentBaseInfo]");
                        insertObj.zp = comm.get("virtualFileUrl")+"/"+insertObj.zp;     //给照片的路径，加上一个虚拟路径
                        userInfoContainer.setData(insertObj);

                        self.asyncAjax({
                            url: comm.get('baseUrl') + "/SysUser/userRoleList",
                            params: {
                                page: 1,
                                start: 0,
                                limit: 0,
                                userId: insertObj.uuid
                            },
                            success: function (response) {
                                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                                var roleUserContainer = tabItem.down("container[ref=studentDetailInfo]");
                                roleUserContainer.setData(data);
                            }
                        });
                        break;
                }

                

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);
        
        
    },
    doSyncToUP:function(btn){
        //同步人员数据事件    
        var self = this;                    
        var baseGrid = btn.up("grid");

        Ext.MessageBox.confirm('同步人员数据到UP', '您确定要执行同步人员数据到UP操作吗？', function(btn, text) {                  
            if (btn == 'yes') {
                Ext.Msg.wait('正在同步人员数据，请等待...','提示');
                setTimeout(function(){
                //异步ajax加载
                Ext.Ajax.request({
                    url: comm.get('baseUrl') + "/SysUser/doSyncAllUserInfoToUp",
                    params: { },
                    timeout:1000*60*60*10,     //10个小时
                    success: function(response){
                        var result=JSON.parse(response.responseText);
                       if (result.success) {      
                            Ext.Msg.hide();               
                            self.msgbox(result.msg);
                            baseGrid.getStore().loadPage(1);                                                                    
                        } else {
                            Ext.Msg.hide(); 
                            self.Error(result.msg);

                        }
                    },
                    failure: function(response, opts) {
                        Ext.Msg.hide(); 
                        self.Error("请求失败，请联系管理员！");                                  
                    }
                });                              
            },100);                           
        }
     });

    },

    hideFuncBtn:function(grid){    
        if(comm.get("isAdmin")!="1"){

            var menuCode="STUDENTMANAGER";    
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridLock")==-1){
                var btnlock = grid.down("button[ref=gridLock]");
                btnlock.setHidden(true);

            }
            if(userBtn.indexOf(menuCode+"_gridUnLock")==-1){
                var btnUnlock = grid.down("button[ref=gridUnLock]");
                btnUnlock.setHidden(true);
            }
            if(userBtn.indexOf(menuCode+"_gridSetPwd")==-1){
                var btnPwd = grid.down("button[ref=gridSetPwd]");
                btnPwd.setHidden(true);
            }
            if(userBtn.indexOf(menuCode+"_gridExport")==-1){
                var btnExport = grid.down("button[ref=gridExport]");
                btnExport.setHidden(true);                    
            }
            if(userBtn.indexOf(menuCode+"_syncToUP")==-1){
                var btnSync = grid.down("button[ref=syncToUP]");
                btnSync.setHidden(true);                    
            }
            if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                var btnUpdate = grid.down("button[ref=gridEdit_Tab]");
                btnUpdate.setHidden(true);                    
            }
            if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
                var btnAdd = grid.down("button[ref=gridAdd_Tab]");
                btnAdd.setHidden(true);                    
            }
        }
    },

    disabledFuncBtn:function(grid){    
        var basePanel = grid.up("basepanel");
        var basegrid = basePanel.down("basegrid[xtype=baseset.studentmanager.studentgrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnLock = basegrid.down("button[ref=gridLock]");
        var btnUnLock = basegrid.down("button[ref=gridUnLock]");
        var btnSetPwd = basegrid.down("button[ref=gridSetPwd]");
        if (records.length == 0) {
            btnLock.setDisabled(true);
            btnUnLock.setDisabled(true);
            btnSetPwd.setDisabled(true);
        } else if (records.length == 1) {
            btnLock.setDisabled(false);
            btnUnLock.setDisabled(false);
            btnSetPwd.setDisabled(false);
        } else {
            btnLock.setDisabled(false);
            btnUnLock.setDisabled(false);
            btnSetPwd.setDisabled(false);
        }
    },
    
    /**
     * 增加或修改学生详细处理
     * @param btn
     * @param cmd
     * @param grid
     * @param record
     */
    doEditClick_Tab: function (btn, cmd, grid, record) {
        var self = this;
        var baseGrid;
        var recordData;

        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.getData();
        }

        //得到组件
        var funCode = baseGrid.funCode;
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]"); //标签页
        var basePanel = baseGrid.up("panel[funCode=" + funCode + "]");

        //得到配置信息
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        var defaultObj = funData.defaultObj;

        var operType = cmd;
        var pkValue = null;

        //关键：window的视图控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);

        //一些要传递的参数
        var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            whereSql: " and isDelete='0' ",
        });

        //默认的tab参数
        var tabTitle = funData.tabConfig.addTitle; //标签页的标题
        var tabItemId = funCode + "_gridAdd";     //命名规则：funCode+'_ref名称',确保不重复

        //根据操作命令组装不同的数据
        switch (cmd) {
            case "edit":
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择1条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }

                if( comm.get("userRidhtDeptIds").indexOf(recordData.deptId)==-1){
                    self.Warning("您没有操作此部门用户的权限，不能操作！");
                    return;            
                }

                insertObj = recordData;
                tabTitle = funData.tabConfig.editTitle;
                tabItemId = funCode + "_gridEdit";
                //获取主键值
                var pkName = funData.pkName;
                pkValue = recordData[pkName];
                break;
        }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem = tabPanel.getComponent(tabItemId);

        //判断是否已经存在tab了
        if (!tabItem) {
            tabItem = Ext.create({
                xtype: 'container',
                title: tabTitle,
                scrollable: true,
                itemId: tabItemId,
                itemPKV: pkValue,    //保存主键值
                layout: 'fit',
            });
            tabPanel.add(tabItem);

            //延迟放入到tab中
            setTimeout(function () {
                //创建组件
                var item = Ext.widget("baseformtab", {
                    operType: operType,
                    controller: otherController,         //指定重写事件的控制器
                    funCode: funCode,                    //指定mainLayout的funcode
                    detCode: detCode,                    //指定detailLayout的funcode
                    tabItemId: tabItemId,                //指定tab页的itemId
                    insertObj: insertObj,                //保存一些需要默认值，提供给提交事件中使用
                    funData: popFunData,                //保存funData数据，提供给提交事件中使用
                    items: [{
                        xtype: detLayout
                    }]
                });
                tabItem.add(item);

                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();
                var courseDesc = objDetForm.down("htmleditor");
                var deptJobField = formDeptObj.findField("deptJob");
                deptJobField.hide(); 

                self.setFormValue(formDeptObj, insertObj);
                
                //显示照片
                if(insertObj.zp!=null)
                    objDetForm.down('image[ref=photoImage]').setSrc(comm.get("virtualFileUrl")+"/"+insertObj.zp);   
              
            }, 30);

        } else if (tabItem.itemPKV && tabItem.itemPKV != pkValue) {     //判断是否点击的是同一条数据，不同则替换数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);
    },

    //获取当前用户的有权限的部门
    getRightDeptIds:function(){
        var self=this;
        self.asyncAjax({
            url: comm.get('baseUrl') + "/SysOrg/getUserRightDeptIds",
            params: {},
            //回调代码必须写在里面
            success: function(response) {
                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                if (data.success) {         
                    comm.add("userRidhtDeptIds",data.obj);
                }else{
                   self.Error(data.obj);
                }
            },
            failure: function(response) {           
                Ext.Msg.alert('请求用户权限部门失败', '错误信息：\n' + response.responseText);     
            }
        }); 
    }


});