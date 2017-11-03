Ext.define("core.accesscontrol.useraccess.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.accesscontrol.useraccess.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
    	var self = this;
    },
    /** 该视图内的组件事件注册 */
    control: {

    	//选择人员窗口的提交按钮
		"baseformwin[funCode=useraccess_detail] button[ref=formSave]": {
			beforeclick: function (btn) {    
				this.saveDetail_Win(btn);
				return false;
			}
		},
	
    },
    
    //选择人员保存事件
    saveDetail_Win:function(btn){
        var win = btn.up('window');
        var termId = win.termid;
        var termSN = win.termSN;
        var termName = win.termName;

        var upGrid = win.baseGrid;
        var basePanel = win.down("panel[xtype=pubselect.selectuserlayout]");
        var funCode = basePanel.funCode;
        var baseGrid = basePanel.down("panel[xtype=pubselect.isselectusergrid]");
        var employeeID = ""; //人员id
        var employeeName = ""; //人员主键
        var getCount = baseGrid.getStore().getCount();
        if (getCount <= 0) {
            this.Warning("有数据才能继续操作!");
            return false;
        }
        var gridStore = baseGrid.getStore();
        var upStore = upGrid.getStore();
        var upGridCount = upGrid.getStore().getCount()
        for (var i = 0; i < getCount; i++) {
            employeeID = gridStore.getAt(i).data.uuid;
            for (var k = 0; k < upGridCount; k++) {
                var employeeid = upStore.getAt(k).data.stuId;
                var xm = upStore.getAt(k).data.xm;
                if (employeeID == employeeid) {
                    Ext.Msg.alert("提示", "姓名为：" + xm + "的已存在!");
                    return false;
                }
            };
            employeeName = gridStore.getAt(i).data.xm;
            data = {
                stuId: employeeID, //人员id
                termId: termId, //设备id
                xm: employeeName, //人员名称
                termSN: termSN, //设备序列号
                termName: termName //设备名称
            };
            upGrid.getStore().insert(0, data); //加入到新的grid
        }
        win.close();
        return false;
        
        
    },
    
});