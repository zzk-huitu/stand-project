Ext.define("core.public.SelectClass.controller.SelectClassController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.public.SelectClass.selectclasscontroller',
    mixins: {
        /*
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
        */
    },
    init: function () {
    },
    control: {
        "mtfuncwindow[funcPanel=pubselect.selectuserlayout] button[ref=ssOkBtn]": {
            beforeclick: function (btn) {
                
            }
        }
    }
});