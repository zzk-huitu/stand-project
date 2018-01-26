/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('core.basedevice.smartdevice.model.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.basedevice.smartdevice.mainModel',

    data: {
        workPatternType:{
            value:"<font style='color: rgb(196, 68, 68);font-size: 14px;line-height: 30px;padding-left: 10px;'>秒</font>"
        },
    },
});
