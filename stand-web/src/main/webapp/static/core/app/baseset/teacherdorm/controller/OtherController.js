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
        
        "basepanel basegrid[xtype=pubselect.selectusergrid] field[funCode=girdFastSearchText]": {
            specialkey: function (field, e) {              
                if (e.getKey() == e.ENTER) {
                    this.doFastSearch(field);
                    return false;
                }
            }
        },
        "basepanel basegrid[xtype=pubselect.selectusergrid] button[ref=gridFastSearchBtn]": {
            beforeclick: function (btn) {
                this.doFastSearch(btn);
                return false;
            }
        },
        "mtfuncwindow[funcPanel=pubselect.selectuserlayout] button[ref=ssOkBtn]": {

                beforeclick: function(btn) {
                    var result=this.doSelectedUser(btn);
                    if(!result)
                        return false;
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
        //选择的数据量
        var bedCount=formObj.findField("bedCount").getValue().split(",");
		var arkCount=formObj.findField("arkCount").getValue().split(",");

		var defined=grid.store.totalCount;
		if (resObj.dormBedCount < bedCount.length+defined) {
			self.msgbox("床位数量不能超过"+resObj.dormBedCount +"个");
			return;
		}
		if (resObj.dormChestCount < arkCount.length+defined) {
			self.msgbox("柜子数量不能超过"+resObj.dormChestCount +"个");
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
                        loading.hide();
                        self.Warning(data.obj);
                        grid.getStore().load();  
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


        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        //这里快速搜索就姓名与部门，固定写死查询的条件
        var filter = new Array();
        filter.push("{'type': 'string', 'comparison': '', 'value':'1', 'field': 'category'}");
        if (girdSearchTexts[0].getValue() != "")
        filter.push("{'type': 'string', 'comparison': '', 'value':'" + girdSearchTexts[0].getValue() + "', 'field': 'xm'}");
        if (girdSearchTexts[1].getValue() != "")
            filter.push("{'type': 'string', 'comparison': '=', 'value':'" + girdSearchTexts[1].getValue() + "', 'field': 'deptId'}");
        filter = "[" + filter.join(",") + "]";

        var selectStore = baseGrid.getStore();
        var selectProxy = selectStore.getProxy();
        selectProxy.extraParams = {
            filter: filter
        };
        selectStore.loadPage(1);
    },

    doSelectedUser:function(btn){    
        var self=this;
        var win = btn.up('window');
        var dataField = win.dataField;
        var gridField = win.gridField;

        var funcPanel = win.down('basepanel[xtype='+ win.funcPanel+']');
        var IsSelectStore = funcPanel.down("panel[xtype=pubselect.isselectusergrid]");
        var tabPanel = Ext.ComponentQuery.query('tabpanel[xtype=app-main]')[0];
        var tabItem = tabPanel.getActiveTab();
        var formpanel = tabItem.down('form[xtype='+ win.formPanel+']');
        var bf = formpanel.getForm();
        var formDormId = bf.findField("dormId").getValue();
        var formRoomId = bf.findField("roomId").getValue();

        var store = IsSelectStore.getStore();

        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i); 
            var userNumb = record.get("userNumb");
            if(!userNumb){
                self.Warning("不允许给工号为空的教师设置宿舍！");
                return false;
            }
        }
        
           
        
        var date = self.ajax({
            url: comm.get('baseUrl') + "/BaseTeacherDrom" + "/getTeaDormXmb",
            params: {
                roomId:formRoomId
            },
        });

        var xmb = '';
        var dormType='';
        if(date!=null){
            dormType = date.dormType;
            if(dormType=="1" || dormType=="2"){
                if (dormType=='1'){
                    xmb = '男';
                }else if(dormType=='2'){
                   xmb = '女';
                }
                var isStoreXmb=new Array();
                for (var i = 0; i < store.getCount(); i++) {
                    var record = store.getAt(i);        
                    var xbm = record.get("xbm");                
                    isStoreXmb.push(xbm);
                }
            
                for(var j=0; j<isStoreXmb.length; j++){
                    if(isStoreXmb[j]!=dormType){
                        self.Warning("该教师宿舍为"+ xmb+ "宿舍,请均选择"+ xmb+ "教师。");
                        return false;
                    }

                }
            }
            
        }

         

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
            }
        });

        return true;
    }

});