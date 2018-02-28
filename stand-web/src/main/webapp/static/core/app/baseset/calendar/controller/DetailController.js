Ext.define("core.baseset.calendar.controller.DetailController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.baseset.calendar.detailcontroller',
    mixins: {},
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"combobox[name=isafgernoon]": {
            change: function(combo, newValue, oldValue, eOpts) {     
                var objDetForm = combo.up("baseform[xtype=baseset.calendar.detailform]");
                var beginTime = objDetForm.down("timefield[name=beginTime]");
                var endTime = objDetForm.down("timefield[name=endTime]");
                if (newValue == 0) {
                    beginTime.setMinValue('06:00');
                    beginTime.setMaxValue('14:00');
                    endTime.setMinValue('06:00');
                    endTime.setMaxValue('14:00');
                } else if (newValue == 1) {
                    beginTime.setMinValue('13:00');
                    beginTime.setMaxValue('19:00');
                    endTime.setMinValue('13:00');
                    endTime.setMaxValue('19:00');
                } else if (newValue == 2) {
                    beginTime.setMinValue('18:00');
                    beginTime.setMaxValue('23:00');
                    endTime.setMinValue('18:00');
                    endTime.setMaxValue('23:00');
                }

            }
        },
    }
});