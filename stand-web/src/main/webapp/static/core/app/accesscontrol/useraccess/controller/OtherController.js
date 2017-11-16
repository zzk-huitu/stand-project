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
        var self=this;
        var win = btn.up('window');
        var termId = win.termid;
        //var termSN = win.termSN;
        //var termName = win.termName;

        var employeeID = ""; //人员id
        var employeeName = ""; //人员主键
        var stuId = "";

        var tabPanel = Ext.ComponentQuery.query("tabpanel[xtype=app-main]")[0];
        var mainlayout = tabPanel.getActiveTab(); 
        var usExistGrid = mainlayout.down('panel[xtype=accesscontrol.useraccess.maingrid]');

        var grid = win.funData.grid;
        var gridStore = grid.getStore();
        var gridCount = grid.getStore().getCount()
       
        var selectuserlayout = win.down("basepanel[xtype=pubselect.selectuserlayout]");
        var isSelectUserGrid = selectuserlayout.down("panel[xtype=pubselect.isselectusergrid]");
        var isSelectUserStore = isSelectUserGrid.getStore();
        var isSelectUserCount = isSelectUserStore.getCount();
        if (isSelectUserCount <= 0) {
            self.msgbox("有数据才能继续操作!");
            return;
        }
       
       for (var i = 0; i < isSelectUserCount; i++) {
            employeeID = isSelectUserStore.getAt(i).data.uuid;
            for (var k = 0; k < gridCount; k++) {
                 var employeeid = gridStore.getAt(k).data.stuId;
                 var xm = gridStore.getAt(k).data.xm;
                if (employeeID == employeeid) {
                    self.Info("提示", "姓名为：" + xm + "的已存在!");
                    return ;
                }
            };
            employeeName = gridStore.getAt(i).data.xm;
           /* data = {
                stuId: employeeID, //人员id
                termId: termId, //设备id
                xm: employeeName, //人员名称
                termSN: termSN, //设备序列号
                termName: termName //设备名称
            };*/
           // grid.getStore().insert(0, data); //加入到新的grid
           stuId += employeeID + "," ;          
        }
        var loading= self.LoadMask(win,"正在处理中...,请等待！");
        self.asyncAjax({
            url: comm.get('baseUrl') + "/BaseMjUserright/doAddMj",
            params: {
              userId: stuId,
              termId: termId,
          },          
        //回调代码必须写在里面
        success: function (response) {
            var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
            if (data.success) {
                self.msgbox("提交成功!");
                usExistGrid.getStore().load();                         
                loading.hide();
                win.close();

            } else {
                loading.hide();
                self.Warning(data.obj);
                win.close();
            }
        },
        failure: function(response) {                   
            Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
            loading.hide();
        }
    });

},
    
});