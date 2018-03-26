Ext.define("core.system.user.controller.MainController", {
    extend: "Ext.app.ViewController",
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        gridActionUtil: "core.util.GridActionUtil"
    },
    
    alias: 'controller.system.user.maincontroller',

    init: function() {
        var self = this;

        this.getRightDeptIds();

        //事件注册
        this.control({
            "basepanel basegrid[xtype=system.user.usergrid]": {
                afterrender : function(grid) {
                    this.hideFuncBtn(grid);                
                },
                beforeitemclick: function(grid) {
                    this.disabledFuncBtn(grid);                
                    return false;
                },            
            },
            "basegrid[xtype=system.user.usergrid] button[ref=gridImport]": {
                beforeclick: function (btn) {
                    this.openImportView(btn);
                    return false;
                }
            },
//
//            "basegrid[xtype=system.user.usergrid] button[ref=gridEdit_Tab]": {
//                beforeclick: function (btn) {
//                    var baseGrid=btn.up("basegrid[xtype=system.user.usergrid]");
//                    var rescords = baseGrid.getSelectionModel().getSelection();
//                    if (rescords.length != 1) {
//                        self.msgbox("请选择一条数据！");
//                        return false;
//                    }
//                    var recordData = rescords[0].getData();
//
//                    //得到组件
//                    if( comm.get("userRidhtDeptIds").indexOf(recordData.deptId)==-1){
//                        self.Warning("您没有操作此部门用户的权限，不能操作！");
//                        return false;
//                    }
//                }
//            },
            
            "basegrid[xtype=system.user.usergrid] button[ref=gridEdit_Tab]": {
                beforeclick: function (btn) {
                	this.doEditClick_Tab(btn, "edit", null, null);
                    return false;
                }
            },



            "basegrid[xtype=system.user.usergrid] actioncolumn": {
                detailClick_Tab: function (data) {
                    this.doDetail_Tab(null,"detail",data.view,data.record);
                    return false;
                }
            },
            "panel[xtype=system.user.usergrid] actiontextcolumn": {
                gridUserRoleClick:function(data){
                    var baseGrid = data.view;
                    var record = data.record;

                    this.doDetail_Tab(null, data.cmd, baseGrid, record);
                 
                    return false;
                },
                gridDeptJobClick:function(data){
                    var baseGrid = data.view;
                    var record = data.record;

                    this.doDetail_Tab(null, data.cmd, baseGrid, record);
                 
                    return false;
                },
                gridDeptRightClick:function(data){
                    var baseGrid = data.view;
                    var record = data.record;

                    this.doDetail_Tab(null, data.cmd, baseGrid, record);
                 
                    return false;
                },

                deleteClick:function(data){
                    var baseGrid = data.view;
                    var record = data.record;
                    this.doDeleteUser(baseGrid,record);
                    return false;
                }
            },

          
            
            "basegrid[xtype=system.user.usergrid] button[ref=gridExport]": {
                beforeclick: function(btn) {
                    this.doExport(btn);
                    return false;
                }
            },            
            /*
            "panel[xtype=system.user.usergrid] button[ref=sync]": {
                beforeclick: function(btn) {
                    var baseGrid=btn.up("panel[xtype=system.user.usergrid]");
                     //显示loadMask
                    var myMask = self.LoadMask(baseGrid);
                    //提交入库
                    self.asyncAjax({
                        url: "/usersync" + "/list",
                        //loadMask:true,
                        //回调代码必须写在里面
                        success: function(response) {
                            data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if (data.success) { 
                                baseGrid.getStore().load();
                                self.msgbox("同步成功!");

                            }else{
                               self.Error("请先同步部门和岗位数据!");
                            }
                            myMask.hide();
                        },
                        failure: function(response) {           
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                            myMask.hide();
                        }
                    }); 
                	
                    return false;
                }
            },
            */
            "panel[xtype=system.user.usergrid] button[ref=syncToUP]": {
                beforeclick: function(btn) {   
                    this.doSyncToUp(btn);      
                    return false;
                }
            },
            /*
            "panel[xtype=system.user.usergrid] button[ref=syncCardInfoFromUP]": {
                beforeclick: function(btn) {         
                     //同步人员数据事件                        
                    var baseGrid = btn.up("grid");
                   
                    Ext.MessageBox.confirm('从UP同步发卡信息', '您确定要执行从UP同步发卡信息操作吗？', function(btn, text) {                  
                        if (btn == 'yes') {
                            
                            Ext.Msg.wait('正在从UP同步发卡信息，请等待...','提示');
                            
                            setTimeout(function(){

                                //异步ajax加载
                                Ext.Ajax.request({
                                    url: comm.get('baseUrl') + "/SysUser/doSyncAllCardInfoFromUp",
                                    params: { },
                                    timeout:1000*60*60*10,     //10个小时
                                    success: function(response){
                                        var result=JSON.parse(response.responseText);

                                        if (result.success) {                                
                                            self.msgbox(result.msg);
                                            baseGrid.getStore().loadPage(1);

                                            Ext.Msg.hide();                                        
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

                    return false;
                }
            },
            */


            //添加用户选择后确定事件
            "baseformwin[funCode=selectsysuser_main] button[ref=formSave]": {
                beforeclick: function(btn) {
                    this.doSelectUserSetDept(btn);
                    return false;
                }
            },

            //修改用户事件
            "panel[xtype=system.user.usergrid] button[ref=gridEdit]": {
                beforeclick: function(btn) {
                    self.doDetail(btn, "edit");
                    return false;
                }
            },           

            //删除用户事件
            "panel[xtype=system.user.usergrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    var userGrid = btn.up("basegrid");                   
                    //选择的用户
                    var selectUser = userGrid.getSelectionModel().getSelection();
                    if (selectUser.length == 0) {
                        self.msgbox("请选择要删除的用户");
                        return false;
                    }

                    this.doDeleteUser(userGrid,selectUser);
                    
                    return false;
                }
            },

            //锁定账户事件
            "panel[xtype=system.user.usergrid] button[ref=gridLock]": {
                click: function(btn) {
                    self.doList(btn, "lock");
                    return false;
                }
            },

            //解锁账户事件
            "panel[xtype=system.user.usergrid] button[ref=gridUnLock]": {
                click: function(btn) {
                    self.doList(btn, "unlock");
                    return false;
                }
            },

            //重置密码事件
            "panel[xtype=system.user.usergrid] button[ref=gridSetPwd]": {
                click: function(btn) {
                    self.doList(btn, "setpwd");
                    return false;
                }
            },

            

            

            //待选人员列表的事件
            "panel[xtype=system.user.selectusergrid]":{
                beforeitemdblclick:function(grid, record, item, index, e, eOpts) {
                    selectStore = grid.getStore();
                    selectStore.removeAt(index);

                    var basePanel = grid.up("panel[xtype=system.user.selectuserlayout]");
                    var isSelectGrid = basePanel.down("panel[xtype=system.user.isselectusergrid]");
                    var isSelectStore = isSelectGrid.getStore();
                    isSelectStore.insert(0,[record]);
                    return false;
                }
            },
            //已选人员列表的事件
            "panel[xtype=system.user.isselectusergrid]":{
                beforeitemdblclick:function(grid, record, item, index, e, eOpts) {
                    isSelectStore = grid.getStore();
                    isSelectStore.removeAt(index);

                    var basePanel = grid.up("panel[xtype=system.user.selectuserlayout]");
                    var selectGrid = basePanel.down("panel[xtype=system.user.selectusergrid]");
                    var selectStore = selectGrid.getStore();
                    selectStore.insert(0,[record]);
                    return false;
                }
            }            
        });
    },
    //用户增加、修改处理
    doDetail: function(btn, cmd) {
        var self = this;
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("panel[xtype=system.user.mainlayout]");
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        // var filterArry = new Array();
        // filterArry.push("{'type':'string','comparison':'=','value':'" + funData.deptId + "','field':'deptId'}");
        // filterArry.push("{'type':'numeric','comparison':'=','value':0,'field':'isDelete'}");
        var popFunData = Ext.apply(funData, {
            grid: baseGrid,
            //filter: "[" + filterArry.join(",") + "]",
            deptId: funData.deptId
        });
        //选择的部门信息
        var deptTree = baseGrid.up("panel[xtype=system.user.mainlayout]").down("panel[xtype=system.user.depttree]");
        var selectDept = deptTree.getSelectionModel().getSelection();
        if (selectDept.length != 1) {
            self.msgbox("请选择部门!");
            return false;
        }
        var deptObj = selectDept[0];
        var deptId = deptObj.get("id");
        var deptName = deptObj.get("text");
        var deptCode = deptObj.get("code");
        //处理特殊默认值
        var defaultObj = funData.defaultObj;
        var insertObj = self.getDefaultValue(defaultObj);
        //根据选择的记录与操作确定form初始化的数据
        insertObj = Ext.apply(insertObj, {
            deptId: deptId,
            deptName: deptName
        }); //
        var iconCls = "x-fa fa-plus-circle";
        var title = "新增用户";
        switch (cmd) {
            case "add":
                break;
            case "edit":
                var records = baseGrid.getSelectionModel().getSelection();
                iconCls = "x-fa fa-pencil-square";
                operType = "edit";
                title = "修改用户";
                insertObj = Ext.apply(insertObj, records[0].data);
                break;
        }
        var winId = detCode + "_win";
        var win = Ext.getCmp(winId);
        if (!win) {
            win = Ext.create('core.base.view.BaseFormWin', {
                id: winId,
                title: title,
                width: 600,
                height: 330,
                resizable: false,
                iconCls: iconCls,
                operType: cmd,
                funData: popFunData,
                funCode: detCode,
                //给form赋初始值
                insertObj: insertObj,
                items: [{
                    xtype: "system.user.userlayout"
                }]
            });
        }
        win.show();
        var detailPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detailPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();
        var deptjobField = formDeptObj.findField("deptJob");
        deptjobField.hidden(); 
        //表单赋值
        self.setFormValue(formDeptObj, insertObj);
    },

    //锁定账户、解锁账户及重置密码
    doList: function(btn, cmd) {
        var self = this;
        var userGrid = btn.up("basegrid");
        var mainLayout = userGrid.up("panel[xtype=system.user.mainlayout]");
        //var userRoleGrid = mainLayout.down("panel[xtype=user.userrolegrid]");
        var funData = mainLayout.funData;
        var deptId = funData.deptId;
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
        var selectUser = userGrid.getSelectionModel().getSelection();
        if (selectUser.length == 0) {
            self.msgbox(info);
            return false;
        }
       

        //ajax的方式提交数据
        Ext.Msg.confirm('温馨提示', title, function(btn, text) {
            if (btn == 'yes') {
                //显示loadMask
                var myMask = self.LoadMask(userGrid);

                //拼装所选择的用户(只能操作有部门权限的用户)
                var ids = new Array();
                var selectedUsers=new  Array();
                Ext.each(selectUser, function(rec) {
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
        //var insertObj = self.getDefaultValue(defaultObj);
        var insertObj = recordData;
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });

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
                        xtype:'system.user.userrolegrid',
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
                        xtype:'system.user.userdeptjobgrid',
                        title:null
                    }]
                }];
                break;
            case 'deptRight':
                operType="edit";
                detCode="deptRight";
                var tabTitle =insertObj.xm+"-部门权限";
                //设置tab页的itemId
                var tabItemId=funCode+"_gridDeptRight"+insertObj.uuid;    //详细界面可以打开多个
                items=[{
                    xtype:detLayout,
                    layout:'vbox',
                    scrollable: 'x',
                    items:[{
                        width:'100%',
                        height:110,
                        xtype:'system.user.userrightdeptform',
                        title:null
                    },{ 
                        width:'99%',
                        flex:1,
                        xtype:'system.user.userdeptrightgrid',
                        title:null,
                        style:{
                            border:'1px solid #097db5 ',
                            margin:'10px'
                        }
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
                        xtype:'system.user.detailhtml',
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
                //iconCls: 'x-fa fa-clipboard',
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

                        var roleGrid = item.down("panel[xtype=system.user.userrolegrid]");
                        var roleStore = roleGrid.getStore();
                        var roleProxy = roleStore.getProxy();
                        roleProxy.extraParams = {
                            userId: insertObj.uuid
                        };
                        roleStore.load();

                        break;
                    case 'deptJob':
                        var deptJobGrid = item.down("panel[xtype=system.user.userdeptjobgrid]");
                        var deptJobStore = deptJobGrid.getStore();
                        var deptJobProxy = deptJobStore.getProxy();
                        deptJobProxy.extraParams = {
                            userId: insertObj.uuid
                        };
                        deptJobStore.load();
                        break;
                    case 'deptRight':
                        var deptRightGrid = item.down("panel[xtype=system.user.userdeptrightgrid]");
                        var deptRightStore = deptRightGrid.getStore();
                        var deptRightProxy = deptRightStore.getProxy();
                        deptRightProxy.extraParams = {
                            filter:"[{'type':'string','comparison':'=','value':'"+insertObj.uuid+"','field':'userId'}]"
                        };
                        
                        //默认是指定部门，所以当为全部部门时，不需要刷新指定部门的表格数据，
                        if(insertObj.rightType==0 ){
                            deptRightGrid.hide();

                            var radios=item.down("radiogroup");
                            radios.items.items[0].setValue(true);
                        }else{
                            deptRightStore.load();
                        }
                     
                        break;
                    case 'detail':
                    	
                    	 /*处理数据字典值*/
                        var ddCodes = ['XLM', 'ZZMMM','ZXXBZLB','HYZKM','JKZKM','XZQHM','GJDQM','GATQWM','XYZJM','XXM','XZQHM','HKLBM','MZM'];
                        var propNames = ['xlm', 'zzmmm','bzlbm','hyzkm','jkzkm','csdm','gjdqm','gatqwm','xyzjm','xxm','hkszd','hkxzm','mzm'];
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
                        var userInfoContainer = tabItem.down("container[ref=userBaseInfo]");
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
                                var roleUserContainer = tabItem.down("container[ref=userDetailInfo]");
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

    doExport:function(btn){
        var self = this;
        var baseGrid = btn.up("basegrid");
        var mainlayout=baseGrid.up("panel[xtype=system.user.mainlayout]");
        var userGrid = mainlayout.down("basegrid[xtype=system.user.usergrid]");
        var proxy = userGrid.getStore().getProxy();
        var deptId = proxy.extraParams.deptId;
        if(deptId==undefined){
            deptId="";
        }
        var girdSearchTexts = userGrid.query("field[funCode=girdFastSearchText]");
        var userName ="";
        var xm = "";
        if(girdSearchTexts[0].getValue()!=null){
           userName = girdSearchTexts[0].getValue();
        }
         if(girdSearchTexts[1].getValue()!=null){
           xm = girdSearchTexts[1].getValue();
        }
        var title = "确定要导出用户管理的信息吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/SysUser/doExportExcel?deptId='+deptId+'&userName='+userName+'&xm='+xm+'"></iframe>',
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


    openImportView:function(btn){
        var self = this;
        //得到组件
        var baseGrid = btn.up("basegrid");
    
        var win = Ext.create('Ext.Window', {
            title: "导入用户数据",
            iconCls: 'x-fa fa-clipboard',
            width: 450,
            resizable: false,
            constrain: true,
            autoHeight: true,
            modal: true,
            controller: 'public.importExcel.maincontroller',
            closeAction: 'close',
            plain: true,
            grid: baseGrid,
            items: [{
                xtype: "public.importExcel.importform",
                url:comm.get('baseUrl') + "/SysUser/importData",
                downUrl:comm.get('baseUrl') + "/SysUser/downNotImportInfo"
            }]
        });
        win.show();

    },

    hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="SYSUSER";     // 此菜单的前缀
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
        var basegrid = basePanel.down("basegrid[xtype=system.user.usergrid]");
        var records = basegrid.getSelectionModel().getSelection();
        var btnLock = basegrid.down("button[ref=gridLock]");
        var btnUnLock = basegrid.down("button[ref=gridUnLock]");
        var btnSetPwd = basegrid.down("button[ref=gridSetPwd]");
        var btnEdit = basegrid.down("button[ref=gridEdit_Tab]");
        if (records.length == 0) {
            btnLock.setDisabled(true);
            btnUnLock.setDisabled(true);
            btnSetPwd.setDisabled(true);
            btnEdit.setDisabled(true);
        } else if (records.length == 1) {
            btnLock.setDisabled(false);
            btnUnLock.setDisabled(false);
            btnSetPwd.setDisabled(false);
            if(records[0].getData().issystem==0){
            btnEdit.setDisabled(true);
            }else{
            btnEdit.setDisabled(false);     
            }
        } else {
            btnLock.setDisabled(false);
            btnUnLock.setDisabled(false);
            btnSetPwd.setDisabled(false);
            btnEdit.setDisabled(true);
        }
    },

    doDeleteUser:function(grid,records){
        var self=this;
        var userGrid = grid;
        var selectUser = records;

        var mainLayout = userGrid.up("panel[xtype=system.user.mainlayout]");
        var funData = mainLayout.funData;

        //拼装所选择的用户
        var ids = new Array();
        Ext.each(selectUser, function(rec) {
            var pkValue = rec.get("uuid");
            ids.push(pkValue);
        });
        var title = "确定删除所选择的用户吗？";
        Ext.Msg.confirm('信息', title, function(btn, text) {
            if (btn == 'yes') {

                //显示loadMask
                var myMask = self.LoadMask(userGrid);
                //提交入库
                self.asyncAjax({
                    url: funData.action + "/doDelete",
                    params: {
                        ids: ids.join(","),                        
                    },
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) {
                            //刷新用户列表
                            var userStore=userGrid.getStore();
                            //如果当前页的数据量和删除的数据量一致，则翻到上一页
                            if(userStore.getData().length==records.length&&userStore.currentPage>1){    
                                userStore.loadPage(userStore.currentPage-1);
                            }else{
                                //store.load();
                                userStore.remove(records); //不刷新的方式
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

    doSyncToUp:function(btn){
        var self=this;
        //同步人员数据事件                        
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

    doSelectUserSetDept:function(btn){
        var self=this;
        var win = btn.up('window');
        var funCode = win.funCode;
        var funData = win.funData;
        var deptId = funData.deptId;
        var basePanel = win.down("basepanel[funCode=" + funCode + "]");
        var isSelectGrid = basePanel.down("panel[xtype=system.user.isselectusergrid]");
        var isSelectStore = isSelectGrid.getStore();
        var iCount = isSelectStore.getCount(); //已选的角色个数
        //拼装所选择的角色
        var ids = new Array();
        for (var i = 0; i < iCount; i++) {
            var record = isSelectStore.getAt(i);
            var pkValue = record.get("uuid");
            ids.push(pkValue);
        }
        if (ids.length > 0) {
             //显示loadMask
            var myMask = self.LoadMask(win);
            //提交入库
            self.asyncAjax({
                url: funData.action + "/doBatchSetDept",
                params: {
                    deptId: deptId,
                    ids: ids.join(",")
                },
                //回调代码必须写在里面
                success: function(response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    myMask.hide();
                    if (data.success) {                                 
                        self.msgbox("保存成功!");
                        var grid = win.funData.grid; //窗体是否有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams = {
                                whereSql: win.funData.whereSql,
                                orderSql: win.funData.orderSql,
                                deptId: deptId
                            };
                            store.load(); //刷新父窗体的grid
                            win.close();
                        }

                    }else{
                       self.Error(data.obj);
                    }
                },
                failure: function(response) {           
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                    myMask.hide();
                }
            }); 

        } else {
            self.msgbox("没有选择用户");
        }
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
    },

    /**
     * 修改用户详细处理
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
                objDetForm.down('image[ref=newsImage]').setSrc(insertObj.zp);
            }, 30);

        } else if (tabItem.itemPKV && tabItem.itemPKV != pkValue) {     //判断是否点击的是同一条数据，不同则替换数据
            self.Warning("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);
    },

});