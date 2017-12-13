Ext.define("core.main.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.main.otherController',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",    
    },
    init: function () {
    },
    /** 该视图内的组件事件注册 */
    control: {

    },
    //设置常用功能
    setDeskFuncBtn:function(btn){
        var self=this;
        var win=btn.up("window[xtype=main.deskfunction]");
        var dataview=win.down("dataview");

        var recordes=dataview.getSelectionModel().getSelection();
        if(recordes.length>0){

            var loading = new Ext.LoadMask(win, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            var ids=[];
            for(var i=0;i<recordes.length;i++){   
                ids.push(recordes[i].get("menuCode"));                                        
            }           

            self.asyncAjax({
                url: comm.get('baseUrl') + "/SysUser/setUserDeskFunc",
                params: {
                    menuCodes: ids.join(","),
                },                       
                success: function(response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if(data.success){
                        for(var i=0;i<recordes.length;i++){   
                            recordes[i].set("isDeskFunc",1);               
                            recordes[i].commit();                         
                        }  
                    
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
                 
            //basepanel.down("panel[xtype=goodimages.showimagesgrid] dataview").getStore().loadPage(1);

        }else{
            self.msgbox("请选择需要设置的功能菜单！"); 
        }
    },
    //取消常用功能
    cancelDeskFuncBtn:function(btn){
        var self=this;
        var win=btn.up("window[xtype=main.deskfunction]");
        var dataview=win.down("dataview");

        var recordes=dataview.getSelectionModel().getSelection();
        if(recordes.length>0){

            var loading = new Ext.LoadMask(win, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            var ids=[];
            for(var i=0;i<recordes.length;i++){   
                ids.push(recordes[i].get("menuCode"));                                        
            }          

            self.asyncAjax({
                url: comm.get('baseUrl') + "/SysUser/cancelUserDeskFunc",
                params: {
                    menuCodes: ids.join(","),
                },                       
                success: function(response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if(data.success){
                        for(var i=0;i<recordes.length;i++){   
                            recordes[i].set("isDeskFunc",0);               
                            recordes[i].commit();                         
                        }                       
                    
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
                 
            //basepanel.down("panel[xtype=goodimages.showimagesgrid] dataview").getStore().loadPage(1);

        }else{
            self.msgbox("请选择需要设置的功能菜单！"); 
        }
    },
});