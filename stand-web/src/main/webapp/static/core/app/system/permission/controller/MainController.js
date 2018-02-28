Ext.define("core.system.permission.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.system.permission.maincontroller',
    mixins: {
        //suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        // formUtil: "core.util.FormUtil",
        // gridActionUtil: "core.util.GridActionUtil",
        // dateUtil: 'core.util.DateUtil'

    },
    init: function() {
        /*control事件声明代码，可以写在这里
        this.control({
    
        });
        */
    },
    control: {      
        "basegrid button[ref=gridAdd_Tab]": {
            beforeclick: function (btn) {

                var self= this;
                //得到组件
                var baseGrid = btn.up("basegrid");       

                var mainLayout = baseGrid.up("basepanel[xtype=system.permisson.mainlayout]");

                //得到树组件
                var baseTreeGrid = mainLayout.down("basetreegrid");
                var records = baseTreeGrid.getSelectionModel().getSelection();
                if (records.length != 1) {
                    self.msgbox("请选择一项菜单！");
                    return false;
                }

                var funData = mainLayout.funData;
                if(funData.defaultObj.menuType !="FUNC"){
                    self.msgbox("只允许给功能菜单设置权限！");
                    return false;
                }

                //若没有return false， 则继续去执行公共的add方法。
                
            }
        }
    }

});
