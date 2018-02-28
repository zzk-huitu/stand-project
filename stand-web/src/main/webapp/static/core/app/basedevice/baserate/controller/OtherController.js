/**
    ( *非必须，只要需要使用时，才创建他 )
    此视图控制器，用于注册window之类的组件的事件，该类组件不属于 mainLayout和detailLayout范围内。
    但需要在创建window中，使用controller属性来指定此视图控制器，才可生效
*/
Ext.define("core.basedevice.baserate.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.baserate.othercontroller',
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
    	   "basetreegrid[xtype=basedevice.baserate.roominfotree] button[ref=gridRefresh]": {
                click: function(btn) {
                    console.log(88);
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore();
                    store.load(); //刷新父窗体的grid
                    return false;
                }
            },
    	//编辑界面保存按钮
    	"baseformtab[detCode=baserate_detail] button[ref=formSave]": {
			beforeclick: function (btn) {    
				this.doSave_Tab(btn);
				return false;
			}
		},
		
		//费率绑定界面确认按钮
		"baseformwin[detCode=rateBinding_detail] button[ref=formSave]": {
            beforeclick: function(btn) {
                this.saverate(btn);
                return false;
             },
    	 },
            //费率设备删除
        "basegrid[xtype=basedevice.baserate.pricebinggrid] button[ref=gridDelete]": {
            beforeclick: function(btn) {
                this.deletePriceBingTerm(btn);
                return false;
             },
         },
    },
    
    /*
     * 编辑界面保存事件
     */
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
        var params = self.getFormValue(formObj);
        
        //获取水控还是电控
        var categroy = params.categroy;

        //判断当前是保存还是修改操作
        var act = Ext.isEmpty(pkField.getValue()) ? "doAdd" : "doUpdate";
        if (formObj.isValid()) {
            var loading = new Ext.LoadMask(basetab, {
                msg: '正在提交，请稍等...',
                removeMask: true// 完成后移除
            });
            loading.show();

            self.asyncAjax({
                url: funData.action + "/" + act,
                params: params,
                categroy:categroy,
                //回调代码必须写在里面
                success: function (response) {
                    data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {
                        self.msgbox("保存成功!");

                        var grid = basetab.funData.grid; //此tab是否保存有grid参数
                        if (!Ext.isEmpty(grid)) {
                            var store = grid.getStore();                           
                            store.load(); //刷新父窗体的grid
                        }

                        loading.hide();
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
  
    
    /*
     * 费率绑定界面确认事件
     */
    saverate:function(btn){
    	var self=this;
        var win = btn.up('window');
        var detCode = win.detCode;
        //找到详细布局视图
        var basepanel = win.down("basepanel[detCode=" + detCode + "]");
        var termId = [];
        var termSn=[];
        var isselectgrid = basepanel.down('panel[xtype=basedevice.baserate.skdatagridtwo]');
        var getCount = isselectgrid.getStore().getCount();
        if (getCount <= 0) {
            self.msgbox("有数据才能继续操作!");
            return;
        }

        var isSelectStore = isselectgrid.getStore();
        for (var i = 0; i < getCount; i++) {
             var record = isSelectStore.getAt(i);
             termId.push(record.get('uuid'));
             termSn.push(record.get('termSN'))
        };
        self.asyncAjax({
            url: comm.get('baseUrl') + "/BasePtPriceBind/doAdd",
            params: {
                termId: termId,
                termSn:termSn,
                meterId:win.meterId
            },
            //回调代码必须写在里面
            success: function (response) {
                data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                if (data.success) {
                       self.msgbox("保存成功!");
                       win.close();
                    } else {
                        self.Error(data.obj);
                         win.close();
                    }
                },
                failure: function(response) {
                    Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                }
            });
 },

    deletePriceBingTerm:function(btn){
        var self=this;

        var baseGrid = btn.up("basegrid");
        //选择的设备
        var selectTerm= baseGrid.getSelectionModel().getSelection();
        if (selectTerm.length == 0) {
            self.msgbox("没有选择要删除的设备，请选择!");
            return false;
        }
       
        //拼装所选择的设备
        var termIds = new Array();
        Ext.each(selectTerm, function(rec) {
            var pkValue = rec.get("uuid");
            termIds.push(pkValue);
        });
        var title = "确定删除绑定该费率的设备吗？";
        Ext.Msg.confirm('警告', title, function(btn, text) {
            if (btn == 'yes') {
                //发送ajax请求
                var resObj = self.ajax({
                    url: comm.get('baseUrl') + "/BasePtPriceBind/doPtTermDelete",
                    params: {
                        termIds: termIds.join(","),
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
       
    },
    
 });