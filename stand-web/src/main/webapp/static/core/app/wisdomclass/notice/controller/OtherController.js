/**
    ( *非必须，只要需要使用时，才创建他 )
    此视图控制器，用于注册window之类的组件的事件，该类组件不属于 mainLayout和detailLayout范围内。
    但需要在创建window中，使用controller属性来指定此视图控制器，才可生效
*/
Ext.define("core.wisdomclass.notice.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.notice.othercontroller',
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
        "baseformtab[detCode=notice_detail] button[ref=formSave]":{
            beforeclick: function(btn) {
                this.doSave_Tab(btn, "save");
                return false;
            }
        },
        "window[title=教职工选择]":{
            afterrender: function(win) {            
                //回显已经选择的数据
                var grid=win.down("grid[xtype=pubselect.isselectusergrid]");
                this.loadSelectedInfo(win,grid,"userIds","userNames","uuid","xm");
                return false;
            }
        },
        "window[title=学生选择]":{
            afterrender: function(win) {            
                //回显已经选择的数据
                var grid=win.down("grid[xtype=pubselect.isselectusergrid]");
                this.loadSelectedInfo(win,grid,"stuIds","stuNames","uuid","xm");
                return false;
            }
        },
        "window[title=角色选择]":{
            afterrender: function(win) {            
                //回显已经选择的数据
                var grid=win.down("grid[xtype=pbselectRole.isselectrolegrid]");
                this.loadSelectedInfo(win,grid,"roleIds","roleNames","uuid","roleName");
                return false;
            }
        },
        "window[title=选择终端] mttreeview":{
            afterrender: function(tree) {      
                this.loadCheckedTree(tree,"termIds","treeid");
                return false;
            }
        },
        "window[title=选择部门] mttreeview":{
            afterrender: function(tree) {      
                this.loadCheckedTree(tree,"deptIds","id");
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
           
            //文本编辑器进行手动验证（因为使用isValid不太稳定，经常出错：zzk）
            if(params.noticeContent==null || params.noticeContent.trim()==""){
                self.msgbox("<font color=red>公告正文</font>:不能为空！");
                return false;
            }

            //把checkbox的值转换为数字 ；    暂时测试时设置，
            params.deptRadio=objForm.down("radiogroup[ref=deptRadio]").getChecked()[0].inputValue;
            params.stuRadio=objForm.down("radiogroup[ref=stuRadio]").getChecked()[0].inputValue;
            params.terminalRadio=objForm.down("radiogroup[ref=terminalRadio]").getChecked()[0].inputValue;

            //当为指定具体数据的时候，才传入数据
            if(params.deptRadio!=2)
                params.deptIds=null;
            
            if(params.stuRadio!=2)
                params.stuIds=null;
               
            if(params.terminalRadio!=2){
                params.termIds=null;    //入库（在编辑时直接显示此值）
                params.termNames=null;  //入库（在编辑时直接显示此值）
            }

            if(params.isNoticeParent==false)
                params.isNoticeParent=null;

            //不需要上传
            params.deptNames=null;
            params.stuNames=null;

            if (Ext.isEmpty(params.deptIds) && Ext.isEmpty(params.roleIds) 
                && Ext.isEmpty(params.userIds) && Ext.isEmpty(params.stuIds)
                &&params.deptRadio!=1&&params.stuRadio!=1) {
                self.Warning("通知部门、角色、教职工、学生至少要设置一项数据");
                return false;
            }

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

                        //执行上传文件
                        var uploadpanel = detPanel.down("panel[xtype=uploadpanel]");
                        var url = funData.action + "/doUpload";
                        var params = {
                            recordId: data.obj.uuid
                        };
                        uploadpanel.onUpload(url, params);

                        //判断是否上传完毕
                        var uploadFileInterval=setInterval(function(){                            
                            if(uploadpanel.file_is_uploadSuccess()==true){
                                clearInterval(uploadFileInterval);

                                loading.hide();

                                self.msgbox("保存成功!");        

                                var grid = basetab.funData.grid; //此tab是否保存有grid参数
                                if (!Ext.isEmpty(grid)) {
                                    var store = grid.getStore();                           
                                    store.load(); //刷新父窗体的grid
                                }

                                tabPanel.remove(tabItem);
                                                
                            }
                        },200);


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

    loadSelectedInfo:function(win,grid,idField,nameField,uuid,name){
        var tabPanel=Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
        var tabItem=tabPanel.getActiveTab();
        var formPanel=tabItem.down('form[xtype='+win.formPanel+']');

        var objForm=formPanel.getForm();
        var userIds=objForm.findField(idField).getValue();
        var userNames=objForm.findField(nameField).getValue();
      
         
        if(userIds.trim().length>0){
            
            var store=grid.getStore();

            var userIdArr=userIds.split(',');
            var userNameArr=userNames.split(',');

            var datas=[];
            var obj=null;
            for(var i=0;i<userIdArr.length;i++){
                obj={};
                //store.add({uuid: userIdArr[i], xm:userNameArr[i]});
                obj[uuid]= userIdArr[i];
                obj[name]= userNameArr[i];
                
                datas.push(obj);

            }      
            store.insert(0,datas);        
        }
    },

    loadCheckedTree:function(tree,idField,uuid){
        var win=tree.up("window");    

        var tabPanel=Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
        var tabItem=tabPanel.getActiveTab();

        var formPanel=tabItem.down('form[xtype='+win.formPanel+']');
        var objForm=formPanel.getForm();

        var termIds=objForm.findField(idField).getValue();

        //回显已经选择的数据
        tree.getStore().setListeners({
            load:function(store , records , successful , operation , node , eOpts){

                var rootNode=tree.getRootNode();
                
                rootNode.childNodes[0].expand();   //展开第一层

                function setNodeChecked(cNo){  //遍历节点根据panelID查找相应的节点设置draggalbe为true
                    var childnodes = cNo.childNodes;//获取根节点的子节点
                    for(var i=0; i < childnodes.length; i++){
                        var cNode = childnodes[i];
                        
                        if(termIds.indexOf(cNode.get(uuid))!=-1)
                            cNode.set('checked',true);

                        if(cNode.hasChildNodes()){                                
                            setNodeChecked(cNode);//递归调用
                        }                    
                    }
                }
                setNodeChecked(rootNode);//调用函数*/

            }
        });
    } 
});