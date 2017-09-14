Ext.define("core.system.dept.controller.MainController", {
    extend: "Ext.app.ViewController",
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        treeUtil: "core.util.TreeUtil",
        detailTabUtil:"core.util.DetailTabUtil",
        queryUtil: "core.util.QueryUtil"
    },
    alias: 'controller.system.dept.maincontroller',

    init: function() {
        var self = this;

        this.control({
            //修改按钮事件
            "basetreegrid button[ref=gridEdit_Tab]": {
                beforeclick: function(btn) {
                    this.openDetail_Tab(btn,"edit");
                    return false;
                }
            },

            //增加下级按钮事件
            "basetreegrid button[ref=gridAdd_Tab]": {
                beforeclick: function(btn) {
                    //console.log(btn);
                    //return false;
                }
            },

            //部门岗位设置按钮事件
            "basetreegrid button[ref=gridSetJob]": {
                beforeclick: function(btn) {
                    this.openDetail_Tab(btn,"setJob");
                    return false;
                }
            },
            //部门岗位设置按钮事件
            "basetreegrid button[ref=gridSetMainJob]": {
                beforeclick: function(btn) {
                    this.setDeptMainJob(btn);
                    return false;
                }
            },

            //删除按钮事件
            "panel[xtype=system.dept.maingrid] button[ref=gridDelete]": {
                beforeclick: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var funCode = baseGrid.funCode;
                    var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                    //得到配置信息
                    var funData = basePanel.funData;
                    var pkName = funData.pkName;
                    //var records = baseGrid.getSelectionModel().getSelection();
                    var records = baseGrid.getView().getChecked();
                    if (records.length == 0) {
                        self.msgbox("请选择要删除的部门");
                        return;
                    }
                    var ids = new Array();
                    Ext.each(records, function(rec) {
                        var pkValue = rec.get("id");
                        var deptType = rec.get("deptType");
                        var child = rec.childNodes.length;
                        if (child == 0 && deptType != "01" && deptType != "02") {
                            //仅能删除无子部门而且类型不为学校的部门
                            ids.push(pkValue);
                        }
                    });
                    var title = "确定要删除所选的部门吗？";
                    if (ids.length == 0) {
                        self.msgbox("所选部门都有子部门或是类别为学校，不能删除");
                        return;
                    }
                    if (ids.length < records.length) {
                        title = "有些部门有子部门，仅删除不含子部门的部门。确定吗？";
                    }
                    Ext.Msg.confirm('警告', title, function(btn, text) {
                        if (btn == 'yes') {                                                    

                            //显示loadMask
                            var myMask = self.LoadMask(baseGrid);
                            //提交入库
                            self.asyncAjax({
                                url: funData.action + "/doDelete",
                                params: {
                                    ids: ids.join(","),
                                    pkName: pkName
                                },
                                //loadMask:true,
                                //回调代码必须写在里面
                                success: function(response) {
                                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                                    if (data.success) { 
                                        baseGrid.getStore().load();
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
                    //执行回调函数
                    if (btn.callback) {
                        btn.callback();
                    }
                    return false;
                }
            },

            //刷新按钮事件
            "panel[xtype=system.dept.maingrid] button[ref=gridRefresh]": {
                click: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var funCode = baseGrid.funCode;
                    var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                    var funData = basePanel.funData;
                    var store = baseGrid.getStore();
                    var proxy = store.getProxy();
                    proxy.extraParams = {
                        whereSql: funData.whereSql,
                        orderSql: funData.orderSql
                    };
                    store.load(); //刷新父窗体的grid

                    return false;
                }
            },
            
            "panel[xtype=system.dept.maingrid] button[ref=sync]": {
                beforeclick: function(btn) {                            
                    var baseGrid=btn.up("panel[xtype=system.dept.maingrid]");
                     //显示loadMask
                    var myMask = self.LoadMask(baseGrid);
                    //提交入库
                    self.asyncAjax({
                        url: "/usersync" + "/dept",
                        //loadMask:true,
                        //回调代码必须写在里面
                        success: function(response) {
                            data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                            if (data.success) { 
                                baseGrid.getStore().load();
                                self.msgbox("同步成功!");

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

                    return false;
                }
            },
            
           
            
            "panel[xtype=system.dept.maingrid]": {
                checkchange: function(node, checked, options) {
                    // if (node.data.leaf == false) {
                    //     if (checked) {
                    //         //打开节点
                    //         node.expand();
                    //         //遍历孩子
                    //         node.eachChild(function(n) {
                    //             n.set('checked', checked);
                    //             //n.data.checked = true;
                    //             // n.updateInfo({
                    //             //  checked: true
                    //             // });
                    //         });
                    //     } else {
                    //         node.expand();
                    //         node.eachChild(function(n) {
                    //             n.set('checked', checked);
                    //             // n.updateInfo({
                    //             //  checked: false
                    //             // });
                    //         });
                    //     }
                    // } else { //单击叶子时候
                    //     if (checked) { //未被选中时，取消父节点的选择状态
                    //         //node.parentNode.set('checked', checked);
                    //         //node.parentNode.data.checked = true;
                    //         // node.parentNode.updateInfo({
                    //         //  checked: true
                    //         // });
                    //     }
                    // }

                    // node.expand(true);
                    node.expand();  //只展开第一层
                    //递归选中父节点
                    // var eachParent = function(node, checked) {
                    //     if (!node.isRoot() && checked == true) {
                    //         if (!Ext.isEmpty(node.get('checked'))) {
                    //             node.set('checked', checked);
                    //             node.commit();
                    //         }
                    //         eachParent(node.parentNode, checked);
                    //     }
                    // }
                    // eachParent(node.parentNode, checked);
                    //递归选中孩子节点
                    var eachChild = function(node, checked) {
                        node.eachChild(function(n) {
                            if (!Ext.isEmpty(n.get('checked'))) {
                                n.set('checked', checked);
                                n.commit();
                            }
                            eachChild(n, checked);
                        });
                    };
                    eachChild(node, checked);                    
                    return false;
                }
            }          
        });
    },
    openDetail_Tab:function(btn, cmd,grid,record) {
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
        var funCode=moduleInfo.funCode;
        var pkName=funData.pkName;
        var tabConfig=funData.tabConfig;

        var insertObj = funData.defaultObj;
        var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
            grid: baseGrid
        });
        
        //根据cmd操作类型，来设置不同的值
        var tabTitle = ""; 
        var tabItemId ="";
        var pkValue= null;
        var operType="";
        var recordData=null;
        var itemXtype=[{
            xtype:moduleInfo.detLayout
        }];

        switch (cmd) {
            case "add":
                tabTitle = tabConfig.addTitle; 
                tabItemId = funCode + "_gridAdd";    //命名规则：funCode+'_ref名称',确保不重复
                pkValue= null;
                operType="add";
                break;
            case "edit":
                if (btn) {  //点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }else{  //点击操作列的方式
                    recordData=record.getData();
                }     

                //修改字段名
                var just = recordData["id"];
                var justName = recordData["text"];
                var justType = recordData["deptType"];

                if (justType == "01" || justType == "02") {
                    self.Error("部门类型为学校或校区，此处不能修改");
                    return;
                } else if (justType == '04') { //年级部门
                    var resObj = self.ajax({ //获取年级信息
                        url: comm.get('baseUrl') + "/gradeinfo/getGradeInfo",
                        params: {
                            id: just
                        }
                    });
                    if (resObj.success) {
                        //采用返回的数据刷新表单

                        var obj = resObj.obj;
                        insertObj.nj = obj.nj;
                        insertObj.sectionCode = obj.sectionCode;

                    }
                }
                //当前节点的上级节点
                var parent = recordData["parent"];
                var store = baseGrid.getStore();
                var parentNode = store.getNodeById(parent);
                var parentName = "ROOT";
                var parentType = "01";
                if (parentNode) {
                    parentName = parentNode.get("text");
                    parentType = parentNode.get("deptType");
                }

                insertObj = Ext.apply(insertObj, {
                    parentNode: parent,
                    parentName: parentName,
                    uuid: just,
                    nodeText: justName,
                    parentType: parentType
                },recordData);

                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-"+tabConfig.editTitle;
                else
                    tabTitle = tabConfig.editTitle;

                //获取主键值
                pkValue= recordData[pkName];
                tabItemId=funCode+"_gridEdit"; 
                operType="edit";
                break;
            case "detail":

                if (btn) {//点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }else{  //点击操作列的方式
                    recordData=record.getData();
                }
                
                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-"+tabConfig.detailTitle;
                else
                    tabTitle = tabConfig.detailTitle;

                //获取主键值
                pkValue= recordData[pkName];
                tabItemId=funCode+"_gridDetail"+pkValue;    //详情页面可以打开多个，ID不重复
                operType="detail";
                break;

            case "setJob":
                if (btn) {  //点击按钮的方式
                    var rescords = baseGrid.getSelectionModel().getSelection();
                    if (rescords.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = rescords[0].getData();
                }else{  //点击操作列的方式
                    recordData=record.getData();
                }                    
                //获取名称
                var titleName = recordData[tabConfig.titleField];
                if(titleName)
                    tabTitle = titleName+"-设置部门岗位";
                else
                    tabTitle = "设置部门岗位";

                //获取主键值
                pkValue= recordData[pkName];
                tabItemId=funCode+"_gridSetJob"; 
                operType="noButton";

                itemXtype=[{
                    xtype:moduleInfo.detLayout,
                    items: [{
                        xtype: "system.dept.deptjobgrid"
                    }]
                }];
                insertObj.deptId=pkValue;
                break;
        }


        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabPanel=moduleInfo.tabPanel;
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            tabItem = Ext.create({
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
                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:moduleInfo.otherController,         //指定重写事件的控制器
                    funCode:moduleInfo.funCode,                    //指定mainLayout的funcode
                    detCode:moduleInfo.detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                    //保存一些需要默认值，提供给提交事件中使用
                    funData:popFunData,                     //保存funData数据，提供给提交事件中使用
                    items:itemXtype
                }); 


                tabItem.add(item);  
                
                //处理打开界面之后，显示的初始数据
                if(cmd=="setJob"){
                    var deptJobGrid = item.down("basegrid[xtype=system.dept.deptjobgrid]");
                    var deptJobStore = deptJobGrid.getStore();
                    deptJobStore.getProxy().extraParams.filter='[{"type":"string","comparison":"=","value":"' + pkValue + '","field":"deptId"}]';
                    deptJobStore.loadPage(1);
                }else{
                    self.doInitFormValue(item,cmd);                
                }

            },30);
                           
        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab( tabItem);   
    },
    /*
        设置部门主负责岗位的界面
    */
    setDeptMainJob: function(btn) {
        var self=this;
        var baseGrid = btn.up("basetreegrid");
        var basePanel = btn.up("basepanel[xtype=system.dept.mainlayout]");
        var funData = basePanel.funData;
     
        var records = baseGrid.getChecked();
        if (records.length <= 0) {
            // records = tree.getSelectionModel().getSelection();
            // if (records.length <= 0) {
                self.Warning("请选择要设置主管岗位的部门");
                return false;
            //}
        }
        var setIds = new Array();
        Ext.each(records, function(rec) {
            setIds.push(rec.get("id"));
        }, this);
        var title = "选择上级主管岗位";
        var funcPanel = 'dept.mainlayout.deptsuperjob'; //仅仅是用于为编写确定按钮事件提供一个判断的标识

        var configInfo = {
            rootId: "ROOT",
            model: "com.zd.school.plartform.baseset.model.BaseDpetJobTree",
            ddCode: "DEPTJOBTREE",
            multiSelect: false,
            whereSql: "",
            orderSql: " ",
            url: comm.get('baseUrl') + "/BaseDeptjob/getDeptJobTree",
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
            //grid: baseGrid,
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
});