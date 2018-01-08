Ext.define("core.smartcontrol.roombagrule.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.smartcontrol.roombagrule.othercontroller',
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
    	"baseformtab[detCode=roombagrule_detail] button[ref=formSave]":{
            beforeclick: function(btn) {
                this.doSave_Tab(btn, "save");
                return false;
            }
        },

        "baseformtab[detCode=roombagrule_binddetail] button[ref=formSave]":{
            beforeclick: function(btn) {
                this.doSaveBind(btn);
                return false;
            }
        },
        "baseformwin[funCode=selectuser_detail] button[ref=formSave]": {
            beforeclick: function (btn) {     
                this.doSelectUserData(btn);    
                return false;
            }
        },
        /*在打开视图显示之后的需要进行处理的数据*/
        "baseformtab[detCode=roombagrule_detail]":{
            afterrender: function(cmp) {
                this.doLoadInfo(cmp);
                return false;
            }
        },

    },

    doSave_Tab:function(btn,cmd){

        var self=this;
        //获取基本的容器
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页


        //这两个数据是从MainController中传递过来的
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        //获取当前按钮对应的表单
        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");


        //获取表单的实际数据
        var formObj = objForm.getForm();
        var funData = detPanel.funData;
        var pkName = funData.pkName;
        var pkField = formObj.findField(pkName);
        


        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {

            var params = self.getFormValue(formObj);
            
            params.shutDownStart = Ext.util.Format.date("0 "+params.shutDownStart, 'Y-m-d H:i:s');
            params.shutDownEnd = Ext.util.Format.date("0 "+params.shutDownEnd, 'Y-m-d H:i:s');
        
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

                
                        loading.hide();

                        self.msgbox("保存成功!");        

                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();                           
                            store.load(); //刷新父窗体的grid
                        }

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

    doSaveBind:function(btn){
        var self=this;

        //获取基本的容器
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页


        //这两个数据是从MainController中传递过来的
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var roomGrid = basetab.down('panel[xtype=smartcontrol.roombagrule.roomgrid]');
        var selectGrid = roomGrid.getSelectionModel().getSelection();

        if(selectGrid.length==0){
            self.msgbox("请选择绑定汇率的房间!");
            return false;
        }

        //汇率规则
        var roomRuleId = tabItem.itemPKV;
        //获取选择的房间
        var roomIds=new Array();       
        for(var i=0;i<selectGrid.length;i++){
            roomIds.push(selectGrid[i].get('uuid'));
        }

        //获取设置指定扣费的房间
        var deductionUserIds =new Array();  
        var deductionRoomIds =new Array();    
        var gridTwo = basetab.down('panel[xtype=smartcontrol.roombagrule.dormallotfinishgridtwo]');
        var gridTwoStore=gridTwo.getStore();
        for(var i=0;i<gridTwoStore.getCount();i++){
            deductionUserIds.push(gridTwoStore.getAt(i).get('uuid'));
            deductionRoomIds.push(gridTwoStore.getAt(i).get('roomId'));
        }

      
        
        var loading = new Ext.LoadMask(basetab, {
            msg: '正在提交，请稍等...',
            removeMask: true// 完成后移除
        });
        loading.show();

        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/doAdd",
            params: {
                roomIds: roomIds.join(","),
                roomRuleId: roomRuleId,
                deductionUserIds: deductionUserIds.join(","),
                deductionRoomIds: deductionRoomIds.join(",")
            },
            //回调代码必须写在里面
            success: function (response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if (data.success) {

            
                    loading.hide();

                    self.msgbox("保存成功!");        

                    var grid = basetab.funData.grid; //此tab是否保存有grid参数
                    if (!Ext.isEmpty(grid)) {
                        var store = grid.getStore();                           
                        store.load(); //刷新父窗体的grid
                    }

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

    },

    doSelectUserData:function(btn){

        var self=this;
        var win = btn.up('window');
        var winFunData = win.funData;
        var upGrid = winFunData.grid;
        var roomInfos= winFunData.roomInfos;

        var basePanel = win.down("panel[xtype=pubselect.selectuserlayout]");
        var baseGrid = basePanel.down("basegrid[xtype=pubselect.selectusergrid]");
        var rescords = baseGrid.getSelectionModel().getSelection();
        if (rescords.length != 1) {
            self.Warning("只能选择一个指定人员");
            return false;
        }

        var data = {
            userNumb: rescords[0].get('userNumb'),
            xm: rescords[0].get('xm'),
            uuid:rescords[0].get('uuid')
        };

        for(var i=0;i<roomInfos.length;i++){
            Ext.apply(roomInfos[i],data);
        }

        upGrid.getStore().loadData(roomInfos); //加入到新的grid 

        win.close();
    },

    doLoadInfo:function(cmp){
        var self=this;
        if(cmp.operType=='detail'){
            var recordData=cmp.insertObj;
            var shutDownStart = Ext.util.Format.date(recordData.shutDownStart, 'H:i:s');
            var shutDownEnd = Ext.util.Format.date(recordData.shutDownEnd, 'H:i:s');
            recordData.shutDownStart=shutDownStart;
            recordData.shutDownEnd=shutDownEnd;

            //转换数据字典
            var ddCodes=['WYEKZFS','KFMS'];
            var propNames=['noMoneyMode','deDuctionMode'];
            for(var i=0;i<ddCodes.length;i++){                
                var ddItem = factory.DDCache.getItemByDDCode(ddCodes[i]);
                var resultVal="";
                var value=recordData[propNames[i]];
                for (var j = 0; j < ddItem.length; j++) {
                    var ddObj = ddItem[j];
                    if (value == ddObj["itemCode"]) {
                        resultVal = ddObj["itemName"];
                        break;
                    }
                }         
                recordData[propNames[i]]=resultVal;
            }


            var ruleInfoContainer = cmp.down("container[ref=ruleInfo]");
            ruleInfoContainer.setData(recordData);

            self.asyncAjax({
                url: comm.get("baseUrl") + "/BasePtRoomBagsRuleBind/assignUserList",
                params: {
                    page: 1,
                    start: 0,
                    limit: 0,
                    filter: "[{'type':'string','comparison':'=','value':'" + recordData.uuid + "','field':'roomRuleId'}]",
                },
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                    var ruleBindRoomsContainer = cmp.down("container[ref=ruleBindRooms]");
                    ruleBindRoomsContainer.setData(data);
                }
            });
        }

        /* 
        var roleInfoContainer = tabItem.down("container[ref=roleInfo]");
        roleInfoContainer.setData(insertObj);

        self.asyncAjax({
            url: comm.get("baseUrl") + "/SysRole/roleUserList",
            params: {
                page: 1,
                start: 0,
                limit: 0,
                roleId: insertObj.uuid
            },
            success: function (response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                var roleUserContainer = tabItem.down("container[ref=roleUser]");
                roleUserContainer.setData(data);
            }
        });


            var uploadPanel = cmp.down("panel[xtype=uploadpanel]");       
            //1. 加载文件数据
            self.asyncAjax({
                url: comm.get('baseUrl') + "/BaseAttachment/getFileList",
                params: {
                    recordId: cmp.insertObj.uuid                   
                },
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    uploadPanel.getStore().loadData(data);                        
                },
                failure: function(response) {
                    Ext.Msg.alert('读取文件数据失败！', '错误信息：\n' + response.responseText);                           
                }
            });

       
            var fileView=cmp.down("dataview[ref=fileView]");
            fileView.getStore().load({
                params: {
                    recordId: cmp.insertObj.uuid
                }
            });*/
        
    }
});