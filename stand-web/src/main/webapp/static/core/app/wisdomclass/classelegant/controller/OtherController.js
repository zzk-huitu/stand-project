Ext.define("core.wisdomclass.classelegant.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classelegant.othercontroller',
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
    	"baseformtab[detCode=classelegant_detail] button[ref=formSave]":{
            beforeclick: function(btn) {
                this.doSave_Tab(btn, "save");
                return false;
            }
        },

        /*在打开视图显示之后的需要进行处理的数据*/
        "baseformtab[detCode=classelegant_detail]":{
            afterrender: function(cmp) {
            	this.doLoadFiles(cmp);
            	
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
           
            var uploadpanel = detPanel.down("panel[xtype=uploadpanel]");
            var items=uploadpanel.store.data.items;
            for (var i = 0; i < items.length; i++) {
                var temp=items[i];
                var type=temp.data.type.toUpperCase();
                if (type!='.JPG'&&type!='.JPEG'&&type!='.BMP'&&type!='.PNG'&&type!='.AVI'&&type!='.MP4'&&type!='.3GP') {
                    self.msgbox("系统只支持JPG、JPEG、BMP、PNG、AVI、MP4、3GP格式的文件!");
                    return false;
                }
            };


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

    doLoadFiles:function(cmp){
    	var self=this;
        if(cmp.operType=="edit"){
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

        }else if(cmp.operType =="detail"){
            var fileView=cmp.down("dataview[ref=fileView]");
            fileView.getStore().load({
                params: {
                    recordId: cmp.insertObj.uuid
                }
            });
        }	
    }
});