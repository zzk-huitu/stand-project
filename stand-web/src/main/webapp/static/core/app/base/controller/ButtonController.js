/**
 * 程序主控制器
 */
Ext.define("core.base.controller.ButtonController", {
    extend: "Ext.app.Controller",
    initBtn: function () {
        var self = this;
        var btnCtr = {

            //高级搜索按钮[显示或隐藏高级搜索面板]
            "basepanel basegrid button[ref=gridHignSearch]": {
                click: function (btn) {
                    this.showHideHightSearch(btn);
                }
            },
            //快速搜索按按钮
            "basepanel basegrid button[ref=gridFastSearchBtn]": {
                click: function (btn) {
                    this.queryFastSearchForm(btn);
                }
            },
            //快速搜索文本框回车事件
            "basepanel basegrid field[funCode=girdFastSearchText]": {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.queryFastSearchForm(field);                
                    }
                }
            },


            /**
             *通用表格添加事件（弹出tab的形式）
             */
            "basepanel basegrid button[ref=gridAdd_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"add");
                }
            },
            
            
            /**
             *通用treegird表格添加事件（弹出tab的形式）
             */
            "basepanel basetreegrid button[ref=gridAdd_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"add");
                }
            },
            
            
            /**
             *通用treegird表格添加事件（弹出tab的形式）
             */
            "basepanel basetreegrid button[ref=gridAddBrother_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"add");
                }
            },
            

            /**
             *通用表格编辑事件（弹出tab的形式）
             */
            "basepanel basetreegrid button[ref=gridEdit_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"edit");
                }
            },
            

            /**
             *通用表格编辑事件（弹出tab的形式）
             */
            "basepanel basegrid button[ref=gridEdit_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"edit");
                }
            },
            /**
             *通用表格详情事件（弹出tab的形式）
             */
            "basepanel basegrid button[ref=gridDetail_Tab]": {
                click: function (btn) {
                    this.openDetail_Tab(btn,"detail");
                }
            },


            /**
             *通用表格添加事件
             */
            "basepanel basegrid button[ref=gridAdd]": {
                click: function (btn) {
                    this.openDetail_Win(btn,"add");
                }
            },
            /**
             * 通用表格详细点击事件
             * @type {[type]}
             */
            "basepanel basegrid button[ref=gridDetail]": {
                click: function (btn) {
                    this.openDetail_Win(btn,"detail");
                }
            },
            /**
             * 通用表格编辑事件
             */
            "basepanel basegrid button[ref=gridEdit]": {
                click: function (btn) {
                    this.openDetail_Win(btn,"edit");
                }
            },
            /**
             *  通用表格删除事件
             */
            "basepanel basegrid button[ref=gridDelete]": {
                click: function (btn) {
                    this.doDeleteRecords(btn);
                }
            },
            /**
             * 通用导出Excel
             * @type {[type]}
             */
            "basepanel basegrid button[ref=exportExcel]": {
                click: function (btn) {
                    var baseGrid = btn.up("basegrid");
                    var funCode = baseGrid.funCode;
                    var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                    var funData = basePanel.funData;
                    funData = Ext.apply(funData, {
                        modelName: baseGrid.model,
                        fileName: baseGrid.fileName,
                        exWhereSql: baseGrid.exWhereSql
                    });
                    var win = Ext.create('Ext.Window', {
                        title: "导出Excel",
                        iconCls: 'application_form',
                        width: 620,
                        resizable: false,
                        constrain: true,
                        //autoHeight: true,
                        height: 600,
                        modal: true,
                        closeAction: 'destroy',
                        plain: true,
                        items: [{
                            xtype: "baseexportexcel",
                            funData: funData
                        }]
                    });
                    win.show();
                    
                    return false;
                }
            },
            /**
             * 通用下载导入模版
             * @type {[type]}
             */
            "basepanel basegrid button[ref=dlImportModel]": {
                click: function (btn) {
                    var baseGrid = btn.up("basegrid");
                    var funCode = baseGrid.funCode;
                    var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                    var funData = basePanel.funData;
                    Ext.Msg.wait('正在生成中,请稍后...', '温馨提示');
                    Ext.create('Ext.panel.Panel', {
                        title: 'Hello',
                        width: 200,
                        html: '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src="' + comm.get('baseUrl') + '/ExcelFactory/dlImportModel?modelName=' + funData.modelName + '&fileName=' + funData.fileName + '模版' + '"></iframe>',
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
                }
            },
            "basepanel basegrid button[ref=importExcel]": {
                click: function (btn) {
                    var baseGrid = btn.up("basegrid")
                    var funCode = baseGrid.funCode;
                    var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                    var funData = basePanel.funData;
                    var win = Ext.create('core.base.view.BaseFormWin', {
                        title: "文件上传",
                        iconCls: 'application_form',
                        operType: 'addReturn',
                        width: 450,
                        height: 120,
                        grid: baseGrid,
                        funData: funData,
                        items: [{
                            xtype: "baseimportexcel"
                        }]
                    });
                    win.show();
                    return false;
                }
            },        
            /**
             * 通用弹出窗体保存事件
             * 采用ajax的模式提交数据，并返回提交的数据
             */
            "baseformwin button[ref=formSave]": {
                click: function (btn) {
                    this.saveDetail_Win(btn);
                }
            },
            /**
             * 通用弹出窗体关闭事件
             * 直接关闭窗体了
             */
            "baseformwin button[ref=formClose]": {
                click: function (btn) {
                    this.closeDetail_Win(btn);
                }
            },


            
            "baseformtab button[ref=formSave]": {
                click: function (btn) {
                    this.saveDetail_Tab(btn);
                }
            },
            "baseformtab button[ref=formClose]": {
                click: function (btn) {
                    this.closeDetail_Tab(btn);
                }
            }
        }

        Ext.apply(self.ctr, btnCtr);
    },


    showHideHightSearch:function(btn){
        //得到组件
        var baseGrid = btn.up("basegrid");
        var baseQueryForm = baseGrid.down("basequeryform");

        if (baseQueryForm) {
            var isHidden = baseQueryForm.hidden;
            if (isHidden)
                baseQueryForm.show();
            else
                baseQueryForm.hide();
        }
    },
    queryFastSearchForm:function(component){
        //得到组件                 
        var baseGrid = component.up("basegrid");
        if (!baseGrid)
            return false;

        var toolBar = component.up("toolbar");
        if (!toolBar)
            return false;

        var filter = [];
        var gridFilter=[];
        //获取baseGrid中编写的默认filter值
        var gridFilterStr=baseGrid.extParams.filter;
        if(gridFilterStr&&gridFilterStr.trim()!=""){
            gridFilter=JSON.parse(gridFilterStr);
            filter=gridFilter;
        }
       
        //可能存在多个文本框       
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        for (var i in girdSearchTexts) {
            var name = girdSearchTexts[i].getName();
            var value = girdSearchTexts[i].getValue();

            //判断gridFilter是否包含此值。
            var isExist=false;
            for(var j=0;j<gridFilter.length;j++){
                if(gridFilter[j].field==name){
                    filter[j]={"type": "string", "value": value, "field": name, "comparison": ""};
                    isExist=true;
                    break;
                }
            }
            if(isExist==false)
                filter.push({"type": "string", "value": value, "field": name, "comparison": ""});
        }

        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);
    },
    openDetail_Tab:function(btn, cmd) {
        var self = this;

        //得到组件
        var baseGrid=btn.up("basegrid");
        if(baseGrid==null) { //如果找不到，就找treegrid
            baseGrid = btn.up("basetreegrid");  
            if(baseGrid==null){  //还找不到组件，结束执行。
                self.msgbox("找不到组件！");
                return;
            }
        }
        //获取组件相关信息
        var moduleInfo = self.getModuleInfo(baseGrid);
        
        //获取Tab相关数据
        var funData=moduleInfo.funData;
        var tabInfo = self.getTabInfo(moduleInfo.funCode,funData.pkName,funData.tabConfig,baseGrid,btn,cmd);

        if(tabInfo==null)
            return;
        
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabPanel=moduleInfo.tabPanel;
        var tabItem=tabPanel.getComponent(tabInfo.tabItemId);
        if(!tabItem){

            //创建tabItem
            tabItem = self.createTabItem(tabInfo);
            
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){

                //创建tab内部组件                
                var item = self.createBaseFormTab(baseGrid,moduleInfo,tabInfo);               
                tabItem.add(item);  
                
                //处理打开界面之后，显示的初始数据
                self.doInitFormValue(item,cmd);

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=tabInfo.pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);   
    },
    openDetail_Win:function(btn,cmd){
        var self=this;
        //得到组件
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");

        //得到配置信息
        var funData = basePanel.funData;
        var detCode = basePanel.detCode;
        var detLayout = basePanel.detLayout;
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';    
        
        var iconCls= 'x-fa fa-plus-circle';
        //处理特殊默认值
        var insertObj = funData.defaultObj;
        if(cmd!="add"){
            var rescords = baseGrid.getSelectionModel().getSelection();
            if (rescords.length != 1) {
                self.Info("请选择数据");
                return;
            }
            insertObj = rescords[0].getData();

            if(cmd=="edit")
                 iconCls= 'x-fa fa-pencil-square';
            else 
                 iconCls= 'x-fa fa-file-text';
        }

        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });
        var width = 1000;
        var height = 650;
        if (funData.width)
            width = funData.width;
        if (funData.height)
            height = funData.height;

        var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls:iconCls,
            operType: cmd,
            width: width,
            height: height,
            controller: otherController,
            funData: popFunData,
            funCode: detCode,
            insertObj: insertObj,
            items: [{
                xtype: detLayout
            }]
        });
        win.show();

        var detPanel = win.down("basepanel[funCode=" + detCode + "]");
        var objDetForm = detPanel.down("baseform[funCode=" + detCode + "]");
        var formDeptObj = objDetForm.getForm();

        self.setFormValue(formDeptObj, insertObj);

        if(cmd=="detail")
            self.setFuncReadOnly(funData, objDetForm, true);
    },
    doDeleteRecords:function(btn){
        var self=this;
        //得到组件
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        //得到配置信息
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        if (records.length > 0) {
            var msg='是否删除数据?';
            if(btn.msg)
                msg=btn.msg;
            
            //封装ids数组
            Ext.Msg.confirm('提示', msg, function (btn, text) {
                if (btn == 'yes') {
                    
                    var loading = new Ext.LoadMask(baseGrid, {
                        msg: '正在提交，请稍等...',
                        removeMask: true// 完成后移除
                    });
                    loading.show();

                    var ids = new Array();
                    Ext.each(records, function (rec) {
                        var pkValue = rec.get(pkName);
                        ids.push(pkValue);
                    });

                    self.asyncAjax({
                        url: funData.action + "/doDelete",
                        params: {
                            ids: ids.join(","),
                            pkName: pkName
                        },                       
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if(data.success){
                                var store=baseGrid.getStore();
                                //如果当前页的数据量和删除的数据量一致，则翻到上一页
                                if(store.getData().length==records.length&&store.currentPage>1){    
                                    store.loadPage(store.currentPage-1);
                                }else{
                                    //store.load();
                                    store.remove(records); //不刷新的方式
                                }
                                
                                /*
                                var totalCount=store.getTotalCount();
                                var pageSize=store.pageSize;
                                if((totalCount-records.length)%pageSize==0){
                                    store.loadPage(1);
                                }else{
                                    store.load();
                                }*/

                            
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
            });
        } else {
            self.msgbox("请选择数据");
        }
    },
    closeDetail_Tab:function(btn){
        //得到组件
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");

        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);
        //关闭tab
        tabPanel.remove(tabItem);
    },
    closeDetail_Win:function(btn){
        btn.up('window').close();
    },
    saveDetail_Tab:function(btn){
        var self=this;
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

        /*处理提交的参数*/

        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {

            var loading = new Ext.LoadMask(basetab, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

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
    saveDetail_Win:function(btn){
        var self=this;
        var win = btn.up('window');
        var funCode = win.funCode;
        var basePanel = win.down("basepanel[funCode=" + funCode + "]");
        var objForm = basePanel.down("baseform[funCode=" + funCode + "]");
        var formObj = objForm.getForm();
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        var pkField = formObj.findField(pkName);
        var params = self.getFormValue(formObj);
        
        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {

            var loading = new Ext.LoadMask(win, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            self.asyncAjax({
                url: funData.action + "/" + act,
                params: params,
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {

                        self.msgbox("提交成功!");
                       
                        var grid = win.funData.grid; //窗体是否有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();
                            act=="doAdd"?store.loadPage(1):store.load();
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
    }
});