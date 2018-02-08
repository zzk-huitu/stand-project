Ext.define("core.public.OneKeyAllotDorm.controller.DormDefineController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.pubselect.dormdefinecontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'

    },
    init: function () {
        this.control({
            "basetreegrid[xtype=pubonkeyallotdorm.boydormdefinetree] button[ref=gridRefresh]":{
                beforeclick: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore().load(); //刷新父窗体的grid
                    return false;
               }    
            },
            "basetreegrid[xtype=pubonkeyallotdorm.girldormdefinetree] button[ref=gridRefresh]":{
                beforeclick: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore().load(); //刷新父窗体的grid
                    return false;
               }    
            },
            "basetreegrid[xtype=pubonkeyallotdorm.studormareatree] button[ref=gridRefresh]":{
                beforeclick: function(btn) {
                    var baseGrid = btn.up("basetreegrid");
                    var store = baseGrid.getStore().load(); //刷新父窗体的grid
                    return false;
               }    
            }
        })
    },
});