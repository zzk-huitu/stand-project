Ext.define("core.wisdomclass.notice.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.notice.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
    },
    control: {

        /*前端按钮权限控制*/
        // "basegrid[xtype=systemset.jobinfo.maingrid]": {
        //      afterrender: function (grid, eOpts) {
                
        //         //如果此值为1，则表明此人是超级管理员，不需要进行验证
        //         if(comm.get("isAdmin")!="1"){
        //             var menuCode="JOBINFO";     // 此菜单的前缀
        //             var userBtn=comm.get("userBtn");
        //             if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
        //                 var btnAdd = grid.down("button[ref=gridAdd_Tab]");
        //                 btnAdd.setHidden(true);
        //             }
        //             if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
        //                 var btnEdit = grid.down("button[ref=gridEdit_Tab]");
        //                 btnEdit.setHidden(true);
        //             }
        //             if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
        //                 var btnDelete = grid.down("button[ref=gridDelete]");
        //                 btnDelete.setHidden(true);
        //             }
        //         }            
        //      }
        // },
        "basetreegrid[xtype=wisdomclass.notice.maintree]": {
            itemclick: function(grid, record, item, index, e, eOpts) {
                var self = this;
                var noticeType = "";
                var mainLayout = grid.up("panel[xtype=wisdomclass.notice.mainlayout]");
                var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'noticeType'}]"
                if(record.get("level")==1){
                    filter = "";
                }
                var mainGrid = mainLayout.down("panel[xtype=wisdomclass.notice.maingrid]");
                var store = mainGrid.getStore();
                var proxy = store.getProxy();

                var funData = mainLayout.funData;
                funData = Ext.apply(funData, {
                    noticeType: record.get("id"),
                    noticeTypeName: record.get("text"),
                    noticeLevel: record.get("level"),
                    filter: filter
                });

                 //获取右边筛选框中的条件数据
                 filter=self.getFastSearchFilter(mainGrid);
                 if(filter.length==0)
                    filter=null;
                else
                    filter = JSON.stringify(filter);
                if(record.get("level")!=1)
                    noticeType = record.get("id");
                  
                //加载表格信息
                proxy.extraParams = {
                    filter: filter,
                    noticeLevel: record.get("level"),
                    noticeType: noticeType
                };
                store.loadPage(1);
                return false;
        }
     },
    	/*可以直接使用公共方法*/
        "basegrid button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {
                this.doDetail_Tab(btn,"add");
                return false;
            }
        },

        "basegrid button[ref=gridEdit_Tab]": {
            beforeclick: function(btn) {
                this.doDetail_Tab(btn,"edit");
                return false;
            }
        },


        "basegrid  actioncolumn": {
            editClick_Tab:function(data){
                var baseGrid=data.view;
                var record=data.record;

                this.doDetail_Tab(null,"edit",baseGrid,record);

                return false;
            },
            detailClick_Tab:function(data){
                var baseGrid=data.view;
                var record=data.record;

                this.doDetail_Tab(null,"detail",baseGrid,record);

                return false;
            }
        }
    },
   
    doDetail_Tab:function(btn, cmd, grid, record) {
        var self = this;
        var baseGrid;
        var recordData;

        //根据点击的地方是按钮或者操作列，处理一些基本数据
        if (btn) {
            baseGrid = btn.up("basegrid");
        } else {
            baseGrid = grid;
            recordData = record.data;
        }

        //获取整个tabpanel
        var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   

        //得到组件
        var funCode = baseGrid.funCode; //jobinfo_main
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
      
        //得到配置信息    
        var detCode =  basePanel.detCode;  
        var detLayout = basePanel.detLayout;

        //得到配置默认值
        var funData = basePanel.funData;
        var defaultObj = funData.defaultObj;

        //关键：打开新的tab视图界面的控制器
        var otherController = basePanel.otherController;
        if (!otherController)
            otherController = '';

        //处理特殊默认值
        var insertObj = self.getDefaultValue(defaultObj);
        var popFunData = Ext.apply(funData, {
            grid: baseGrid
        });


        //预先设置打开的tab页的相关属性
        var tabTitle = funData.tabConfig.addTitle;  //tab页标题
        var tabItemId=funCode+"_gridAdd";     //设置tab页的itemId；命名规则：funCode+'_ref名称',确保不重复
        var pkValue= null;      //主键值
        var operType = cmd;     //控制提交按钮的显示方式
        var itemXtype = "wisdomclass.notice.detailform";
        //判断是哪种打开方式
        switch (cmd) {
            case "edit":
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].data;
                }
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];

                insertObj = recordData;
                tabTitle = recordData["noticeTitle"]+"-"+funData.tabConfig.editTitle;
                tabItemId=funCode+"_gridEdit"; 
             
                break;
            case "detail":                
                if (btn) {
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].data;
                }
                //获取主键值
                var pkName = funData.pkName;
                pkValue= recordData[pkName];
                insertObj = recordData;
                tabTitle = recordData["noticeTitle"]+"-"+funData.tabConfig.detailTitle;
                tabItemId=funCode+"_gridDetail"+pkValue; 
                itemXtype = "wisdomclass.notice.readform";
                break;
        }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){
            //创建一个新的TAB
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
                    items:[{
                        xtype:detLayout,                        
                        funCode: detCode,
                        items: [{
                            xtype: itemXtype
                        }]             
                    }]
                }); 
                tabItem.add(item);  
                

                //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中）             
                var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                var formDeptObj = objDetForm.getForm();

                if(cmd=="add"){
                    //加载表单数据
                    self.setFormValue(formDeptObj, insertObj);

                }

                if(cmd=="edit"){
                    formDeptObj.findField("isNoticeParent").setDisabled(true);

                    var uploadpanel = objDetForm.down("panel[xtype=uploadpanel]");
                    //1. 加载文件数据
                    self.asyncAjax({
                        url: comm.get('baseUrl') + "/BaseAttachment/getFileList",
                        params: {
                            recordId: insertObj.uuid                   
                        },
                        //回调代码必须写在里面
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            uploadpanel.getStore().loadData(data);                        
                        },
                        failure: function(response) {
                            Ext.Msg.alert('读取文件数据失败！', '错误信息：\n' + response.responseText);                           
                        }
                    });
                    
                    //2. 加载部门、人员、用户等数据
                    self.asyncAjax({
                        url: funData.action + "/getNoticeOther",
                        params: {
                            noticeId: insertObj.uuid     
                        },
                        //回调代码必须写在里面
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            if (data.success) {
                                insertObj = Ext.apply(insertObj, {
                                    deptIds: data.obj.deptIds,
                                    deptNames: data.obj.deptNames,
                                    roleIds: data.obj.roleIds,
                                    roleNames: data.obj.roleNames,
                                    userIds: data.obj.userIds,
                                    userNames: data.obj.userNames,
                                    stuIds: data.obj.stuIds,
                                    stuNames: data.obj.stuNames,
                                    termIds: data.obj.termIds,  //显示的是房间id
                                    termNames: data.obj.termNames
                                });

                                //加载表单数据
                                self.setFormValue(formDeptObj, insertObj);
                            }
                        },
                        failure: function(response) {
                            Ext.Msg.alert('读取文件数据失败！', '错误信息：\n' + response.responseText);                           
                        }
                    });
                }

                if(cmd=="detail"){

                    //1. 加载部门、人员、用户等数据
                    self.asyncAjax({
                        url: funData.action + "/getNoticeOther",
                        params: {
                            noticeId: insertObj.uuid     
                        },
                        //回调代码必须写在里面
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                            if (data.success) {
                                insertObj = Ext.apply(insertObj, {
                                    deptIds: data.obj.deptIds,
                                    deptNames: data.obj.deptNames,
                                    roleIds: data.obj.roleIds,
                                    roleNames: data.obj.roleNames,
                                    userIds: data.obj.userIds,
                                    userNames: data.obj.userNames,
                                    stuIds: data.obj.stuIds,
                                    stuNames: data.obj.stuNames,
                                    termIds: data.obj.termIds,  //显示的是房间id
                                    termNames: data.obj.termNames
                                });

                                if(insertObj.deptRadio==1)
                                    insertObj.deptNames="所有部门";
                                
                                if(insertObj.stuRadio==1)
                                    insertObj.deptNames="所有学生";
                                   
                                if(insertObj.terminalRadio==1)
                                    insertObj.stuNames="所有终端";
                                

                                //加载表单数据
                                self.setFormValue(formDeptObj, insertObj);
                            }
                        },
                        failure: function(response) {
                            Ext.Msg.alert('读取文件数据失败！', '错误信息：\n' + response.responseText);                           
                        }
                    });
                    //加载表单数据
                    self.setFormValue(formDeptObj, insertObj);

                    //加载图片
                    objDetForm.down("dataview[ref=fileView]").getStore().load({
                        params: {
                            recordId: insertObj.uuid,
                            attachIsMain: '0',
                            entityName:'OaNotice'
                        }
                    });
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
        var title = "确定要导出岗位管理的信息吗？";
        
        var toolBar = btn.up("toolbar");
        if (!toolBar)
            return false;
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var name = girdSearchTexts[0].getName();
        var value = girdSearchTexts[0].getValue();
        
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/SysJob/doExportExcel?jobName='+value+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/SysJob/checkExportEnd',
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
    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "noticeTitle", "comparison": ""})
        }
        return filter;
    },
});