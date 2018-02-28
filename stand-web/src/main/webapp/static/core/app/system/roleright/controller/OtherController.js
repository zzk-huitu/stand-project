/**
    此视图控制器，用于注册window之类的组件的事件，该类组件不属于 mainLayout和detailLayout范围内。
    但需要在创建window中，使用controller属性来指定此视图控制器，才可生效
*/
Ext.define("core.system.roleright.controller.OtherController", {
    extend: "Ext.app.ViewController",

    alias: 'controller.system.roleright.othercontroller',
    
    /*把不需要使用的组件，移除掉*/
    mixins: {
        messageUtil: "core.util.MessageUtil",
        suppleUtil: "core.util.SuppleUtil",
        /*
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        */
    },
   
    init: function() {
        /*执行一些初始化的代码*/
        //console.log("初始化 other controler");           
    },

    /*该视图内的组件事件注册*/
    control:{    
        "panel[xtype=system.roleright.selectmenugrid]": {
            checkchange: function(node, checked, options) {                   
                // node.expand(true);
                node.expand();  //只展开第一层
              
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
        },

        /**
         * 授权菜单选择弹出窗体的确定授权按钮事件
         * @type {[type]}
         */
        "baseformwin[funCode=roleright_selectmenu] button[ref=formSave]": {
            beforeclick: function(btn) {
                this.saveMenuRight(btn);            
                return false;
            }
        },
        
        "baseformwin[funCode=selectpms_detail] button[ref=formSave]": {
            beforeclick: function(btn) {
                this.saveRoleMenuPer(btn);
                return false;
            }
        },

    },

    saveMenuRight:function(btn){
        var self=this;
        var win = btn.up("window");
        var selectMenuLayout = win.down("panel[xtype=system.roleright.detaillayout]");
        var selectMenuGrid = selectMenuLayout.down("panel[xtype=system.roleright.selectmenugrid]");
        //var records = selectMenuGrid.getSelectionModel().getSelection();
        var records =  selectMenuGrid.getView().getChecked();
        if (records.length == 0) {
            self.msgbox("请选择要授权的菜单!");
            return false;
        }
        var record = "";
        var MenuRecords = new Array();
        var FuncRecords = new Array();
        for (var i=0;i<records.length;i++){
            record = records[i];
            if(record.get('menuType')=="MENU"){ //菜单
                MenuRecords.push(record);

            }else{// 功能 FUNC
                FuncRecords.push(record);
            }
        };
        var FuncId="";
        for(var j =0;j<FuncRecords.length;j++){
            FuncId = FuncRecords[j].get('parent');
            for(var m=0;m<MenuRecords.length;m++){
                if(MenuRecords[m].get('id')==FuncId){
                    FuncRecords.splice(j--,1);
                    break;
                }
            }
        };

        if(FuncRecords.length>0){
            var tabPanel = Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
            var tabItem = tabPanel.getActiveTab();
            var rolgerightgrid = tabItem.down("basetreegrid[xtype=system.roleright.rolgerightgrid]");
            var MeunStore = rolgerightgrid.getStore();
            var MeunCount = MeunStore.getCount();
            if(MeunCount>0){
                for(var j =0;j<FuncRecords.length;j++){
                    FuncId = FuncRecords[j].get('parent');
                    for(var m=0;m<MeunCount;m++){
                        if(MeunStore.getAt(m).get('id')==FuncId){
                            FuncRecords.splice(j--,1);
                            break;
                        }
                    }
                }
            }else{
              self.msgbox("请为未授权菜单的功能选择要授权的功能的菜单!");
              return false;
            }

        }
        if(FuncRecords.length>0){
            // self.msgbox("请选择要授权的功能的菜单!");
            self.msgbox("请为未授权菜单的功能选择要授权的功能的菜单!");
            return false;
        }

        var funData = win.funData;
        var roleId = funData.roleId;
        // records = selectMenuGrid.getView().getChecked();
        var ids = new Array();
        Ext.each(records, function(rec) {
            var pkValue = rec.get("id");
            ids.push(pkValue);
        }, this);

        var title = "确定要对这些菜单进行授权吗？";
        Ext.Msg.confirm('提示', title, function(btn, text) {
            if (btn == 'yes') {

                //显示loadMask
                var myMask = self.LoadMask(win);
                //提交入库
                self.asyncAjax({
                    url: comm.get('baseUrl') + "/SysRole/doAddRight",
                    params: {
                        ids: ids.join(","),
                        roleId: roleId
                    },
                    //loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                         myMask.hide();

                        if (data.success) { 
                            var baseGrid = funData.grid;
                            var store = baseGrid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams = {
                                roleId: roleId
                            };
                            store.load();
                            self.msgbox(data.obj);
                            win.close();

                        }else{
                            self.Error(data.obj);   
                        }                            
                    },
                    failure: function(response) {           
                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                        myMask.hide();
                    }
                });    
            }
        });
    },

    saveRoleMenuPer:function(btn){
        var self=this;
        var win = btn.up("window");
        var selectMenuLayout = win.down("basepanel[xtype=system.roleright.selectpmslayout]");
        var selectedPermissionGrid = selectMenuLayout.down("panel[xtype=system.roleright.selectedpermissiongrid]");                        
        var funData = win.funData;
        var perId = funData.perId;
        var roleId = funData.roleId;
        var ids = new Array();
        
        var store=selectedPermissionGrid.getStore();
        for(var i=0;i<store.getCount();i++){
            var rec=store.getAt(i);
            var pkValue = rec.get("uuid");
            if(ids.indexOf(pkValue)==-1)
                ids.push(pkValue);              
        }                

        var title = "确定要设置此菜单的功能权限吗？";
        if(ids.length==0)
            title="确定要取消此菜单的功能权限吗？";
        
        Ext.Msg.confirm('提示', title, function(btn, text) {
            if (btn == 'yes') {
                                       
                //显示loadMask
                var myMask = self.LoadMask(win);
                //提交入库
                self.asyncAjax({
                    url: comm.get('baseUrl') + "/SysRole/doSetRoleMenuPermission",
                    params: {
                        ids: ids.join(","),
                        roleId: roleId,
                        perId: perId
                    },
                    //loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                         myMask.hide();

                        if (data.success) { 
                /*          var baseGrid = funData.grid;
                            var store = baseGrid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams = {
                                roleId: roleId
                            };
                            store.load();*/

                            var baseGrid = funData.grid;
                            baseGrid.getStore().load();
                            
                            self.msgbox(data.obj);
                            win.close();

                        }else{
                            self.Error(data.obj);   
                        }                            
                    },
                    failure: function(response) {           
                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                        myMask.hide();
                    }
                });  
            }
        });
    }

});