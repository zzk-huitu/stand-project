Ext.define("core.baseset.teacherdorm.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.teacherdorm.othercontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        queryUtil: "core.util.QueryUtil"
    },
    init: function () {
    	var self=this;
    	this.control({
    		"baseformtab[detCode=teacherdorm_detail] button[ref=formSave]": {
    			beforeclick: function (btn) {    
    				this.saveDetail_Tab(btn);
    				return false;
    			}
    		},
  /**
         * 角色用户选择列表 快速搜索文本框回车事件
         */
        "basepanel basegrid[xtype=pubselect.selectusergrid] field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {
                var self = this;
                if (e.getKey() == e.ENTER) {
                    self.doFastSearch(field);
                    return false;
                }
            }
        },
        /**
         * 角色用户选择列表 快速搜索按钮事件
         */
        "basepanel basegrid[xtype=pubselect.selectusergrid] button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
                var self = this;
                self.doFastSearch(btn);
                return false;
            }
        },
            "mtfuncwindow[funcPanel=pubselect.selectuserlayout] button[ref=ssOkBtn]": {

                beforeclick: function(btn) {
                    var win = btn.up('window');
                    var dataField = win.dataField;
                    var gridField = win.gridField;

                    var tabPanel = Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
                    var tabItem = tabPanel.getActiveTab();
                    var formpanel = tabItem.down('form[xtype='+ win.formPanel+']');
                    var bf = formpanel.getForm();
                    var formDormId = bf.findField("dormId").getValue();

                    var basePanel = win.down("basepanel[xtype=pubselect.selectuserlayout]");
                    var baseGrid = basePanel.down("panel[xtype=pubselect.isselectusergrid]");
                    var records = baseGrid.getStore().data.items;
                    var valueArray = new Array();
                    var arkNumArr=new Array();
                    self.asyncAjax({
                        url: comm.get('baseUrl') + "/BaseTeacherDrom" + "/getMax",
                        params: {
                            dormId:formDormId
                        },
                         //回调代码必须写在里面
                        success: function (response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                                Ext.each(records, function(r,index) {
                                    valueArray.push(data.bedNum+index+1);
                                    arkNumArr.push(data.arkNum+index+1);
                                });
                                var bff = bf.findField("bedCount").setValue(valueArray.join(","));
                                bff = bf.findField("arkCount").setValue(arkNumArr.join(","));
     
                        },
                        failure: function(response) {                   
                            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                            loading.hide();
                        }
                    });

                }
            },
    	})
    },
   saveDetail_Tab:function(btn){
        var self=this;

        //获取组件
        var basetab = btn.up('baseformtab');
        
        //获取以下两个Code值
        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        //找到详细布局视图和详细表单
        var detPanel = basetab.down("basepanel[funCode=" + detCode + "]");
        var objForm = detPanel.down("baseform[funCode=" + detCode + "]");

        var formObj = objForm.getForm();    //获取表单对象
        var funData = detPanel.funData;     //获取详细视图下面的funData数据
        var params;

		var grid = basetab.funData.grid; //此tab是否保存有grid参数

		var resObj = self.syncAjax({
		  url: funData.action + "/getDefineInfo",
		  params: {
		  	dormId:basetab.funData.dormId
		  }
		});
        var bedCount=formObj.findField("bedCount").getValue().split(",");
		var arkCount=formObj.findField("arkCount").getValue().split(",");

		var defined=grid.store.totalCount;
		if (resObj.dormBedCount < bedCount.length+defined) {
			self.msgbox("床位数量不能超过已经定义的");
			return;
		}
		if (resObj.dormChestCount < arkCount.length+defined) {
			self.msgbox("柜子数量不能超过已经定义的");
			return;
		}
          //获取当前tab页
          var tabPanel = btn.up("tabpanel[xtype=app-main]");
          var tabItem = tabPanel.getComponent(basetab.tabItemId);   
                //验证表单是否通过
        if (formObj.isValid()) {    
            params = self.getFormValue(formObj);    //获取表单的值
            var loading = self.LoadMask(basetab);
    
            self.asyncAjax({
                url: funData.action + "/doAdd",
                params: params,                
                //回调代码必须写在里面
                success: function (response) {
                    var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                    if (data.success) {
                        self.msgbox("提交成功!");
                    	grid.getStore().load();                         
                    	loading.hide();
                        tabPanel.remove(tabItem);
                     
                    } else {
                        var error=[""];
                        error.push("<font color=red>" + data.obj+ "</font>");
                        self.msgbox(error.join("<br/>"));
                        grid.getStore().load();  
                        loading.hide();
                        tabPanel.remove(tabItem);
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
/*
        var win = baseGrid.up("window");
        var winFunData = win.funData;
        var roleId = winFunData.roleId;
*/
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
           // roleId: roleId,
            filter: filter
        };
        selectStore.loadPage(1);
    },

});