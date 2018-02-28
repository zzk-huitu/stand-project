
Ext.define("core.system.user.controller.DetailController", {
  	extend: "Ext.app.ViewController",
    alias: 'controller.system.user.detailcontroller',
    mixins: {
    	messageUtil: "core.util.MessageUtil",
        suppleUtil: "core.util.SuppleUtil", 
        /*formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil',*/
        queryUtil: "core.util.QueryUtil"
    },
    init: function() {
        
    },
    control: {
    	"baseform[xtype=system.user.userrightdeptform] radiogroup[ref=rightDeptRadio]":{
    		change:function( filed, newValue, oldValue, eOpts ){
                //当radio值改变时，去处理相应的数据
                this.deptRadioChange(filed,newValue,oldValue);    		
    			/*
                var formBase=form.getForm();
                var termField = formBase.findField("termNames");
                */
            }
    	},

        "panel[xtype=system.user.userdeptrightgrid] button[ref=gridAdd]": {
            beforeclick: function(btn) {
                //打开用户部门权限的界面
                this.openUserDeptRightWin(btn);
                return false;
            }
        },


        "panel[xtype=system.user.userdeptrightgrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.doDeleteUserDeptRight(btn);            
                return false;
            }
        },

        "baseform[xtype=system.user.userform]": {
            afterrender: function(form) {
                var baseformtab=form.up("baseformtab");
                //如果存在uuid，则为编辑界面，再将身份文本框设置为只读
                if(baseformtab.insertObj.uuid){ 
                    form.getForm().findField("category").setReadOnly(true);
                }

                //return false;
            }
        }
       
    },

    deptRadioChange:function(filed,newValue,oldValue){
        var form=filed.up("form");
        var detailLayout=filed.up("basepanel[xtype=system.user.userlayout]");
        var grid=detailLayout.down("basegrid[xtype=system.user.userdeptrightgrid]");
        
        if(newValue.deptRadio==1){                                    
            grid.show();  
            grid.getStore().loadPage(1);                                 
        }else {
            grid.hide();                                              
        }
    },

    openUserDeptRightWin:function(btn){
        var self=this;
        var userDeptRightGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
       
        var detailLayout=basetab.down("basepanel[xtype=system.user.userlayout]");

        var funData = detailLayout.funData;
        var insertObj = basetab.insertObj;
        
       
        var userId = insertObj.uuid;
        var title = "指定部门";

        var funcPanel = 'user.userdeptright'; //仅仅是用于为编写确定按钮事件提供一个判断的标识

        var configInfo = {
            rootId: "ROOT",
            model: "com.zd.school.plartform.baseset.model.BaseOrgChkTree",      
            multiSelect: true,
            whereSql: "",
            orderSql: " ",
            excludes: "",
            url: comm.get('baseUrl') + "/SysOrg/getUserRightDeptTree",
        };

        self.selTreeWin({
            controller:'system.user.othercontroller',
            model: configInfo.model,
            title: title,
            funcPanel: funcPanel, //为了方便在控制器中捕获此窗口的确定事件
            multiSelect: configInfo.multiSelect,
            selModel:null,
            haveButton: true,
            isEmpty: true,
            setIds: userId,
            funData: funData,
            grid: userDeptRightGrid,
            config: {
                url: configInfo.url,
                expandFirst: true,
                params: {
                    node: configInfo.rootId,
                    ddCode: configInfo.ddCode,
                    whereSql: configInfo.whereSql,
                    orderSql: configInfo.orderSql,
                    excludes: configInfo.excludes,                        
                }
            }
        });
    },

    doDeleteUserDeptRight:function(btn){
        var self=this;
        
        var userDeptRightGrid = btn.up("basegrid");
        var basetab = btn.up('baseformtab');
       
        var detailLayout=basetab.down("basepanel[xtype=system.user.userlayout]");

        var funData = detailLayout.funData;
        var insertObj = basetab.insertObj;
        var userId = insertObj.uuid;

        var records = userDeptRightGrid.getSelectionModel().getSelection();
        if (records.length < 1) {
            self.msgbox("请选择要解除的部门权限");
            return false;
        }
        var delRights = new Array();         
        Ext.each(records, function(rec) {
            delRights.push(rec.get("uuid"));
        }, this);

        var title = "确定解除这些部门权限吗？";
      
        Ext.Msg.confirm('解除确认', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                self.asyncAjax({
                    url: comm.get("baseUrl") + "/SysDeptright/doDelete",
                    params: {
                        ids: delRights.join(","),
                    },
                    loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        Ext.Msg.hide(); //关闭loadMask

                        if (data.success) {
                            var deptRightStore = userDeptRightGrid.getStore();                                  
                            deptRightStore.load();
                            self.msgbox(data.obj);
                        } else
                            self.Warning(data.obj);
                    }
                });           
            }
        });
    }
});