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
                var self=this;
                
                var win = btn.up("window");
                var selectMenuLayout = win.down("panel[xtype=system.roleright.detaillayout]");
                var selectMenuGrid = selectMenuLayout.down("panel[xtype=system.roleright.selectmenugrid]");
                var records = selectMenuGrid.getSelectionModel().getSelection();
                if (records.length == 0) {
                    self.Error("请选择要授权的菜单!");
                    return false;
                }
                var funData = win.funData;
                var roleId = funData.roleId;
                records = selectMenuGrid.getView().getChecked();
                var ids = new Array();
                Ext.each(records, function(rec) {
                    var pkValue = rec.get("id");
                    ids.push(pkValue);
                }, this);

                var title = "确定要对这些菜单进行授权吗？";
                Ext.Msg.confirm('提示', title, function(btn, text) {
                    if (btn == 'yes') {
                        //发送ajax请求
                        var resObj = self.ajax({
                            url: comm.get('baseUrl') + "/SysRole/addRight",
                            params: {
                                ids: ids.join(","),
                                roleId: roleId
                            }
                        });
                        if (resObj.success) {
                            var baseGrid = funData.grid;
                            var store = baseGrid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams = {
                                roleId: roleId
                            };
                            store.load();
                            self.msgbox(resObj.obj);
                            win.close();
                        } else {
                            self.Error(resObj.obj);
                        }
                    }
                });
                return false;
            }
        },
        
        "baseformwin[funCode=selectpms_detail] button[ref=formSave]": {
            beforeclick: function(btn) {
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
                        //发送ajax请求
                        var resObj = self.ajax({
                            url: comm.get('baseUrl') + "/SysRole/setRoleMenuPermission",
                            params: {
                                ids: ids.join(","),
                                roleId: roleId,
                                perId: perId
                            }
                        });
                        if (resObj.success) {
                            var baseGrid = funData.grid;
                            var store = baseGrid.getStore();
                            var proxy = store.getProxy();
                            proxy.extraParams = {
                                roleId: roleId
                            };
                            store.load();
                            self.msgbox(resObj.obj);
                            win.close();
                        } else {
                            self.Error(resObj.obj);
                        }
                    }
                });
                return false;
            }
        },

        /*
        "baseformwin button[ref=formContinue]": {
            beforeclick:function(btn){
                console.log(btn);
            }
        },
        
        "baseformwin button[ref=formSave]": {
            beforeclick: function(btn) {
                console.log(btn);
            }
        },


        "baseformwin button[ref=formClose]": {
            beforeclick: function(btn) {
                console.log(btn);
            }
        },
        */

    }

});