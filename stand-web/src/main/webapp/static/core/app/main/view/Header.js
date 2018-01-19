Ext.define("core.main.view.Header",{
    extend: "Ext.toolbar.Toolbar",
    requires: [
        'core.main.view.menu.ButtonMainMenu'
    ],

    cls: 'toolbar-btn-shadow',

    xtype: 'app-header',
    items: [{ 
        	xtype: 'tbtext',
            width:410,           
            html:'<div class="top_title">'+
                '<img class="index_logo" src="static/core/resources/images/login_logo.png" />'+
                '<img class="index_title" src="static/core/resources/images/index_title.png" />'+
            '</div>',
            /*
        	bind:{
				text: '{name}标题', 
        	},*/
         
         	id: 'app-header-title' 
        },{ // 2017/12/5 显示顶部第一层菜单
            xtype:'container',
            height:100,
            width:430,
            items:[{
                xtype:'toolbar',
                cls:'appHeader-btnTbar',
                style:{
                    background: 'none'
                }/*
                items:[
                    { 
                        //width:50,
                        height:90,
                        tooltip: '收起', 
                        text: '<span style="color:#fff;font-size: 14px;">收起</span>',
                        iconCls: 'icon_xitong header-button-color core-header-icon-size50', 
                        iconAlign:'top',
                        cls: 'core-header-button', 
                        //overCls: '', 
                        focusCls : '', 
                        changeType:'mainsmallheader',
                        listeners:{
                            click:'onChangeMainHeader' 
                        },
                        //handler: 'onChangePassword' 
                    }
                ]*/
            }]
        },
        '->',{
            xtype:'container',
            height:100,
            layout:'vbox',
            items:[{
                flex:1,
                width:'100%',
                xtype:'toolbar',
                cls:'appHeader-btnTbar',
                style:{
                    background: 'none'
                },
                items:[
                    '->',
                    { 
                        tooltip: '收起', 
                        text: '<span style="color:#fff;font-size: 14px;">收起</span>',
                        iconCls: 'x-fa fa-angle-double-up header-button-color', 
                        cls: 'core-header-button', 
                        //overCls: '', 
                        focusCls : '', 
                        changeType:'mainsmallheader',
                        listeners:{
                            click:'onChangeMainHeader' 
                        },
                        //handler: 'onChangePassword' 
                    },
                    { 
                        tooltip: '清除缓存', 
                        text: '<span style="color:#fff;font-size: 14px;">清除缓存</span>',
                        iconCls: 'x-fa fa-eraser header-button-color', 
                        cls: 'core-header-button', 
                        //overCls: '', 
                        focusCls : '', 
                        listeners:{
                            click:'onWipeCache'
                        },
                        //handler: 'onChangePassword' 
                    },
                    { 
                        tooltip: '修改密码', 
                        text: '<span style="color:#fff;font-size: 14px;">修改密码</span>',
                        iconCls: 'x-fa fa-key header-button-color', 
                        cls: 'core-header-button', 
                        //overCls: '', 
                        focusCls : '', 
                        listeners:{
                            click:'onChangePassword' 
                        },
                        //handler: 'onChangePassword' 
                    },
                    { 
                        tooltip: '退出', 
                        text: '<span style="color:#fff;font-size: 14px;">退出</span>',
                        cls: 'core-header-button', 
                        //overCls: '', 
                        focusCls : '', 
                        iconCls: 'x-fa fa-sign-out header-button-color', 
                        listeners:{
                            click:'onExitSystem' 
                        },
                        //handler: 'onExitSystem' 
                    }
                ]
            },{
                flex:1,
                xtype: 'tbtext',
                bind:{
                    html: '<div class="index_welcome">'+
                        '<img src="static/core/resources/images/index_user_icon.png" width="20px" />'+
                        '<span>欢迎您，{currentUser}！ 今天是{currentDateWeek} | 当前在线人数：{onlineNum}人</span>'+
                    '</div>', 
                },
            }]
        } 
    ],
    // 2017/12/5 显示顶部第一层菜单
    initComponent : function() { 
        
        var datas = []; 
        var viweport=this.up("container[xtype=app-viewport]");  //获取主视图，然后再去取得它的viewport，
        var menus = viweport.getViewModel().get('systemMenu');  //而不能直接 this.getViewModel().get('systemMenu')，因为这个view没有声明viewModel
       
        var counter=0;
        var menusItems=[];  //大菜单
        var moneyMenusItems=[]; //小菜单
        //组装第一层菜单(只显示4个菜单，其他的放到更多里面)
        for (var i in menus) {  
            var menugroup = menus[i];  

            if(counter<4){
                var menusItem={ 
                    maxWidth:80,
                    height:90,
                    tooltip: menugroup.text, 
                    text: '<span style="color:#fff;font-size: 14px;">'+menugroup.text+'</span>',
                    iconCls: menugroup.smallIcon+' header-button-color core-header-icon-size50', 
                    iconAlign:'top',
                    cls: 'core-header-button', 
                    //overCls: '', 
                    focusCls : '', 
                    listeners:{
                        click:'onChangeHeadMenu' 
                    },
                    children: menugroup.children,
                    menuText:menugroup.text,
                    menuCode:menugroup.menuCode,
                    menuType: menugroup.menuType, 
                    menuTarget: menugroup.menuTarget
                }
                menusItems.push(menusItem);

            }else{
                var menusItem={ 
                    tooltip: menugroup.text, 
                    text: menugroup.text,
                    iconCls: menugroup.smallIcon+' header-button-color', 
                    iconAlign:'left',
                    cls: 'core-header-button', 
                    focusCls : '', 
                    listeners:{
                        click:'onChangeHeadMenu' 
                    },
                    children: menugroup.children,
                    menuText:menugroup.text,
                    menuCode:menugroup.menuCode,
                    menuType: menugroup.menuType, 
                    menuTarget: menugroup.menuTarget, 
                }
                moneyMenusItems.push(menusItem);
            }

            counter++;
        }  

        //加入更多
        if(moneyMenusItems.length!=0){    
            menusItems.push({ 
                maxWidth:80,
                height:90,
                arrowCls:'',
                //arrowAlign: 'bottom',
                tooltip: "更多", 
                text: '<span style="color:#fff;font-size: 14px;">更多</span>',
                iconCls: 'icon_moreMenu header-button-color core-header-icon-size50', 
                iconAlign:'top',
                cls: 'core-header-button', 
                //overCls: '', 
                focusCls : '',          
                menu:moneyMenusItems
            })
        }

        this.items[1].items[0].items=menusItems;
        this.callParent();  
    },  
});