/**
    ( *非必须，只要需要使用时，才创建他 )
    此视图控制器，用于注册window之类的组件的事件，该类组件不属于 mainLayout和detailLayout范围内。
    但需要在创建window中，使用controller属性来指定此视图控制器，才可生效
*/
Ext.define("core.system.role.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.system.role.othercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
    },
    /** 该视图内的组件事件注册 */
    control: {
      /**
         * 角色用户列表增加按钮事件
         */
        "basegrid[xtype=system.role.roleusergrid] button[ref=gridAddUser]": {
            beforeclick: function (btn) {
                var self = this;
                //得到组件
                var baseGrid = btn.up("basegrid");
                var funCode = baseGrid.funCode;
                var basePanel = baseGrid.up("basepanel[funCode=" +funCode + "]");
                var basetab = btn.up('baseformtab');
                var tabFunData = basetab.funData;
                //得到配置信息
                var funData = basePanel.funData;
                var detCode = "selectuser_detail"; //这个值换为其他，防止多个window误入other控制器中的同一个事件
                var detLayout = "system.role.selectuserlayout";
                var defaultObj = funData.defaultObj;
                //关键：window的视图控制器
                var otherController = basePanel.otherController;
                if (!otherController)
                    otherController = '';
                //处理特殊默认值
                var insertObj = self.getDefaultValue(defaultObj);
                //填入选择的班级的值
                insertObj = Ext.apply(insertObj, {
                    roleId: tabFunData.roleId,
                    roleName: tabFunData.roleName

                });
                var popFunData = Ext.apply(funData, {
                    grid: baseGrid,
                    roleId: tabFunData.roleId,
                    roleName: tabFunData.roleName
                });
                var width = 1200;
                var height = 600;
                var win = Ext.create('core.base.view.BaseFormWin', {
                    iconCls: 'x-fa fa-plus-circle',
                    operType: 'add',
                    width: width,
                    height: height,
                    controller: otherController, //指定视图控制器，从而能够使指定的控制器的事件生效
                    funData: popFunData,
                    funCode: detCode,
                    insertObj: insertObj,
                    items: [{
                        xtype: detLayout,
                        funCode: detCode //这里将funcode修改为刚刚的detcode值
                    }]
                });
                win.show();
                var selectGrid = win.down("basegrid[xtype=system.role.selectusergrid]");
                var selectStore = selectGrid.getStore();
                var selectProxy = selectStore.getProxy();
                selectProxy.extraParams = {
                    roleId:tabFunData.roleId
                };
                selectStore.loadPage(1);
                return false;
            }
        },
        /**
         * 角色用户列表删除按钮事件
         */
        "basegrid[xtype=system.role.roleusergrid] button[ref=gridDelUser]": {
            beforeclick: function (btn) {
                var self = this;
                self.doDeleteUerClick(btn);
                return false;
            }
        },

        /**
         * 角色用户选择保存按钮事件
         */
        "baseformwin[funCode=selectuser_detail] button[ref=formSave]": {
            beforeclick: function (btn) {
                var self = this;
                var win = btn.up('window');
                var funCode = win.funCode;
                var winFunData = win.funData;
                var roleId = winFunData.roleId;
                var baseGrid = winFunData.grid;
                var basePanel = win.down("basepanel[funCode=" + funCode + "]");
                var isSelectGrid = basePanel.down("grid[xtype=system.role.isselectusergrid]");
                var isSelectStore = isSelectGrid.getStore();
                var storeCount = isSelectStore.getCount();
                if (storeCount == 0) {
                    self.Warning("没有要设置的用户，请重新选择");
                    return false;
                }
                var userIds = new Array();
                for (var i = 0; i < storeCount; i++) {
                    userIds.push(isSelectStore.getAt(i).get("uuid"));
                }
                var title = "确定设置这些用户吗？";
                Ext.Msg.confirm('提示', title, function (btnOper, text) {
                    if (btnOper == 'yes') {
                        //发送ajax请求
                        var resObj = self.ajax({
                            url: funData.action + "/doAddRoleUser",
                            params: {
                                ids: roleId,
                                userId: userIds.join(",")
                            }
                        });
                        if (resObj.success) {
                            var store = baseGrid.getStore();
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

        /**
         * 角色用户选择列表 快速搜索文本框回车事件
         */
        "basepanel basegrid[xtype=system.role.selectusergrid] field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {
                var self = this;
                if (e.getKey() == e.ENTER) {
                    self.doFastSearch(field);
                    console.log(field);
                    return false;
                }
            }
        },
        /**
         * 角色用户选择列表 快速搜索按钮事件
         */
        "basepanel basegrid[xtype=system.role.selectusergrid] button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
                var self = this;
                self.doFastSearch(btn);
                return false;
            }
        }
    },

    /**
     * 执行快速搜索
     * @param component
     * @returns {boolean}
     */
    doFastSearch: function (component) {
        //得到组件
        var baseGrid = component.up("basegrid");
        if (!baseGrid)
            return false;

        var toolBar = component.up("toolbar");
        if (!toolBar)
            return false;

        var win = baseGrid.up("window");
        var winFunData = win.funData;
        var roleId = winFunData.roleId;

        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        //这里快速搜索就姓名与部门，固定写死查询的条件
        var filter = new Array();
        if (girdSearchTexts[0].getValue() != "")
            filter.push("{'type': 'string', 'comparison': '', 'value':'" + girdSearchTexts[0].getValue() + "', 'field': 'xm'}");
        if (girdSearchTexts[1].getValue() != "")
            filter.push("{'type': 'string', 'comparison': '=', 'value':'" + girdSearchTexts[1].getValue() + "', 'field': 'deptId'}");
        filter = "[" + filter.join(",") + "]";

        var selectStore = baseGrid.getStore();
        var selectProxy = selectStore.getProxy();
        selectProxy.extraParams = {
            roleId: roleId,
            filter: filter
        };
        selectStore.loadPage(1);
    },
    /**
     * 删除角色用户
     * @param btn
     * @param cmd
     * @param grid
     * @param record
     */
    doDeleteUerClick: function (btn, cmd, grid, record) {
        var self = this;
        var baseGrid;
        var ids = new Array();
        var funCode;
        var basePanel;
        var funData;
        var pkName;
        var title = "确定要删除所选的用户吗？";

        if (btn) {
            baseGrid = btn.up("basegrid");
            funCode = baseGrid.funCode;
            basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
            funData = basePanel.funData;
            pkName = funData.pkName;
            var records = baseGrid.getSelectionModel().getSelection();
            Ext.each(records, function (rec) {
                var pkValue = rec.get(pkName);
                ids.push(pkValue);
            });
            if (ids.length == 0) {
                self.Error("没有选择要删除的角色用户！");
                return false;
            }
        } else {
            baseGrid = grid;
            funCode = baseGrid.funCode;
            basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
            funData = basePanel.funData;
            pkName = funData.pkName;
            ids.push(record.get(pkName));
        }
        var basetab = btn.up('baseformtab');
        var tabFunData = basetab.funData;

        Ext.Msg.confirm('警告', title, function (btnOper, text) {
            if (btnOper == 'yes') {
                //发送ajax请求
                var resObj = self.ajax({
                    url: funData.action + "/doDeleteRoleUser",
                    params: {
                        ids: tabFunData.roleId,
                        userId: ids.join(",")
                    }
                });
                if (resObj.success) {
                    var store = baseGrid.getStore();
                    store.load();
                    self.msgbox(resObj.obj);
                } else {
                    self.Error(resObj.obj);
                }
            }
        });
    }

});