Ext.define("core.coursemanage.coursetable.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.coursetable.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function () {
        /*执行一些初始化的代码*/
    	var self = this
    },
    /** 该视图内的组件事件注册 */
    control: {
    	"basegrid[xtype=coursemanage.coursetable.maingrid] button[ref=gridImport]": {
            beforeclick: function (btn) {
                this.openImportView(btn);
                return false;
            }
        },
        
        "panel[xtype=coursemanage.coursetable.maingrid] button[ref=gridDownExcel]": {
            beforeclick: function(btn) {
                //window.open(comm.get("baseUrl")+"/BaseAttachment/downLoadExcel?filename=/static/upload/excel/model/高中部课表导入模版.xls");
                window.open(comm.get("baseUrl")+"/upload/excel/courseTable.xls");
                return false;
            }
        },
        
        "panel[xtype=coursemanage.coursetable.maingrid] button[ref=gridSetUse]": {
            beforeclick: function(btn) { 
                this.setTableIsUse(btn,"use");
                return false; 
            }
        },
        "panel[xtype=coursemanage.coursetable.maingrid] button[ref=gridSetUnUse]": {
            beforeclick: function(btn) { 
                this.setTableIsUse(btn,"unuse");
                return false; 
            }
        },

        "panel[xtype=coursemanage.coursetable.classtree] button[ref=gridRefresh]": {
    		click: function(btn) {
    			var baseGrid = btn.up("basetreegrid");
    			var store = baseGrid.getStore();
                store.load(); //刷新父窗体的grid
                var mainlayout = btn.up("basepanel[xtype=coursemanage.coursetable.mainlayout]");
                var mianGrid = mainlayout.down("basegrid[xtype=coursemanage.coursetable.maingrid]");
                var store = mianGrid.getStore();
                var proxy = store.getProxy();
                proxy.extraParams.claiId="";
                return false;
            }
        },
        
        "basetreegrid[xtype=coursemanage.coursetable.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) { 
            	this.loadMainGridStore(tree,record);                
                return false; 
             }
        },
        "basepanel basegrid[xtype=coursemanage.coursetable.maingrid]": {
            afterrender : function(grid) {
            this.hideFuncBtn(grid);
          },
         },
       

    },

    openImportView:function(btn){
        var self = this;
        //得到组件
        var baseGrid = btn.up("basegrid");
    
        var win = Ext.create('Ext.Window', {
            title: "导入课表数据",
            iconCls: 'x-fa fa-clipboard',
            width: 450,
            resizable: false,
            constrain: true,
            autoHeight: true,
            modal: true,
            controller: 'public.importExcel.maincontroller',
            closeAction: 'close',
            plain: true,
            grid: baseGrid,
            items: [{
                xtype: "public.importExcel.importform",
                url:comm.get('baseUrl') + "/CourseArrange/importExcel",
                downUrl:comm.get('baseUrl') + "/CourseArrange/downNotImportInfo"
            }]
        });
        win.show();

    },
    
    loadMainGridStore:function(tree,record){
        var self=this;
        var mainLayout = tree.up("panel[xtype=coursemanage.coursetable.mainlayout]");
        var areaType = record.get("nodeType");
        var areaId = record.get("id");

        Ext.apply(mainLayout.funData, {
            areaId: areaId,
            areaType: areaType,
            areaName: record.get("text"),
        });
    
        var roomGrid = mainLayout.down("panel[xtype=coursemanage.coursetable.maingrid]");

        //获取右边筛选框中的条件数据
//       var filter=self.getFastSearchFilter(roomGrid);
        //var filter = new Array();
        //额外必须的参数
        //filter.push({"type":"string","comparison":"=","value":areaId,"field":"claiId"});                
    
        var store = roomGrid.getStore();
        var proxy = store.getProxy();
        //附带参赛
        proxy.extraParams={
            deptId:areaId,
            deptType:areaType,
            //filter:JSON.stringify(filter)
        }
        store.loadPage(1); // 给form赋值
        
        
    },

    setTableIsUse:function(btn,cmd){
        var self = this;
        var mainGrid = btn.up("basegrid");
        var mainLayout = mainGrid.up("panel[xtype=coursemanage.coursetable.mainlayout]");
        //var userRoleGrid = mainLayout.down("panel[xtype=user.userrolegrid]");
        var funData = mainLayout.funData;
        var deptId = funData.deptId;
        var info = "";
        var title = "";
        var url = "";
        switch (cmd) {
            case "use":
                info = "请选择要启用的课表";
                title = "确定要启用选择的课表吗？<br/><br/>（注：同一班级同一节次只能存在一条启用的课表）";
                url = funData.action + "/doCouseUse";
                break;
            case "unuse":
                info = "请选择禁用的课表";
                title = "确定要禁用选择的课表吗？";
                url = funData.action + "/doCouseUnUse";
                break;        
        }
        
        //选择的信息
        var selectInfo = mainGrid.getSelectionModel().getSelection();
        if (selectInfo.length == 0) {
            self.msgbox(info);
            return false;
        }
        

        //ajax的方式提交数据
        Ext.Msg.confirm('温馨提示', title, function(btn, text) {
            if (btn == 'yes') {
                //显示loadMask
                var myMask = self.LoadMask(mainGrid);

                //拼装所选择的用户
                var ids = new Array();
                var classTeachTimes = new Array();
                var teachTimes=new Array();
                var classIds=new Array();
                for(var i=0;i<selectInfo.length;i++){
                    var rec = selectInfo[i];

                    var pkValue = rec.get("uuid");
                    ids.push(pkValue);
                    teachTimes.push(rec.get("teachTime"));
                    classIds.push(rec.get("claiId"));

                    var classTeachTime = rec.get("teachTime")+"-"+rec.get("claiId");                
                    if(classTeachTimes.indexOf(classTeachTime)==-1){
                        classTeachTimes.push(classTeachTime);
                    }else{
                        self.Warning("同一个班级不允许同时启用同节次的课表");
                        myMask.hide();
                        return false;
                    }
                }

                //提交入库
                self.asyncAjax({
                    url: url,
                    params: {
                        ids: ids.join(","),
                        teachTimes:teachTimes.join(","),
                        classIds:classIds.join(",")
                    },
                    //loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) { 

                            switch (cmd) {
                                case "use":
                                    //静态的更新数据
                                    /*
                                    Ext.each(selectInfo, function(rec) {
                                        rec.set("extField05","1");    //改变数据
                                        rec.commit();   //提交一下 
                                    }, this);
                                    */
                                    mainGrid.getStore().loadPage(1);
                                    break;
                                case "unuse":
                                    //静态的更新数据
                                    Ext.each(selectInfo, function(rec) {
                                        rec.set("extField05","0");    //改变数据
                                        rec.commit();   //提交一下 
                                    }, this);
                                    break;
                            }            
                            self.msgbox(data.obj);      
                        }else{
                            self.Error(data.obj);   
                        }
                        myMask.hide();
                    },
                    failure: function(response) {           
                        Ext.Msg.alert('请求失败', '错误信息：\n' + response.responseText);           
                        myMask.hide();
                    }
                });              
            }
        });
    }, 
    hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="COURSETABLE";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridImport")==-1){
                var btnUse = grid.down("button[ref=gridImport]");
                btnUse.setHidden(true);
                
            }
            if(userBtn.indexOf(menuCode+"_gridDownExcel")==-1){
                var btnUse = grid.down("button[ref=gridDownExcel]");
                btnUse.setHidden(true);
                
            }
            if(userBtn.indexOf(menuCode+"_gridSetUse")==-1){
                var btnUse = grid.down("button[ref=gridSetUse]");
                btnUse.setHidden(true);
                
            }
            if(userBtn.indexOf(menuCode+"_gridSetUnUse")==-1){
                var btnUse = grid.down("button[ref=gridSetUnUse]");
                btnUse.setHidden(true);
                
            }
        }
    }
});