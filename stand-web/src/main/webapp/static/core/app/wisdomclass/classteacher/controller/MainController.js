Ext.define("core.wisdomclass.classteacher.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.wisdomclass.classteacher.maincontroller',
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
    	    
        //区域列表刷新按钮事件
        "panel[xtype=wisdomclass.classteacher.maintree] button[ref=gridRefresh]": {
            click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                store.load();
                return false;
            }
        },
        "basetreegrid[xtype=wisdomclass.classteacher.classtree]": {
            itemclick: function(tree, record, item, index, e, eOpts) { 
            	this.loadMainGridStore(tree,record);                
                return false; 
             }
        },

        "basegrid[xtype=wisdomclass.classteacher.maingrid] button[ref=gridAdd_Tab]": {
            beforeclick: function(btn) {            
                var baseGrid = btn.up("panel[xtype=wisdomclass.classteacher.maingrid]");
                var funCode = baseGrid.funCode;
                var basePanel = baseGrid.up("basepanel[funCode=" + funCode + "]");
                var funData = basePanel.funData;
                var deptType = funData.deptType;
               

                if (deptType != "05") {
                    this.Warning("请选择班级！");
                    return false;
                }

                //注入班级id值
                funData.defaultObj.claiId=funData.deptId;
            }
        },

        "basegrid[xtype=wisdomclass.classteacher.maingrid] button[ref=gridOut]": {
            beforeclick: function(btn) {  
                this.doSetOut(btn); 
            }
        },
        "basepanel basegrid[xtype=wisdomclass.classteacher.maingrid]": {
            afterrender : function(grid) {
             if(comm.get("isAdmin")!="1"){
            var menuCode="CLASSTEACHER";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridOut")==-1){
                var btnUse = grid.down("button[ref=gridOut]");
                btnUse.setHidden(true);
                
                    }
                }
            },
        },


    },

    loadMainGridStore:function(tree,record){
        var self=this;
        var mainLayout = tree.up("panel[xtype=wisdomclass.classteacher.mainlayout]");
        var deptType = record.get("nodeType");
        var deptId = record.get("id");

        Ext.apply(mainLayout.funData, {
            deptId: deptId,
            deptType: deptType,
            deptName: record.get("text"),
        });
    
        var roomGrid = mainLayout.down("panel[xtype=wisdomclass.classteacher.maingrid]");

        //获取右边筛选框中的条件数据
//       var filter=self.getFastSearchFilter(roomGrid);
        //var filter = new Array();
        //额外必须的参数
        //filter.push({"type":"string","comparison":"=","value":areaId,"field":"claiId"});                
    
        var store = roomGrid.getStore();
        var proxy = store.getProxy();
        //附带参赛
        proxy.extraParams={
            deptId:deptId,
            deptType:deptType,
            //filter:JSON.stringify(filter)
        }
        store.loadPage(1); // 给form赋值
        
        
    },

    doSetOut:function(btn){
        var self = this;
        var mainGrid = btn.up("basegrid");
        var mainLayout = mainGrid.up("panel[xtype=wisdomclass.classteacher.mainlayout]");
        //var userRoleGrid = mainLayout.down("panel[xtype=user.userrolegrid]");
        var funData = mainLayout.funData;
        var deptId = funData.deptId;
    
        //选择的信息
        var selectInfo = mainGrid.getSelectionModel().getSelection();
        if (selectInfo.length == 0) {
            self.msgbox("请选择要解除班主任的教师");
            return false;
        }
        

        //ajax的方式提交数据
        Ext.Msg.confirm('温馨提示', "您确定要执行解除班主任操作吗？", function(btn2, text) {
            if (btn2 == 'yes') {
                //显示loadMask
                var myMask = self.LoadMask(mainGrid);

                //拼装所选择的用户
                var ids = new Array();;
                Ext.each(selectInfo, function(rec) {
                    var pkValue = rec.get("uuid");
                    ids.push(pkValue);
                });

                //提交入库
                self.asyncAjax({
                    url:  comm.get("baseUrl") + "/ClassTeacher/doOut",
                    params: {
                        ids: ids.join(",")
                    },
                    //loadMask:true,
                    //回调代码必须写在里面
                    success: function(response) {
                        data = Ext.decode(Ext.valueFrom(response.responseText, '{}'));

                        if (data.success) {                         
                            self.msgbox(data.obj);   
                            var store = mainGrid.getStore();
                            //如果当前页的数据量和删除的数据量一致，则翻到上一页
                            if(store.getData().length==selectInfo.length&&store.currentPage>1){    
                                store.loadPage(store.currentPage-1);
                            }else{
                                store.remove(selectInfo); //不刷新的方式
                            }
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
    }
    
});