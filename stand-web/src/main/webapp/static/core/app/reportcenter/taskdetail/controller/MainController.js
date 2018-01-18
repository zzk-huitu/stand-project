Ext.define("core.reportcenter.taskdetail.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.reportcenter.taskdetail.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil',
        TreeUtil:'core.util.TreeUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
     "basegrid[xtype=reportcenter.taskdetail.maingrid] actioncolumn": {
         detailClick_Win: function (data) {
            this.doDetail_Win(data.view,data.record);
            return false;
        }
    },
    "basepanel basegrid[xtype=reportcenter.taskdetail.maingrid] field[funCode=girdFastSearchText]": {
        specialkey: function (field, e) {
            var self = this;
            if (e.getKey() == e.ENTER) {
                self.doFastSearch(field);
                return false;
            }
        }
    },
    "basepanel basegrid[xtype=reportcenter.taskdetail.maingrid] button[ref=gridFastSearchBtn]": {
        beforeclick: function (btn) {
            var self = this;
            self.doFastSearch(btn);
            return false;
        }
    },
    "basegrid[xtype=reportcenter.taskdetail.maingrid] button[ref=gridExport]": {
        beforeclick: function(btn) {
            this.doExport(btn);
            return false;
        }
    },

   },
     doDetail_Win:function(grid,record){
        var self = this;
        var basegrid = grid;
        var uuid = record.get('uuid');
        var termsn= record.get('termsn');
        var win = Ext.create('core.base.view.BaseFormWin', {
            title: "参数详细",
            iconCls:'x-fa fa-plus-circle',
            operType: "detail",
            width: 700,
            height: 450,
            baseGrid: basegrid,
            uuid: uuid,
            items: [{
                xtype: "reportcenter.taskdetail.detailform"
            }]
        });
       // win.show(); 
        //9电控，4门禁
        var form = win.down("baseform[xtype=reportcenter.taskdetail.detailform]");
        form.formData.uuid = uuid;
        var params = form.formData;
        //var formDeptObj = form.getForm();
        var msgobj=Ext.getCmp("detail");
        var msg="";
        resObj = self.ajax({
            url: comm.get('baseUrl') + "/PtTask/baseParam_read",
            params: params
        });
        var aa=new Array(); 
        var valInt = null;
        var valStr = null;
        var fieldname = null;
        var tag = null;
        var len=null;
        var value=null;
        for(i=0;i<resObj.length;i++){
           valInt = resObj[i].valInt;
           fieldname=resObj[i].fieldName;
           tag=resObj[i].tag;
           len=resObj[i].len;
           valStr=resObj[i].valStr;
           if (valStr != "") {
               msg=fieldname+"(tag:"+"0x"+tag.toString(16)+"; len:"+len+"; value:"+valStr+")"+"\n"+msg;
           }
           if (valStr == "") {
               msg=fieldname+"(tag:"+"0x"+tag.toString(16)+"; len:"+len+"; value:"+valInt+")"+"\n"+msg;
           }

         }
         msgobj.setValue(msg);
         win.show();
     },
     doExport:function(btn){
        var self = this;
        var toolBar = btn.up("toolbar");
        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        var tasktype= "";
        var termsn = "";
        if(girdSearchTexts[0].getValue()){
            tasktype = girdSearchTexts[0].getValue();
        }
        if(girdSearchTexts[1].getValue()){
            termsn = girdSearchTexts[1].getValue();
        }
        var title = "确定要导出任务详细吗？";
        Ext.Msg.confirm('提示', title, function (btn, text) {
        if (btn == "yes") {
            Ext.Msg.wait('正在导出中,请稍后...', '温馨提示');
            var component = Ext.create('Ext.Component', {
                title: 'HelloWorld',
                width: 0,
                height: 0,
                hidden: true,
                html: '<iframe src="' + comm.get('baseUrl') + '/PtTask/doExportExcel?tasktype='+tasktype+'&termsn='+termsn+'"></iframe>',
                renderTo: Ext.getBody()
            });
            var time = function () {
                self.syncAjax({
                    url: comm.get('baseUrl') + '/PtTask/checkExportEnd',
                    timeout: 1000 * 60 * 30,      
                    success: function (response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));
                        if (data.success) {
                            Ext.Msg.hide();
                            self.msgbox(data.obj);
                            component.destroy();
                        } else {
                            if (data.obj == 0) {    
                                Ext.Msg.hide();
                                self.Error("导出失败，请重试或联系管理员！");
                                component.destroy();
                            } else {
                                setTimeout(function () {
                                    time()
                                }, 1000);
                            }
                        }
                    },
                    failure: function (response) {
                        Ext.Msg.hide();
                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                        component.destroy();
                    }
                });
            };
            setTimeout(function () {
                time()
            }, 1000);   
          }
      });
        return false;
   },
    doFastSearch: function (component) {
  //得到组件                 
        var baseGrid = component.up("basegrid");
        var toolBar = component.up("toolbar");
        if (!toolBar)
            return false;

        var filter = new Array();;

        var girdSearchTexts = toolBar.query("field[funCode=girdFastSearchText]");
        if(girdSearchTexts[0].getValue()!=null){
            var value = girdSearchTexts[0].getValue();
            var name = girdSearchTexts[0].getName();
            filter.push({"type": "numeric", "value": value, "field": name, "comparison": ""});
        }

        if(girdSearchTexts[1].getValue()!=null){
            var value = girdSearchTexts[1].getValue();
            var name = girdSearchTexts[1].getName();
            filter.push({"type": "string", "value": value, "field": name, "comparison": ""});
        }
        var store = baseGrid.getStore();
        var proxy = store.getProxy();
        proxy.extraParams.filter = JSON.stringify(filter);
        store.loadPage(1);

    },
});