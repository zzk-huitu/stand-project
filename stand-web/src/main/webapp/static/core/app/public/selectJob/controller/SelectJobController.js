Ext.define("core.public.selectJob.controller.SelectJobController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.pubselect.selectjobcontroller',
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
        "mtfuncwindow[funcPanel=pubselect.selectjoblayout] button[ref=ssOkBtn]": {
            beforeclick: function (btn) {
                return ;
            }
        }
    }
});