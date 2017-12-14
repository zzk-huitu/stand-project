/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('core.main.controller.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main.mainController',
    mixins: {
        suppleUtil: "core.util.SuppleUtil",
        messageUtil: "core.util.MessageUtil",    
    },
   
    init: function() {
        var self = this;
        //在主视图中写一次，即可加载，重复在不同的是视图中写，会多次加载,造成事件方法会执行多次
        console.log("初始化controller");

        //初始化基本控制器
        var baseController =  Ext.create('core.base.controller.MainController');
        baseController.init();
        baseController.inited = true
        
        //console.log(this.getView().getViewModel().get('systemMenu' ));

        this.control({   //与以前一样的写法
            
            //只要一经声明，则该视图范围内生效
            /*
            "button": {
                click : function(btn) {
                    console.log(11);
                   
                }
            }
            */
        });
    },
    //若与其他控制器存在相同的方法名，则仅仅会执行这个view里面的事件
    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },


    //顶部head中的菜单按钮事件
    onChangeHeadMenu:function(btn){
        
        //若当前按钮，是FUNC和Frame，则打开窗口. 否则切换左侧的子菜单
        var viewport=this.getView();    
        var tabPanel=viewport.down("tabpanel[xtype=app-main]");
        var tabItem=tabPanel.getComponent(btn.menuCode);
        if(!tabItem){
            if(btn.menuType=="MENU"){
                
                /*------处理普通导航栏的显示-------*/
                var menuPanelItems=viewport.down("panel[xtype=main.mainmenupanel] menu");
                          
                var menusItems=[];  
                var children=btn.children;
                for(var j in children){
                    var menuChild = children[j];    
                    //小图标 
                    var smallIconCls=menuChild.smallIcon;
                    if (!smallIconCls) {
                        smallIconCls="x-fa fa-bars";
                    }

                    var menusItem={
                        //text:'<img src="/static/core/resources/images/icon/index_zhiwuguanli.png" class="mainMenu-img"/><span style="font-size:15px;font-family:微软雅黑">'+menugroup.text+'</span>',               
                        text:'<img src="'+menuChild.bigIcon+'" class="mainMenuPanel-img"/> '+menuChild.text,
                        textBase:menuChild.text,
                        //iconCls: "x-fa fa-link mainMenu-iconCls",
                        menuCode:menuChild.menuCode,
                        menuType: menuChild.menuType,  
                        children: menuChild.children,
                        smallIcon:menuChild.smallIcon,
                        bigIcon: menuChild.bigIcon,
                        menuTarget:menuChild.menuTarget,
                        menuParent:menuChild["parent"]
                    };
                    
                    //生成子项
                    if(menuChild.children.length!=0)
                        this.createMenu(menusItem,menuChild.children);                  

                    menusItems.push(menusItem);            
                }


                if(menusItems.length!=0){
                    menuPanelItems.removeAll();
                    menuPanelItems.add( menusItems); 
                }else{
                    Ext.Msg.alert('温馨提示', '此模块功能暂无子菜单！');
                }

                /*--------------处理手风琴导航栏的显示------------------
    
                var menuPanelItems=viewport.down("panel[xtype=main.mainmenuaccordion]");            
                var menusItems=[{
                    hidden:true     //加入一个隐藏的panel，以致于下面的面板不会默认打开
                }];  
                var children=btn.children;
                for(var j in children){
                    var menuChild = children[j];    
                    var menuNextChild = menuChild.children;

                    //小图标 
                    var smallIconCls=menuChild.smallIcon;
                    if (!smallIconCls) {
                        smallIconCls="x-fa fa-bars";
                    }
                    //标题
                    var header={
                        cls:'accordHeader',       
                        title : '<span style="color:#fff;font-size:14px;font-weight:400;">'+menuChild.text+'</span>', 
                        iconCls:smallIconCls,            
                        style:{
                            background:'#354d8b',
                            border:'none',
                            borderTop:'1px solid #4d5e8b',
                            borderBottom:'1px solid #4d5e8b',
                            cursor: 'pointer',
                            paddingLeft: '15px',
                        }                
                    };
                              
                    //整个panel面板              
                    var accpanel = { 
                        xtype : 'panel',                                              
                        header: header,
                        width:'100%',
                        //scrollable:'y',
                        bodyStyle:{
                            background: 'none',
                            overflow: 'overlay'
                        },
                        items:[]                                
                    };  

                    //判断是否为功能按钮
                    if( menuChild.menuType=="FUNC"){
                        var item={
                            textBase:menuChild.text,                                    
                            menuCode:menuChild.menuCode,
                            menuType: menuChild.menuType,  
                            children: menuChild.children,
                            smallIcon:menuChild.smallIcon,
                            bigIcon: menuChild.bigIcon,
                            menuTarget:menuChild.menuTarget,
                            menuParent:menuChild["parent"],
                        }
                        Ext.apply(header,item);                    

                        header.listeners={
                            click:function(header){                        
                                viewport.controller.onMenuItemClick(null,header);
                            }
                        };
                        accpanel.hideCollapseTool=true; 
                    }

                    if(menuNextChild.length>0){
                        for (var j in menuNextChild) {  
                            var menumodule = menuNextChild[j];  
                            accpanel.items.push({  
                                xtype : 'button',
                                height: 40,
                                width: '100%',
                                padding:'0 0 0 20',
                                text : this.addSpace(menumodule.text, 12),                                  
                                iconCls : menumodule.smallIcon,

                                textBase:menumodule.text,                                    
                                menuCode:menumodule.menuCode,
                                menuType: menumodule.menuType,  
                                children: menumodule.children,
                                smallIcon:menumodule.smallIcon,
                                bigIcon: menumodule.bigIcon,
                                menuTarget:menumodule.menuTarget,
                                menuParent:menumodule["parent"],
                                listeners:{
                                    click:function(button){
                                        viewport.controller.onMenuItemClick(null,button);
                                    }                            
                                }
                            });  
                        }  
                    }else if(menuChild.menuType=="MENU"){
                        accpanel.items.push({
                            xtype:'container',
                            padding:10,
                            style:{
                                color:'#fff'
                            },
                            html:'没有子菜单了'
                        });
                    }
                   
                    menusItems.push(accpanel);                      
                }     

                if(menusItems.length!=0){
                    menuPanelItems.removeAll();
                    menuPanelItems.add( menusItems); 
                }else{
                    Ext.Msg.alert('温馨提示', '此模块功能暂无子菜单！');
                }
                */
            }
            else  if(btn.menuType=="FUNC"){    
                
                //小图标 
                var smallIconCls=btn.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-bars";
                }
          
                var targetStr=btn.menuTarget.split(',');
                if(targetStr.length==2){                
                    try{           
                       
                        tabItem=Ext.create({
                            xtype:'container',
                            title: btn.menuText,
                            //iconCls: smallIconCls,
                            scrollable :true, 
                            itemId:btn.menuCode,
                            layout:'fit', 
                        });
                        tabPanel.add(tabItem);

                        //延迟放入到tab中
                        setTimeout(function(){
                            //创建组件
                            var item=Ext.widget(targetStr[0]); 
                            tabItem.add(item);

                            //tabPanel.getComponent(data.menuCode).add(tabItem);    //原始写法，不太好    
                        },30);
                                        


                    }catch(e){
                        Ext.Msg.alert('温馨提示', '此模块功能待开发中！');
                        console.log(e);
                        return false;
                    }
                }else{
                    Ext.Msg.alert('温馨提示', '加载失败，请联系管理员！');
                }

                tabPanel.setActiveTab( tabPanel.items.length-1);
            }
            else if(btn.menuType=="IFRAME"){
                //小图标 
                var smallIconCls=btn.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-link";
                }

                tabPanel.add({
                    title: btn.menuText,
                    //iconCls: smallIconCls,
                    scrollable :true, 
                    itemId:btn.menuCode,
                    layout:'fit',    
                    items: [{
                        xtype: 'container',                                                  
                        html:'<iframe src="http://www.baidu.com" width="100%" height="100%"   frameborder=0  ></iframe>'
                    }]
                });

                tabPanel.setActiveTab( tabPanel.items.length-1);
            }
           
           
        }else{
            tabPanel.setActiveTab( tabItem);
        }   
    },

    onExitSystem:function(){
        Ext.Msg.confirm('温馨提示', '确定要退出系统么?', function(btn, text) {
            if (btn == 'yes') {
                window.location.href = comm.get("baseUrl") + "/login/logout";
            }
        });
    },

    onWipeCache:function(btn){
        Ext.Msg.confirm('温馨提示', '确定要清除缓存么?', function(btn, text) {
            if (btn == 'yes') {
                //前台清理
                factory.DDCache.clearAll();
                //后台清理
                var suppUtil = Ext.create("core.util.MessageUtil");

                Ext.Ajax.request({
                    url: comm.get('baseUrl') + '/login/clearCache',
                    method: "POST",
                    async: true,
                    success: function(response) {
                        var resObj = Ext.decode(response.responseText);
                        if (resObj.success) {
                            suppUtil.msgbox(resObj.obj);
                        } else {
                            suppUtil.Error(resObj.obj)
                        }
                    },
                    failure: function(response) {
                        suppUtil.Error('数据请求出错了！！！！\n错误信息：\n' + response.responseText);
                    }
                })
            }
        });
    },

    onChangePassword:function(btn){
        Ext.widget("main.changepwd").show();
    },

    onChangeMainMenu:function(btn){
        this.getView().getViewModel().set("menuType.value",btn.changeType);
    },

    onChangeMainHeader:function(btn){
        this.getView().getViewModel().set("headerType.value",btn.changeType);
    },

    onSetDeskFunction:function(btn){
        //Ext.widget("main.deskfunction").show();
        var cmp=Ext.getCmp("app-deskfunction");
        if(!cmp)
            Ext.widget("main.deskfunction").show();
        else
            cmp.show();
    },

    /*
    *菜单栏显示子菜单
    */
    onViewIconItemClick:function(view,record,item,index){
        var viewport=this.getView();    
        var tabPanel=viewport.down("tabpanel[xtype=app-main]");
            
        var data=record.data;
        var tabItem=tabPanel.getComponent(data.menuCode);
        if(!tabItem){

            if(data.menuType=="MENU"){

                //小图标 
                var smallIconCls=data.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-th";
                }

                tabPanel.add({
                    title: data.text,
                    //iconCls: smallIconCls,
                    scrollable :true, 
                    itemId:data.menuCode,
                    // The following grid shares a store with the classic version's grid as well!
                    items: [{
                        xtype: 'main.mainmenuicon',
                        datas:data.children
                    }]
                });
            }
            else  if(data.menuType=="FUNC"){    
                
                //小图标 
                var smallIconCls=data.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-bars";
                }
          
                var targetStr=data.menuTarget.split(',');
                if(targetStr.length==2){                
                    try{           
                        //Ext.create(targetStr[1]); //不用创建controller         
                        //var application = coreApplication.getApplication();//也不用这样去获取
                        //application.getViewController(targetStr[1]);    //zzk：重写了aplication组件，使其支持getViewController方法
                        //最后声明：视图控制器会随着视图的创建而创建，销毁而销毁，不必手动去创建
                                             
                        
                        //zzk 2017-6-1：优化细节
                        tabItem=Ext.create({
                            xtype:'container',
                            title: data.text,
                            //iconCls: smallIconCls,
                            scrollable :true, 
                            itemId:data.menuCode,
                            layout:'fit', 
                        });
                        tabPanel.add(tabItem);

                        //zzk 2017-5-26：防止加载打开tab页面时卡顿
                        // tabPanel.add({   //原始写法，不太好
                        //     title: data.text,
                        //     //iconCls: smallIconCls,
                        //     scrollable :true, 
                        //     itemId:data.menuCode,
                        //     layout:'fit',                        
                        //     // The following grid shares a store with the classic version's grid as well!
                        //     //items: [tabItem]
                        // }); 

                        //延迟放入到tab中
                        setTimeout(function(){
                            //创建组件
                            var item=Ext.widget(targetStr[0]); 
                            tabItem.add(item);

                            //tabPanel.getComponent(data.menuCode).add(tabItem);    //原始写法，不太好    
                        },30);
                                        


                    }catch(e){
                        Ext.Msg.alert('温馨提示', '此模块功能待开发中！');
                        console.log(e);
                        return false;
                    }
                }else{
                    Ext.Msg.alert('温馨提示', '加载失败，请联系管理员！');
                }
            }
            else if(data.menuType=="IFRAME"){
                //小图标 
                var smallIconCls=data.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-link";
                }

                tabPanel.add({
                    title: data.text,
                    //iconCls: smallIconCls,
                    scrollable :true, 
                    itemId:data.menuCode,
                    layout:'fit',    
                    items: [{
                        xtype: 'container',                                                  
                        html:'<iframe src="http://www.baidu.com" width="100%" height="100%"   frameborder=0  ></iframe>'
                    }]
                });
            }
           
            tabPanel.setActiveTab( tabPanel.items.length-1);
        }else{
             tabPanel.setActiveTab( tabItem);
        }   
    },

    onMainMenuTreeClick:function(view,record){

        var viewport=this.getView();    
        var tabPanel=viewport.down("tabpanel[xtype=app-main]");
         
        var data=record.data;

        var tabItem=tabPanel.getComponent(data.menuCode);
        if(!tabItem){
            if(data.menuType=="MENU"){

                //图标 
                var smallIconCls="";
                if (!data.bigIcon) {
                    smallIconCls="x-fa fa-th";
                }

                tabPanel.add({
                    title: data.text,       

                    //icon: data.bigIcon,
                    //iconCls:smallIconCls+' MainMenuTreeIconStyle',

                    scrollable :true, 
                    itemId:data.menuCode,
                    // The following grid shares a store with the classic version's grid as well!
                    items: [{
                        xtype: 'main.mainmenuicon',
                        datas:data.children
                    }]
                });
            }
            else  if(data.menuType=="FUNC"){

                //图标 
                var smallIconCls="";
                if (!data.bigIcon) {
                    smallIconCls="x-fa fa-bars";
                }

                var targetStr=data.menuTarget.split(',');
                if(targetStr.length==2){
                    try{           
                        //Ext.create(targetStr[1]); //不用创建controller         
                        //var application = coreApplication.getApplication();//也不用这样去获取
                        //application.getViewController(targetStr[1]);    //zzk：重写了aplication组件，使其支持getViewController方法
                        //最后声明：视图控制器会随着视图的创建而创建，销毁而销毁，不必手动去创建
                        

                        //zzk 2017-5-26：防止加载打开tab页面时卡顿
                        tabItem=Ext.create({
                            xtype:'container',
                            title: data.text,
                            //iconCls: smallIconCls,
                            scrollable :true, 
                            itemId:data.menuCode,
                            layout:'fit', 
                        });
                        tabPanel.add(tabItem);

                        // tabPanel.add({
                        //     title: data.text,
                        //     //iconCls: smallIconCls,
                        //     scrollable :true, 
                        //     itemId:data.menuCode,
                        //     layout:'fit',                        
                        //     // The following grid shares a store with the classic version's grid as well!
                        //     //items: [tabItem]
                        // }); 

                        //延迟放入到tab中
                        setTimeout(function(){
                            //创建组件
                            var item=Ext.widget(targetStr[0]); 
                            tabItem.add(item);
                            //tabPanel.getComponent(data.menuCode).add(tabItem);        
                        },30);

                    }catch(e){
                        Ext.Msg.alert('温馨提示', '此模块功能待开发中！');
                        console.log(e);
                        return false;
                    }
                }else{
                    Ext.Msg.alert('温馨提示', '加载失败，请联系管理员！');
                }
            }
            else if(data.menuType=="IFRAME"){
        
                //图标 
                var smallIconCls="";
                if (!data.bigIcon) {
                    smallIconCls="x-fa fa-link";
                }

                tabPanel.add({
                    title: data.text,
                    
                    //icon: data.bigIcon,
                    //iconCls:smallIconCls+' MainMenuTreeIconStyle',

                    scrollable :true, 
                    itemId:data.menuCode,
                    layout:'fit',    
                    items: [{
                        xtype: 'container',                                                  
                        html:'<iframe src="http://www.baidu.com" width="100%" height="100%"   frameborder=0  ></iframe>'
                    }]
                });
            }
           
            tabPanel.setActiveTab( tabPanel.items.length-1);
        }else{
             tabPanel.setActiveTab( tabItem);
        }   
    },
    
    onMenuItemClick:function(menu,item){
            
        if(!item){
            return false;
        }
        
        //这个菜单，默认点击不了第二层
        // if(item.menuType=="MENU"&&item.menuParent=="ROOT"){  
        //     return false;
        // }
        if(item.menuType=="MENU"&&item.menu){  
            return false;
        }

        var viewport=this.getView();    
        var tabPanel=viewport.down("tabpanel[xtype=app-main]");
         
       
        var tabItem=tabPanel.getComponent(item.menuCode);
        if(!tabItem){

            //小图标 
            var smallIconCls=item.smallIcon;
            if (!smallIconCls) {
                smallIconCls="x-fa fa-th";
            }

            if(item.menuType=="MENU"){
                tabPanel.add({
                    title: item.textBase,
                    //iconCls: smallIconCls,
                    scrollable :true, 
                    itemId:item.menuCode,
                    // The following grid shares a store with the classic version's grid as well!
                    items: [{
                        xtype: 'main.mainmenuicon',
                        datas:item.children
                    }]
                });
            }
            else  if(item.menuType=="FUNC"){    
                
                //小图标 
                var smallIconCls=item.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-bars";
                }
                /*以下方式不行，找到的controller的真实路径总带有Controller，与我们目录结构不符合*/
                //var application = coreApplication.getApplication();
                //var mycontrol = application.getController('core.good.news.controller.MainController');
                
                //使用create的方式来创建控制器，在控制器中使用了一个静态变量来防止多次初始化。
                //var myController =  Ext.create('core.good.news.controller.MainController');
                //myController.init();  //mainLayout中直接使用了控制器，所以，不必再手动init了;
          
                var targetStr=item.menuTarget.split(',');
                if(targetStr.length==2){                   

                    try{     
                        
                        //Ext.create(targetStr[1]); //不用创建controller         
                        //var application = coreApplication.getApplication();//也不用这样去获取
                        //var controller=application.getViewController(targetStr[1]);    //zzk：重写了aplication组件，使其支持getViewController方法
                        //最后声明：视图控制器会随着视图的创建而创建，销毁而销毁，不必手动去创建
                     

                        //zzk 2017-5-26：防止加载打开tab页面时卡顿
                        tabItem=Ext.create({
                            xtype:'container',
                            title: item.textBase,
                            //iconCls: smallIconCls,
                            scrollable :true, 
                            itemId:item.menuCode,
                            layout:'fit', 
                        });
                        tabPanel.add(tabItem);

                        // tabPanel.add({
                        //     title: item.textBase,
                        //     //iconCls: smallIconCls,
                        //     scrollable :true, 
                        //     itemId:item.menuCode,
                        //     layout:'fit',                        
                        //     // The following grid shares a store with the classic version's grid as well!
                        //     //items: [tabItem]
                        // }); 

                        //延迟放入到tab中
                        setTimeout(function(){
                            //创建组件
                            var item=Ext.widget(targetStr[0]); 
                            tabItem.add(item);
                            //tabPanel.getComponent(item.menuCode).add(tabItem);        
                        },30);

                    }catch(e){
                        Ext.Msg.alert('温馨提示', '此模块功能待开发中！！');
                        console.log(e);
                        return false;
                    }

                }else{
                    Ext.Msg.alert('温馨提示', '加载失败，请联系管理员！');
                }
            }
            else if(item.menuType=="IFRAME"){
                //小图标 
                var smallIconCls=item.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-link";
                }
                
                tabPanel.add({
                    title: item.textBase,
                    //iconCls: smallIconCls,
                    scrollable :true, 
                    itemId:item.menuCode,
                    layout:'fit',    
                    items: [{
                        xtype: 'container',                                                  
                        html:'<iframe src="http://www.baidu.com" width="100%" height="100%"   frameborder=0  ></iframe>'
                    }]
                });
            }
           
            tabPanel.setActiveTab( tabPanel.items.length-1);
        }else{
             tabPanel.setActiveTab( tabItem);
        }   
    },

    //递归创建下级menu
    createMenu:function(currentMenuItem,currentChild){
        var menuSecondItem=[];
        for(var k in  currentChild){
            var secondChild = currentChild[k];    
             //小图标 
            var smallIconCls=secondChild.smallIcon;
            if (!smallIconCls) {
                smallIconCls="x-fa fa-bars";
            }

            var menuItem={
                //text:'<img src="'+menuChild.bigIcon+'" class="mainMenuPanel-img" style="width:20px;height:20px;margin-top: 5px;"/> '+menuChild.text,
                text:secondChild.text,
                textBase:secondChild.text,
                //iconCls: "x-fa fa-bars",
                iconCls:smallIconCls+" mainMenuIconCls",
                menuCode:secondChild.menuCode,
                menuType: secondChild.menuType,  
                children: secondChild.children,
                smallIcon:secondChild.smallIcon,
                bigIcon: secondChild.bigIcon,
                menuTarget:secondChild.menuTarget,
                menuParent:secondChild["parent"]
            };

            if(secondChild.children.length!=0)
                this.createMenu(menuItem,secondChild.children);   

            menuSecondItem.push(menuItem);
        }

        if(menuSecondItem.length>0){
            currentMenuItem.menu={
                defaults:{
                    padding:'3',
                    cls:'mainMenuSecondItemCls',              
                },
                items:menuSecondItem,                
                listeners:{
                    click:'onMenuItemClick'
                }
            }
        }    
    },
    addSpace : function(text, len) {                  
        var result = text;  
        for (var i = text.length; i < len; i++) {  
            result += '　';  
        }  
        return result;  
    },

}); 
