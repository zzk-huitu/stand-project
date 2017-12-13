

Ext.define('core.main.view.menu.MainMenuPanel', {  
    extend : 'Ext.panel.Panel',   //直接使用view，之前是view作为item，但是有bug
 
    alias : 'widget.main.mainmenupanel',         
    
    title : '功能菜单', 

    //iconCls:'x-fa fa-calendar-minus-o',
    header: {            
        title : '功能菜单',  
        iconCls:'x-fa fa-list',
        cls:'core-header-menu',
        items: [
            { 
                xtype: 'button', 
                padding:'0 5 0 0',
                cls: 'core-header-button', 
                iconCls: 'x-fa fa-toggle-on', 
                listeners:{
                    click:'onChangeMainMenu'
                },
                //handler: 'onChangeMainMenu',
                changeType:'mainmenutree',
                tooltip: '切换菜单' 
            }
        ]
    },
    
    layout:'fit',
 
    items:[{
        xtype:'menu',
        cls:'mainMenuCls',
        style:{
            border:0
        },
        plain: true,
        floating: false,  // usually you want this set to True (default)
        items: [],
        defaults:{
             padding:'15 10',
             cls:'mainMenuItemCls',                     
        },
        listeners:{
            click:'onMenuItemClick'
        }
    }/*{
        xtype:'menu',
        plain: true,
        floating: false,  // usually you want this set to True (default)
        items: [{
            text: 'plain item 1',
            iconCls:'x-fa fa-list'
        },{
            text: 'plain item 2'
        },{
            text: 'plain item 2'
        },{
            text: 'plain item 3',
            menu: {
                items: [
                    { text: 'plain item 1'} ,
                    { text: 'plain item 1'} ,   
                    { text: 'plain item 1'} ,
                    { text: 'plain item 1'} ,
                    { text: 'plain item 1'} ,
                    { text: 'plain item 1'} , 
                ]
            }
        }],
        listeners:{
            click:function( menu , item ){
                console.log(item);
            }
        } 
    }*/],
  
   
    initComponent : function() { 

               
       
        var datas = []; 
        var viweport=this.up("container[xtype=app-viewport]");  //获取主视图，然后再去取得它的viewport，
        var menus = viweport.getViewModel().get('systemMenu');  //而不能直接 this.getViewModel().get('systemMenu')，因为这个view没有声明viewModel
        
        /* 2017/12/5 去除了全部显示的方式
        var menusItems=[];
        //组装第一层菜单
        for (var i in menus) {  
            var menugroup = menus[i];  
            var children=menugroup.children;

            var menusItem={
                //text:'<img src="/static/core/resources/images/icon/index_zhiwuguanli.png" class="mainMenu-img"/><span style="font-size:15px;font-family:微软雅黑">'+menugroup.text+'</span>',               
                text:'<img src="'+menugroup.bigIcon+'" class="mainMenuPanel-img"/> '+menugroup.text,
                textBase:menugroup.text,
                //iconCls: "x-fa fa-link mainMenu-iconCls",
                menuCode:menugroup.menuCode,
                menuType: menugroup.menuType,  
                children: menugroup.children,
                smallIcon:menugroup.smallIcon,
                bigIcon: menugroup.bigIcon,
                menuTarget:menugroup.menuTarget,
                menuParent:menugroup["parent"]
            };

            var menuSecondItem=[];
            for(var j in children){
                var menuChild = children[j];    
                //小图标 
                var smallIconCls=menuChild.smallIcon;
                if (!smallIconCls) {
                    smallIconCls="x-fa fa-bars";
                }

                menuSecondItem.push({
                    //text:'<img src="'+menuChild.bigIcon+'" class="mainMenuPanel-img" style="width:20px;height:20px;margin-top: 5px;"/> '+menuChild.text,
                    text:menuChild.text,
                    textBase:menuChild.text,
                    //iconCls: "x-fa fa-bars",
                    iconCls:smallIconCls+" mainMenuIconCls",
                    menuCode:menuChild.menuCode,
                    menuType: menuChild.menuType,  
                    children: menuChild.children,
                    smallIcon:menuChild.smallIcon,
                    bigIcon: menuChild.bigIcon,
                    menuTarget:menuChild.menuTarget,
                    menuParent:menuChild["parent"]
                });
            }

            if(menuSecondItem.length>0){
                menusItem.menu={
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
            menusItems.push(menusItem);
        }*/ 

        // 2017/12/5 只显示第一个菜单的子项
        if(menus.length!=0){
            var menusItems=[];  
            var children=menus[0].children;

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
                
                if(menuChild.children.length!=0)
                    this.createMenu(menusItem,menuChild.children);

                menusItems.push(menusItem);            
            }

            this.items[0].items=menusItems;
        }
                
        this.callParent(arguments);  
    },  

    addSpace : function(text, len) {  
        var result = text;  
        for (var i = text.length; i < len; i++) {  
            result += '　';  
        }  
        return result;  
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
    }
}) 