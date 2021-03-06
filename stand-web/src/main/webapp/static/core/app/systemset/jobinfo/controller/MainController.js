Ext.define("core.systemset.jobinfo.controller.MainController", {
    extend: "Ext.app.ViewController",
    alias: 'controller.systemset.jobinfo.maincontroller',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",
        formUtil: "core.util.FormUtil",
        gridActionUtil: "core.util.GridActionUtil",
        dateUtil: 'core.util.DateUtil'
    },
    init: function() {
    },
    control: {

        /*前端按钮权限控制*/
        // "basegrid[xtype=systemset.jobinfo.maingrid]": {
        //      afterrender: function (grid, eOpts) {
                
        //         //如果此值为1，则表明此人是超级管理员，不需要进行验证
        //         if(comm.get("isAdmin")!="1"){
        //             var menuCode="JOBINFO";     // 此菜单的前缀
        //             var userBtn=comm.get("userBtn");
        //             if(userBtn.indexOf(menuCode+"_gridAdd_Tab")==-1){
        //                 var btnAdd = grid.down("button[ref=gridAdd_Tab]");
        //                 btnAdd.setHidden(true);
        //             }
        //             if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
        //                 var btnEdit = grid.down("button[ref=gridEdit_Tab]");
        //                 btnEdit.setHidden(true);
        //             }
        //             if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
        //                 var btnDelete = grid.down("button[ref=gridDelete]");
        //                 btnDelete.setHidden(true);
        //             }
        //         }            
        //      }
        // },

    	/*可以直接使用公共方法*/
        // "basegrid button[ref=gridAdd_Tab]": {
        //     beforeclick: function(btn) {
        //         this.doDetail_Tab(btn,"add");
        //         return false;
        //     }
        // },

        // "basegrid button[ref=gridDetail_Tab]": {
        //     beforeclick: function(btn) {
        //         this.doDetail_Tab(btn,"detail");
        //         return false;
        //     }
        // },

        // "basegrid[xtype=systemset.jobinfo.maingrid] button[ref=gridEdit_Tab]": {
        //     beforeclick: function(btn) {
        //         this.doDetail_Tab(btn,"edit");
        //         return false;
        //     }
        // },

        // "basegrid[xtype=systemset.jobinfo.maingrid]  actioncolumn": {
        //     editClick_Tab:function(data){
        //         var baseGrid=data.view;
        //         var record=data.record;

        //         this.doDetail_Tab(null,"edit",baseGrid,record);

        //         return false;
        //     },
        //     detailClick_Tab:function(data){
        //         var baseGrid=data.view;
        //         var record=data.record;

        //         this.doDetail_Tab(null,"detail",baseGrid,record);

        //         return false;
        //     }
        // }
    },
    
    // doDetail_Tab:function(btn, cmd, grid, record) {
    //     var self = this;
    //     var baseGrid;
    //     var recordData;

    //     //根据点击的地方是按钮或者操作列，处理一些基本数据
    //     if (btn) {
    //         baseGrid = btn.up("basegrid");
    //     } else {
    //         baseGrid = grid;
    //         recordData = record.data;
    //     }

    //     //得到组件
    //     var funCode = baseGrid.funCode; //jobinfo_main
    //     var basePanel = baseGrid.up("basepanel[funCode=" + funCode +"]");
    //     var tabPanel=baseGrid.up("tabpanel[xtype=app-main]");   //获取整个tabpanel

    //     //得到配置信息
    //     var funData = basePanel.funData;
    //     var detCode =  basePanel.detCode;  
    //     var detLayout = basePanel.detLayout;
    //     var defaultObj = funData.defaultObj;
                
    //     //关键：打开新的tab视图界面的控制器
    //     var otherController = basePanel.otherController;
    //     if (!otherController)
    //         otherController = '';

    //     //处理特殊默认值
    //     var insertObj = self.getDefaultValue(defaultObj);
    //     var popFunData = Ext.apply(funData, {
    //         grid: baseGrid
    //     });

    //     //本方法只提供班级详情页使用
    //     var tabTitle = funData.tabConfig.addTitle;
    //     //设置tab页的itemId
    //     var tabItemId=funCode+"_gridAdd";     //命名规则：funCode+'_ref名称',确保不重复
    //     var pkValue= null;
    //     var operType = cmd;    // 只显示关闭按钮
    //     switch (cmd) {
    //         case "edit":
    //             if (btn) {
    //                 var rescords = baseGrid.getSelectionModel().getSelection();
    //                 if (rescords.length != 1) {
    //                     self.msgbox("请选择一条数据！");
    //                     return;
    //                 }
    //                 recordData = rescords[0].data;
    //             }
    //             //获取主键值
    //             var pkName = funData.pkName;
    //             pkValue= recordData[pkName];

    //             insertObj = recordData;
    //             tabTitle = funData.tabConfig.editTitle;
    //             tabItemId=funCode+"_gridEdit"; 
    //             break;
    //         case "detail":                
    //             if (btn) {
    //                 var rescords = baseGrid.getSelectionModel().getSelection();
    //                 if (rescords.length != 1) {
    //                     self.msgbox("请选择一条数据！");
    //                     return;
    //                 }
    //                 recordData = rescords[0].data;
    //             }
    //             //获取主键值
    //             var pkName = funData.pkName;
    //             pkValue= recordData[pkName];
    //             insertObj = recordData;
    //             tabTitle =  funData.tabConfig.detailTitle;
    //             tabItemId=funCode+"_gridDetail"+pkValue; 
    //             break;
    //     }

    //     //获取tabItem；若不存在，则表示要新建tab页，否则直接打开
    //     var tabItem=tabPanel.getComponent(tabItemId);
    //     if(!tabItem){
    //         //创建一个新的TAB
    //         tabItem=Ext.create({
    //             xtype:'container',
    //             title: tabTitle,
    //             //iconCls: 'x-fa fa-clipboard',
    //             scrollable :true, 
    //             itemId:tabItemId,
    //             itemPKV:pkValue,      //保存主键值
    //             layout:'fit', 
    //         });
    //         tabPanel.add(tabItem); 

    //         //延迟放入到tab中
    //         setTimeout(function(){
    //             //创建组件
    //             var item=Ext.widget("baseformtab",{
    //                 operType:operType,                            
    //                 controller:otherController,         //指定重写事件的控制器
    //                 funCode:funCode,                    //指定mainLayout的funcode
    //                 detCode:detCode,                    //指定detailLayout的funcode
    //                 tabItemId:tabItemId,                //指定tab页的itemId
    //                 insertObj:insertObj,                //保存一些需要默认值，提供给提交事件中使用
    //                 funData: popFunData,                //保存funData数据，提供给提交事件中使用
    //                 items:[{
    //                     xtype:detLayout,                        
    //                     funCode: detCode             
    //                 }]
    //             }); 
    //             tabItem.add(item);  
               
    //             //将数据显示到表单中（或者通过请求ajax后台数据之后，再对应的处理相应的数据，显示到界面中）             
    //             var objDetForm = item.down("baseform[funCode=" + detCode + "]");
    //             var formDeptObj = objDetForm.getForm();
    //             self.setFormValue(formDeptObj, insertObj);

    //             if(cmd=="detail"){
    //                 self.setFuncReadOnly(funData, objDetForm, true);
    //             }
    //         },30);
                           
    //     }else if(tabItem.itemPKV&&tabItem.itemPKV!=pkValue){     //判断是否点击的是同一条数据
    //         self.Warning("您当前已经打开了一个编辑窗口了！");
    //         return;
    //     }
    //     tabPanel.setActiveTab( tabItem);        
    // },  
});