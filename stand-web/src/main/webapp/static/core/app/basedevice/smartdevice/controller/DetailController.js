Ext.define("core.basedevice.smartdevice.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.basedevice.smartdevice.detailcontroller',
    mixins: {},
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	'baseform[xtype=basedevice.smartdevice.skbaseparamform] button[ref=checkall]':{
            click:function(btn){
                var objForm=btn.up("baseform[xtype=basedevice.smartdevice.skbaseparamform]");
                for(var i=0;i<4;i++){
                    var checkbox = objForm.down("checkboxgroup[ref=sKBaseParamForm_lblOperationBehaviors" + (i+1) + "]");    
                    for (var j = 0; j < checkbox.items.items.length; j++) {
                        if (checkbox.items.items[j].checked == true) {
                            checkbox.items.items[j].setValue(false)
                        } else {
                            checkbox.items.items[j].setValue(true)
                        }
                    };
                }
                
            }
        },
        'baseform[xtype=basedevice.smartdevice.doorcontrolform] button[ref=checkall]':{
            click:function(btn){
                var objForm=btn.up("baseform[xtype=basedevice.smartdevice.doorcontrolform]");    
                var checkbox = objForm.down("checkboxgroup[ref=KrateForm_lblOperationBehaviors]");  

                for (var j = 0; j < checkbox.items.items.length; j++) {
                    if (checkbox.items.items[j].checked == true) {
                        checkbox.items.items[j].setValue(false)
                    } else {
                        checkbox.items.items[j].setValue(true)
                    }
                };                        
            }
        }
    }
});