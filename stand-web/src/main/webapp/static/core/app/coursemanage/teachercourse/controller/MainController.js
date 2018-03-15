Ext.define("core.coursemanage.teachercourse.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.coursemanage.teachercourse.maincontroller',
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

        //区域列表刷新按钮事件
        "panel[xtype=coursemanage.teachercourse.maintree] button[ref=gridRefresh]": {
            click: function(btn) {
                var baseGrid = btn.up("basetreegrid");
                var store = baseGrid.getStore();
                store.load();
                return false;
            }
        },
        "basetreegrid[xtype=coursemanage.teachercourse.maintree]": {
            /*
                当点击了这个树的子项后，在查询列表的条件中，要做如下工作：
                1. 附带树节点的相关参数
                2. 当存在basegrid的默认参数，则附带上去
                3. 附带快速搜索中的参数（为了防止文本框的数据与实际查询的数据不一致，所以在下面代码中主动获取了文本框的数据）
                4. reset清除高级搜索中的条件数据 以及 proxy.extraParams中的相关数据
            */
            itemclick: function(tree, record, item, index, e, eOpts) {
                this.loadMainGridStore(tree,record);
                return false;
           }
        },

        //添加任课教师
        "basegrid[xtype=coursemanage.teachercourse.maingrid] button[ref=gridAdd]": {
            beforeclick: function(btn) {
                this.doAdd_Win(btn,"add");
                return false;
            }
        },

         //替换添加任课教师
        "basegrid[xtype=coursemanage.teachercourse.maingrid] button[ref=gridReplaceTea]": {
            beforeclick: function(btn) {
                this.doAdd_Win(btn,"replace");
                return false;
            }
        },
          "basepanel basegrid[xtype=oursemanage.teachercourse.maingrid]": {
            afterrender : function(grid) {
            this.hideFuncBtn(grid);
          },
         },

    },

    doAdd_Win:function(btn,cmd){
        var self = this;
        var baseGrid=btn.up("basegrid");
        
        var courseId="";
        var uuid="";
        if(cmd=="replace"){        
            //得到选中数据
            var records = baseGrid.getSelectionModel().getSelection();
            if (records.length !=1) {
                self.Error("请选择要一名替换的教师!");
                return false;
            }
            courseId=records[0].get("courseId");
            uuid=records[0].get("uuid");
        }

        var basePanel = baseGrid.up("basepanel");

        //得到配置信息
        var funData = basePanel.funData;                //主界面的配置信息  
        var detCode =  basePanel.detCode;               //打开的tab也的detCode标识，可自定指定，用于查找唯一组件
        var detLayout = basePanel.detLayout;            //打开的tab页的布局视图
        
        var otherController = basePanel.otherController;    //关键：打开的tab页面的视图控制器
        if (!otherController)
            otherController = '';  
        var width = 1200;
        var height = 600;
        var iconCls= 'x-fa fa-plus-circle';
        var winTitle = "添加任课教师";
        var operType="add";
        var maximized=true;
        var xtypeItems= [{
            xtype: detLayout,
            funData: {}     //每次打开时重置此值
        }];
        detCode="addTeacher";

        if(cmd=="replace"){
            iconCls= 'x-fa fa-pencil-square';
            winTitle = "替换任课教师";
            operType="edit";
            maximized=false;
            width = 1000;
            height = 500;
            detCode="replaceTeacher";
            xtypeItems= [{
                xtype: detLayout,
                layout:'fit',
                items:[{
                    xtype: "coursemanage.teachercourse.courseteachergrid",
                    al:true,
                    flex:1,
                    extParams: {
                        whereSql: "",
                        courseId:courseId
                        //filter:"[{'type':'string','comparison':'=','value':'" + courseId + "','field':'courseId'}]"
                    },
                }],
                funData: {
                    uuid:uuid
                }
            }];
        }

        //创建tab内部组件                     
        var insertObj =  Ext.apply(new Object(),funData.defaultObj);
        var popFunData = Ext.apply(funData, {   //将一些必要的信息，统一存放于此，提高给处理提交代码使用。
            grid: baseGrid
        });


        var win = Ext.create('core.base.view.BaseFormWin', {
            iconCls:iconCls,
            title: winTitle,
            operType: operType,
            width: width,
            height: height,
            maximized:maximized,
            controller: otherController,
            funData: popFunData,
            funCode: detCode,
            baseGrid:baseGrid,
            insertObj: insertObj,        
            items: xtypeItems
        }).show();

        if(operType=="add"){
            var objForm = win.down("form");
            var formObj = objForm.getForm();
            formObj.findField("semester").setValue(comm.get("semester"));
        }

    },

    loadMainGridStore:function(tree,record){
       
        var self = this;
        var mainLayout = tree.up("basepanel[xtype=coursemanage.teachercourse.mainlayout]");

        var storeGrid = mainLayout.down("panel[xtype=coursemanage.teachercourse.maingrid]");
        var store = storeGrid.getStore();
        var proxy = store.getProxy();
        
        //获取右边筛选框中的条件数据
        var filter=self.getFastSearchFilter(storeGrid);  
        if(filter.length>0)
            filter = JSON.stringify(filter);
        else
            filter="";

        //获取点击树节点的参数            
        var deptId= record.get("id");
        var deptType=record.get("nodeType");
       
        //附带参赛
        proxy.extraParams={
            deptId:deptId,
            deptType:deptType,
            filter:filter
        }
        store.loadPage(1);
    },
    getFastSearchFilter:function(cpt){
        var girdSearchTexts = cpt.query("field[funCode=girdFastSearchText]");
        var filter=new Array();
        if(girdSearchTexts[0].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "xm", "comparison": ""})
        }
        if(girdSearchTexts[1].getValue()){
            filter.push({"type": "string", "value": girdSearchTexts[1].getValue(), "field": "courseName", "comparison": ""})
        }
        return filter;
    },
    hideFuncBtn:function(grid){
        if(comm.get("isAdmin")!="1"){
            var menuCode="TEACHERCOURSE";     // 此菜单的前缀
            var userBtn=comm.get("userBtn");
            if(userBtn.indexOf(menuCode+"_gridReplaceTea")==-1){
                var btnUse = grid.down("button[ref=gridReplaceTea]");
                btnUse.setHidden(true);
                
            }
        }
    },

    
});