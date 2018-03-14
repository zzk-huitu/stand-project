Ext.define("core.coursemanage.funcroomcourse.controller.OtherController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.funcroomcourse.othercontroller',
    mixins: {
    	suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"baseformtab[detCode=funcroomcourse_detail] button[ref=formSave]": {
            beforeclick: function (btn) {
                this.doSaveCourse(btn);
                return false;
            }
        },

    },

    doSaveCourse:function(btn){
        var self=this;
        var basetab = btn.up('baseformtab');
        var tabPanel = btn.up("tabpanel[xtype=app-main]");
        var tabItemId = basetab.tabItemId;
        var tabItem = tabPanel.getComponent(tabItemId);   //当前tab页

        var funCode = basetab.funCode;      //mainLayout的funcode
        var detCode = basetab.detCode;      //detailLayout的funcode

        var selectedGird=basetab.down("basegrid[xtype=coursemanage.funcroomcourse.selectedcourse]");
        var store=selectedGird.getStore();
        if(store.getCount() == 0){
            self.msgbox("没有选择班级课程数据！");
            return;
        }

        
        var loading = new Ext.LoadMask(basetab, {
            msg: '正在提交，请稍等...',
            removeMask: true// 完成后移除
        });
        loading.show();


        var datas=new Array();
        store.each(function(rec) {
            datas.push(rec.data);
        });

        self.asyncAjax({
            url:comm.get("baseUrl") + "/FuncRoomCourse/doAddFuncRoomCourse",
            params: {
                entitys:JSON.stringify(datas)
            },
            //回调代码必须写在里面
            success: function (response) {
                var data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                if (data.success) {

                    self.msgbox("提交成功!");
                   
                    var grid = basetab.funData.grid; //此tab是否保存有grid参数
                    if (!Ext.isEmpty(grid)) {
                        var store = grid.getStore();
                        store.loadPage(1)                       
                    }
                    loading.hide();
                    tabPanel.remove(tabItem);
                 
                } else {
                    self.Error(data.obj);
                    loading.hide();
                }
            },
            failure: function(response) {                   
                Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);
                loading.hide();
            }
        });
    } 
});