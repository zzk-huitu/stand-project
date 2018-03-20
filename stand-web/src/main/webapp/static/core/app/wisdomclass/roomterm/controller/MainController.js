Ext.define("core.wisdomclass.roomterm.controller.MainController", {
     extend: "Ext.app.ViewController",
     alias: 'controller.wisdomclass.roomterm.maincontroller',
     mixins: {
       suppleUtil: "core.util.SuppleUtil",
       messageUtil: "core.util.MessageUtil",
       formUtil: "core.util.FormUtil",
       gridActionUtil: "core.util.GridActionUtil",
       dateUtil: 'core.util.DateUtil',
       treeUtil: "core.util.TreeUtil"
    },
    init: function() {
     
    },
    /** 该视图内的组件事件注册 */
    control: {
        "panel[xtype=wisdomclass.roomterm.roomtree] button[ref=gridRefresh]": {
             click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore().load();
                return false;
            }
        },

        "basetreegrid[xtype=wisdomclass.roomterm.roomtree]": {
            itemclick: function (tree, record, item, index, e) {
                this.loadMainGridStore(tree,record);
                return false;
            }
        },
        "basegrid[xtype=wisdomclass.roomterm.maingrid] button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {                
                this.doDetail_tab(btn,"add");
                return false;
            }
        },
        "basegrid[xtype=wisdomclass.roomterm.maingrid] button[ref=gridEdit_Tab]": {
            beforeclick: function(btn) {
                this.doDetail_tab(btn, "edit");
                return false;
            }
        },

        "basegrid[xtype=wisdomclass.roomterm.maingrid] actioncolumn": {
        	editClick_Tab: function (data) {
        		this.doDetail_tab(null,"edit",data.view,data.record);
        		return false;

        	},
           detailClick_Tab: function (data) {
                this.doDetail_tab(null,"detail",data.view,data.record);
                return false;

            },
        },
        "basegrid[xtype=wisdomclass.roomterm.maingrid] button[ref=gridExport]": {
            beforeclick: function(btn) {
                this.doExportExcel(btn);
                return false;
            }
        },

    },

    doDetail_tab: function(btn,cmd,grid,record) {
        var self = this;
        //得到组件
        var baseGrid = grid;
        if(!baseGrid){
            baseGrid=btn.up("basegrid");
        }

        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
        var roomtreegrid = basePanel.down("basegrid[xtype=wisdomclass.roomterm.roomtree]");
        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var pkName=funData.pkName;
        var roomId = funData.roomId;

        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
        
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  
        
        //获取Tab相关数据,根据cmd的类型，来获取不同的数据
        var tabConfig=funData.tabConfig;
        var tabTitle = ""; 
        var tabItemId ="";
        var pkValue= null;
        var operType="";
        var recordData=null;
        var levelSelected =null;

        var insertObj =  Ext.apply(new Object(),funData.defaultObj);
        switch (cmd) {
            case "add":
            tabTitle = tabConfig.addTitle; 
                tabItemId = funCode + "_gridAdd";    //命名规则：funCode+'_ref名称',确保不重复
                pkValue = null;
                operType="add";
                var resObj = self.ajax({
                    url: funData.action + "/getRoomTermInfo",
                    params: {
                        roomId: roomId,
                    }
                });
                if (resObj.success) {
                    insertObj = resObj.obj;
                } else {
                    if (!Ext.isEmpty(resObj.obj)) self.msgbox(resObj.obj);
                    return;
                }
                break;
                case "edit":
                if (btn) {  //点击按钮的方式
                    var records = baseGrid.getSelectionModel().getSelection();
                    if (records.length != 1) {
                        self.msgbox("请选择一条数据！");
                        return;
                    }
                    recordData = records[0].getData();
                }else{  //点击操作列的方式
                    recordData=record.getData();
                }          
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
                        this.msgbox("请选择一条数据！");
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

                detLayout = "wisdomclass.roomterm.detailhtml";
                break;
            }

        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                //iconCls: 'x-fa fa-clipboard',
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
                itemPKV:pkValue,      //保存主键值
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){

                //创建tab内部组件                     
                
                var popFunData = Ext.apply(funData, {
                	grid: baseGrid,
                	roomId: roomId,
                	roomName: funData.roomName
                });
                if(recordData!=null){
                    insertObj=recordData;
                }
                var item=Ext.widget("baseformtab",{
                    operType:operType,                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,                    //指定detailLayout的funcode
                    tabItemId:tabItemId,                //指定tab页的itemId
                    insertObj:insertObj,                    //保存一些需要默认值，提供给提交事件中使用
                    funData:popFunData,  
                    redflagType:insertObj.redflagType,                   //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout
                    }]
                }); 
                
                tabItem.add(item); 
                
                if(cmd=="detail"){
                	var detailHtml = item.down("container[xtype=wisdomclass.roomterm.detailhtml]");
                	detailHtml.setData(insertObj); 
                }else{
                   var objDetForm = item.down("baseform[funCode=" + detCode + "]");
                   var formDeptObj = objDetForm.getForm();
                   self.setFormValue(formDeptObj, insertObj);    
               }

           },30);

        }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);   
    },
    doExportExcel:function(btn) {
        var self = this;
        var baseGrid = btn.up("basegrid");
        var funCode = baseGrid.funCode;
        var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
        var funData = basePanel.funData;
        var pkName = funData.pkName;
        //得到选中数据
        var records = baseGrid.getSelectionModel().getSelection();
        var title = "将导出系统中所有的终端信息";
        var ids = new Array();
        if (records.length > 0) {
            title = "将导出选择的终端分配的信息";
            Ext.each(records, function (rec) {
                var pkValue = rec.get(pkName);
                ids.push(pkValue);
            });

        }
        Ext.Msg.confirm('提示', title, function (btn, text) {
            if (btn == "yes") {
                Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
                var component = Ext.create('Ext.Component', {
                    title: 'HelloWorld',
                    width: 0,
                    height: 0,
                    hidden: true,
                    html: '<iframe src="' + comm.get('baseUrl') + '/BaseInfoterm/doRoomTermExportExcel?ids='+ids+'"></iframe>',
                    renderTo: Ext.getBody()
                });

                var time = function () {
                    self.syncAjax({
                        url: comm.get('baseUrl') + '/BaseInfoterm/checkExportEnd',
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
                    }, 1000);  
            }
        });
        return false;
    },

    loadMainGridStore:function(tree,record){
              
        var mainLayout = tree.up("panel[xtype=wisdomclass.roomterm.mainlayout]");
        Ext.apply( mainLayout.funData, {
            roomId: record.get("id"),
            roomName:record.get("text"),
            leaf : record.get("leaf"),//true: 房间 false:区域
            arealevel: record.get("level"),
        });
        // 加载房间的人员信息
        var mianGrid = mainLayout.down("panel[xtype=wisdomclass.roomterm.maingrid]");
        /*
        var girdSearchTexts = mianGrid.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "termName", "comparison": ""})
        }
        if(filter.length==0)
            filter=null;
        else
            filter = JSON.stringify(filter);
        */

        //默认参数
        var filter=new Array();
        filter.push({"type": "numeric", "value": 1, "field": "isUse", "comparison": "="});

        //获取点击树节点的参数
        var roomId= record.get("id");
        var roomLeaf=record.get("leaf");
        if(roomLeaf==true)
            roomLeaf="1";
        else
            roomLeaf="0";

        var store = mianGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams={
            roomId:roomId,
            roomLeaf:roomLeaf,
            filter: JSON.stringify(filter)
        };
       // proxy.extraParams.roomId=roomId;
        store.loadPage(1);
    },

});