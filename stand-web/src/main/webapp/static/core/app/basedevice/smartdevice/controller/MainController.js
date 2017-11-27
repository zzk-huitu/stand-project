Ext.define("core.basedevice.smartdevice.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.smartdevice.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    
    init: function() {
    },
    control: {
    	
        //区域列表刷新按钮事件
        "basetreegrid[xtype=basedevice.smartdevice.roominfotree] button[ref=gridRefresh]": {
            click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=basedevice.smartdevice.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=basedevice.smartdevice.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.roomId="";
                return false;
            }
        },


    	//绑定列表事件
    	"basegrid[xtype=basedevice.smartdevice.maingrid] actioncolumn": {
            setHighParamClick_Tab: function(data) {
                this.openHighParamDetail(data.view,data.record,"edit");        
            },

            setBaseParamClick_Tab: function(data) {            
                this.openBaseParamDetail(data.view,data.record,"edit");        
            }
        },
               
    },
    
    openHighParamDetail:function(grid,record,cmd){
        var self = this;
        //得到组件
        var baseGrid = grid;
        var recordData=record.getData();

        var uuid =recordData.uuid;
        var termName=recordData.termName;
        var xItemType="";
        var termTypeID = recordData.termTypeID;
        if (termTypeID == "9" || termTypeID == "4") {
            //9电控，4门禁
            xItemType = "basedevice.smartdevice.highparamform";
        } else {
            self.msgbox('现只支持电控机、门禁机的高级参数设置');
            return false;
        }

      
        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        //得到配置信息
        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode = "highparam_detail";               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = "basedevice.smartdevice.detaillayout";            //打开的tab页的布局视图   
        var tabTitle = termName+"-设备高级参数"; 
        var tabItemId = funCode + "_gridHighParam";    //命名规则：funCode+'_ref名称',确保不重复              
              
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
                uuid: uuid,      //主键值
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){
                var item=Ext.widget("baseformtab",{
                    operType:"edit",                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,
                    detLayout:detLayout,                   
                    tabItemId:tabItemId,                //指定tab页的itemId
                    recordData:recordData,                    //保存一些需要默认值，提供给提交事件中使用
                    baseGrid:baseGrid,                     //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout,
                        items:[{
                            xtype:xItemType
                        }]
                    }]
                }); 
              
                tabItem.add(item);  
              
                //处理打开界面之后，显示的初始数据
                var objForm = item.down("baseform");
                var formObj = objForm.getForm();     


                //9电控，4门禁
                if (termTypeID == "9" || termTypeID == "4") {
                    //高级参数
                    var highParams =  objForm.highFormData;
                    highParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/highParam_read",
                        params: highParams,                      
                        //回调代码必须写在里面
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                        
                            var valInt = null;
                            var controlVal = null;
                            if (data.length > 0) {
                                var valStr = data[0].valStr.split("|");
                                for (var j = 1; j <= valStr.length; j++) {
                                    valInt = "time" + j + "";
                                    controlVal = formObj.findField(valInt);
                                    if (controlVal != null) {
                                        controlVal.setValue(valStr[j - 1]);
                                    }
                                };
                            };
                        }
                    });   
            
                    
                    // 旧的方式
                    // var params = self.getFormValue(formObj);
                    // var valInt = '';
                    // for (var i = 0; i < 4; i++) {
                    //     valInt += Ext.util.Format.date(params["time" + i + ""], 'H:i') + "|";
                    // };
                    // valInt = valInt.substring(1, valInt.length - 1);
                    // Ext.apply(params, form.formData, {
                    //     uuid: uuid,
                    //     'tlvs[0].valStr': valInt
                    // });
                    // var resObj = self.ajax({
                    //     url: comm.get('baseUrl') + "/PtTerm/highParam_read",
                    //     params: params
                    // });
                    // if (resObj.length > 0) {
                    //     var valStr = resObj[0].valStr.split("|");
                    //     for (var i = 0; i <= 3; i++) {
                    //         dicForm._fields.items[i].setValue(valStr[i]);
                    //     };
                    // }                                    
                }            
        
          },30);
                           
        }else if(tabItem.uuid&&tabItem.uuid!=uuid){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);   
           
    },

    /*此方法用于打开所有功能的基础数据界面，并且根据类型去初始化数据；  
        通过各个参数名称可以快速找到具体参数的设置方法
    */
    openBaseParamDetail:function(grid,record,cmd){
        var self = this;
        //得到组件
        var baseGrid = grid;
        var recordData=record.getData();

        var uuid =recordData.uuid;
        var termName=recordData.termName;
        var xItemType="";
        var termTypeID = recordData.termTypeID;
        if (termTypeID == '9') {
            //电控基础参数
            xItemType = "basedevice.smartdevice.dkbaseparamform";
        } else if (termTypeID == '4') {     
            //门禁基础参数
            xItemType = "basedevice.smartdevice.doorcontrolform";
        } else if (termTypeID == '17') {
            //17灯控开关
            xItemType = "basedevice.smartdevice.ampcontrolform";           
        } else if (termTypeID == '11') {
            //11红外
            xItemType = "basedevice.smartdevice.infraredparamform";          
        } else if (termTypeID == '8') {            
            //水控基础参数
            xItemType = "basedevice.smartdevice.skbaseparamform";
        } else {
            self.msgbox('现只支持电控机、门禁机、水控机基础参数设置');
            return false;
        }
      
        var basePanel = baseGrid.up("basepanel");
        var tabPanel = baseGrid.up("tabpanel[xtype=app-main]");
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  

        //得到配置信息
        var funCode = basePanel.funCode;          //主界面的funCode
        var detCode = "baseparam_detail";               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = "basedevice.smartdevice.detaillayout";            //打开的tab页的布局视图   
        var tabTitle = termName+"-设备基础参数"; 
        var tabItemId = funCode + "_gridBaseParam";    //命名规则：funCode+'_ref名称',确保不重复              
              
        //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
        var tabItem=tabPanel.getComponent(tabItemId);
        if(!tabItem){

            //创建tabItem
            var tabItem = Ext.create({
                xtype:'container',
                title: tabTitle,
                scrollable :true, 
                itemId:tabItemId,            
                layout:'fit', 
                uuid: uuid,      //主键值
            });
            tabPanel.add(tabItem); 

            //延迟放入到tab中
            setTimeout(function(){
                var item=Ext.widget("baseformtab",{
                    operType:"edit",                            
                    controller:otherController,         //指定重写事件的控制器
                    funCode:funCode,                    //指定mainLayout的funcode
                    detCode:detCode,
                    detLayout:detLayout,                   
                    tabItemId:tabItemId,                //指定tab页的itemId
                    recordData:recordData,                    //保存一些需要默认值，提供给提交事件中使用
                    baseGrid:baseGrid,                     //保存funData数据，提供给提交事件中使用
                    items:[{
                        xtype:detLayout,
                        items:[{
                            xtype:xItemType
                        }]
                    }]
                }); 
              
                tabItem.add(item);  
              
                //处理打开界面之后，显示的初始数据
                var objForm = item.down("baseform");
                var formObj = objForm.getForm();     

                //门禁
                if (termTypeID == '4') {  
                    //门禁基础参数
                    var baseParams =  objForm.baseFormData;
                    baseParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/baseParam_read",
                        params: baseParams,                      
                        //回调代码必须写在里面
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                        
                            var valInt = null;
                            var valStr = null;
                            var controlVal = null;
                            var checkboxgroup = objForm.down("checkboxgroup[ref=KrateForm_lblOperationBehaviors]");
                           
                            for (var i = 0; i < data.length; i++) {
                                valInt = "tlvs[" + i + "].valInt";
                                valStr = "tlvs[" + i + "].valStr";
                                if (data[i].tag == 0x1015) {
                                    for (var j = 0; j < data[i].valStr.length; j++) {
                                        var che = data[i].valStr;
                                        if (checkboxgroup != null) {
                                            for (var k = 0; k < checkboxgroup.items.items.length; k++) {
                                                if (che[0] == 0) {
                                                    checkboxgroup.items.items[k].setValue(false)
                                                } else {
                                                    checkboxgroup.items.items[k].setValue(true)
                                                }
                                                che = che.substring(1, che.length);
                                            };
                                        }
                                    };
                                } else {
                                    controlVal = formObj.findField(valInt);
                                    if (controlVal != null) {
                                        if (controlVal.xtype != 'numberfield') {

                                            controlVal=objForm.query("field[name='" + valInt +"']");  
                                            if (data[i].valInt == 0) {
                                                controlVal[0].setValue(true);
                                                controlVal[1].setValue(false);
                                            } else {
                                                controlVal[0].setValue(false);
                                                controlVal[1].setValue(true);
                                            } 

                                            // for (var k = 0; k < controlVal.items.items.length; k++) {
                                            //     if (controlVal.items.items[k].inputValue == data[i].valInt) {
                                            //         controlVal.items.items[k].setValue(data[i].valInt);
                                            //     }
                                            // };
                                        } else {
                                            controlVal.setValue(data[i].valInt);
                                        }
                                    } else if (controlVal == null) {
                                        controlVal = formObj.findField(valStr);
                                        if (controlVal != null) controlVal.setValue(data[i].valStr);
                                    }
                                }
                            };
                        }
                    }); 
                } //水控
                else if (termTypeID == '8') {                                
                    var baseParams =  objForm.baseFormData;
                    baseParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/baseParam_read",
                        params: baseParams,                      
                        //回调代码必须写在里面
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                        
                            var valInt = null;
                            var valStr = null;
                            var controlVal = null;
                         
                            for (var i = 0; i < data.length; i++) {
                                valInt = "tlvs[" + i + "].valInt";
                                valStr = "tlvs[" + i + "].valStr";
                                //32类卡
                                if (data[i].tag == 0x2007) {
                                    var che = data[i].valStr;
                                    for (var l = 0; l < 4; l++) {
                                        var check = objForm.down("checkboxgroup[ref=sKBaseParamForm_lblOperationBehaviors" + (l+1) + "]");                                       
                                        if (check != null) {
                                            for (var k = 0; k < check.items.items.length; k++) {
                                                if (che[0] == 0) {
                                                    check.items.items[k].setValue(false)
                                                } else {
                                                    check.items.items[k].setValue(true)
                                                }
                                                che = che.substring(1, che.length);
                                            };
                                        }
                                    }
                                  
                                }  //32类卡费率
                                else if (data[i].tag == 0x7000) {
                                    var val = data[i].valStr.split("|");
                                    for (var k = 0; k < 4; k++) {
                                        var numitems = objForm.down("container[ref=termparam.KrateForm" + (k+1) + "]");                                         
                                        if (numitems != null) {
                                            for (var j = 0; j < numitems.items.items.length; j++) {
                                                numitems.items.items[j].setValue(val[0]);
                                                val.shift(0);
                                            };
                                        }
                                    }
                                }else {
                                    controlVal = formObj.findField(valInt);
                                    if (controlVal != null) {
                                        if (controlVal.xtype != 'numberfield') {
                                            controlVal.setValue(data[i].valInt.toString());
                                        } else {
                                            controlVal.setValue(data[i].valInt);
                                        }
                                    } else if (controlVal == null) {
                                        controlVal = formObj.findField(valStr);
                                        if (controlVal != null) controlVal.setValue(data[i].valStr);
                                    }                            
                                }
                            }
                        }
                    });                               
                }
                 //9电控
                else if (termTypeID == "9") {
                    //基础参数
                    var baseParams =  objForm.baseFormData;
                    baseParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/baseParam_read",
                        params: baseParams,                      
                        //回调代码必须写在里面
                        success: function(response) {                            
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                        
                            var valInt = null;
                            var controlVal = null;
                            if (data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    valInt = "tlvs[" + i + "].valInt";
                                    controlVal = formObj.findField(valInt);
                                    if (controlVal != null) {
                                        controlVal.setValue(data[i].valInt);
                                    }
                                }                                
                            };
                        }
                    });       
                } //11红外
                else if (termTypeID == '11') {     
                    var baseParams =  objForm.baseFormData;
                    baseParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/baseParam_read",
                        params: baseParams,                      
                        //回调代码必须写在里面
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                        
                            var valInt = null;
                            var controlVal = null;

                            if(data.tlvs){
                                for (var i = 0; i < data.tlvs.length; i++) {
                                    valInt = "tlvs[" + i + "].valInt";
                                    controlVal = formObj.findField(valInt);
                                    if (data.tlvs[i].tag == 0xC001) {
                                        var arr1 = data.tlvs[i].valStr.split("#");
                                        var arr2 = arr1[2].split("|");
                                        for (var i = 0; i < arr2.length; i++) {
                                            controlVal = formObj.findField("time" + i)
                                            if (controlVal != null) {
                                                controlVal.setValue(arr2[i]);
                                            }
                                        };
                                        if (arr1[1] != null) {
                                            controlVal = formObj.findField("type");
                                            if (controlVal != null) {
                                                controlVal.setValue(arr1[1]);
                                            }
                                        }
                                        if (arr1[3] != null) {
                                            for (var i = 0; i < arr1[3].length; i++) {
                                                controlVal=objForm.query("field[name=status" + i+"]");  
                                                if (arr1[3][i] == 0) {
                                                    controlVal[0].setValue(true);
                                                    controlVal[1].setValue(false);
                                                } else {
                                                    controlVal[0].setValue(false);
                                                    controlVal[1].setValue(true);
                                                }      
                                                // controlVal = formObj.findField("status" + i);
                                                // for (var k = 0; k < controlVal.items.items.length; k++) {
                                                //     if (controlVal.items.items[k].inputValue == arr1[3][i]) {
                                                //         controlVal.items.items[k].setValue(arr1[3][i]);
                                                //     }
                                                // };
                                                // if (controlVal != null) {
                                                //     if (arr1[3][i] == 0) {
                                                //         controlVal.setValue(false);
                                                //     } else {
                                                //         controlVal.setValue(true);
                                                //     }
                                                // }
                                            };
                                        }
                                    } else if (controlVal != null) {
                                        controlVal.setValue(data.tlvs[i].valInt);
                                    }
                                }

                                if (data['notes'] != null && data[''] != '') {
                                    controlVal = formObj.findField("notes");
                                    if (controlVal != null) {
                                        controlVal.setValue(data['notes']);
                                    }
                                }
                            }                          
                        }
                    });                   
                }  //17灯控
                else if (termTypeID == '17') { 
                    //17灯控开关
                    var baseParams =  objForm.baseFormData;
                    baseParams.uuid = uuid;
                    self.asyncAjax({                      
                        url: comm.get('baseUrl') + "/BasePtTerm/baseParam_read",
                        params: baseParams,                      
                        //回调代码必须写在里面
                        success: function(response) {
                            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));                          
                            var controlVal = null;
                            var fieldsetCpt = null;
                            if (data.tlvs){
                                for (var k = 0; k < data.tlvs.length; k++) {
                                    if (data.tlvs[k].tag == 0x1006) {
                                        objForm.down("[ref=tlvsvalInt]").setValue(data.tlvs[0].valInt);
                                    } else if (data.tlvs[k].valStr != '') {
                                        var item = data.tlvs[k].valStr.split('&');
                                        for (var i = 0; i < item.length; i++) {
                                            var arr1 = item[i].split('#');
                                            var time = arr1[2].split('|');                                          
                                            fieldsetCpt = objForm.down("fieldset[ref=lItems" + arr1[0] + "]");
                                            fieldsetCpt.down('field[name=type]').setValue(arr1[1]);

                                            for (var l = 0; l < time.length; l++) {
                                                fieldsetCpt.down("field[name=time" + l + "]").setValue(time[l]);

                                                controlVal=fieldsetCpt.query("field[name='items"+arr1[0]+".status" + l +"']");  
                                                if (arr1[3][l] == 0) {
                                                    controlVal[0].setValue(true);
                                                    controlVal[1].setValue(false);
                                                }else {
                                                    controlVal[0].setValue(false);
                                                    controlVal[1].setValue(true);
                                                }
                                                // controlVal = fieldsetCpt.down("field[name=status" + l+"]");
                                                // for (var o = 0; o < controlVal.items.items.length; o++) {
                                                //     if (controlVal.items.items[o].inputValue == arr1[3][l]) {
                                                //         controlVal.items.items[o].setValue(arr1[3][l]);
                                                //     }
                                                // }
                                            };
                                        };
                                    }
                                };
                                if (data.notes != null && data.notes != '') {
                                    var notes = data.notes.split('|');
                                    for (var i = 0; i < notes.length; i++) {
                                        fieldsetCpt = objForm.down("fieldset[ref=lItems" + (i + 1) + "]");
                                   
                                        var startss=notes[i].lastIndexOf(":")+1;
                                        var ss=notes[i].split(':');
                                        if(startss>2){
                                            fieldsetCpt.down('field[name=notes]').setValue(ss[1]);                                           
                                        }
                                        if(startss<=2){
                                            fieldsetCpt.down('field[name=notes]').setValue(notes[i].substring(2,notes[i].length));                                       
                                        }
                                        var onss=notes[i].substring(startss,notes[i].length);
                                        if(startss>2&&onss=="1"){
                                            fieldsetCpt.down('field[name=on]').setValue("1");
                                        }
                                        if(startss>2&&onss=="0"){
                                            fieldsetCpt.down('field[name=on]').setValue("0");
                                        }
                                    };
                                }
                                if (data.tlvs[2].valInt != null && data.tlvs[2].valInt!= '') {
                                    objForm.down("[ref=tlvsva2Int]").setValue(String(data.tlvs[2].valInt));
                                }else{
                                    objForm.down("[ref=tlvsva2Int]").setValue("0");
                                }
                            }
                        }
                    });    
                }      
        
          },30);
                           
        }else if(tabItem.uuid&&tabItem.uuid!=uuid){     //判断是否点击的是同一条数据
            self.msgbox("您当前已经打开了一个编辑窗口了！");
            return;
        }

        tabPanel.setActiveTab(tabItem);   
           
    }
    
    
});