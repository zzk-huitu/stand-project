Ext.define("core.main.view.HeaderSmall",{
    extend: "Ext.toolbar.Toolbar",
    requires: [
        'core.main.view.menu.ButtonMainMenu'
    ],

    cls: 'toolbar-btn-shadow',

    xtype: 'app-header-small',
    items: [{ 
        	xtype: 'tbtext',           
            html:'<div class="top_title">'+
                '<img class="index_logo" src="static/core/resources/images/login_logo.png" />'+
                '<img class="index_title" src="static/core/resources/images/index_title.png" />'+
            '</div>',
            /*
        	bind:{
				text: '{name}标题', 
        	},*/        
         	id: 'app-header-small-title' 
        },{
            // 2017/12/5 显示顶部第一层菜单
            xtype:'container',
            height:50,
            width:530,
            items:[{
                xtype:'toolbar',
                cls:'appHeader-btnTbar',
                style:{
                    background: 'none',
                    marginTop: '3px'
                }/*
                items:[
                    { 
                        //width:50,
                        height:90,
                        tooltip: '收起', 
                        text: '<span style="color:#fff;font-size: 14px;">收起</span>',
                        iconCls: 'icon_xitong header-button-color core-header-icon-size20', 
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
            tooltip: '展开', 
            text: '<span style="color:#fff;font-size: 14px;">展开</span>',
            iconCls: 'x-fa fa-angle-double-down header-button-color', 
            cls: 'core-header-button', 
            //overCls: '', 
            focusCls : '', 
            changeType:'mainbigheader',
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
                    //maxWidth:80,
                    //height:90,
                    tooltip: menugroup.text, 
                    text: '<span style="color:#fff;font-size: 14px;">'+menugroup.text+'</span>',
                    iconCls: menugroup.smallIcon+' header-button-color core-header-icon-size20', 
                    iconAlign:'left',
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
                //maxWidth:80,
                //height:90,
                arrowCls:'',
                //arrowAlign: 'bottom',
                tooltip: "更多", 
                text: '<span style="color:#fff;font-size: 14px;">更多</span>',
                iconCls: 'icon_moreMenu header-button-color core-header-icon-size20', 
                iconAlign:'left',
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