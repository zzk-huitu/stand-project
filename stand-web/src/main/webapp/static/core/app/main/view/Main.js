/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('core.main.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.ux.TabCloseMenu',
        //'core.main.view.menu.MainMenuIcon'
        'core.main.view.index.IndexMenuIcon'
    ],

    //controller: 'main.mainController',    //将其放入主视图viewport.js中
    //viewModel: 'main.mainModel',

    ui: 'navigation',   //将sass的src目录下的对应main.scss的对应目录改为main.view主题才会生效，一一对应。

    //tabBarHeaderPosition: 1,    //用来指定标题栏的位置  
    //titleRotation: 0,     //用来控制标题文本的显示方向
    tabRotation: 0,     //用来控制标签文本的显示方向
   // tabPosition: 'left',    //控制标签的位置
/*
    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },
*/
    /*
    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },*/

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },


    defaults: {
        bodyPadding: '10 10 0 10',
        closable : true,
        scrollable :true,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    scrollable :true, 

    plugins:{
        ptype: 'tabclosemenu',  
        closeTabText : '关闭当前',
        closeOthersTabsText : '关闭其他',
        closeAllTabsText : '关闭所有',
        extraItemsTail : ['-', {
            text : '可关闭',
            checked : true,
            hideOnClick : true,
            handler : function(item) {    
                currentItem.tab.setClosable(item.checked);
            }
        }],
        listeners : {
            aftermenu : function() {

            },
            beforemenu : function(menu, item) {        
                var menuitem = menu.child('*[text="可关闭"]');
                currentItem = item;
                menuitem.setChecked(item.closable);
                    
                //禁用我的桌面的关闭功能
                if(currentItem.itemId=='myHome'){
                    menuitem.setDisabled (true);
                }else{
                    menuitem.setDisabled (false);
                }
                
            }
        }
    },

    /*
    tabBar:{  
        items:[{
            xtype:'button',               
            text:'refresh',
            listeners:{
                'click':function(){
                    alert('you clicked a tab btn');
                }
            }
        }] 
    },
    */
/*
    items: [{
        title: '我的桌面',
        closable : false,
        iconCls: 'fa-home',
        scrollable :true, 
        layout:'fit',
        bodyPadding: 0,
        // The following grid shares a store with the classic version's grid as well!
        items: [{
            xtype: 'panel',
            bodyStyle: 'background:url("static/core/resources/images/welcome.jpg") center center / 100% 100% no-repeat',
            flex:1
            
        }]
    }],
*/
    initComponent : function() { 

        /*2017-12-12 【我的桌面的菜单数据，不在设置读取】
        //此代码用于在【我的桌面】放入图标按钮，现在隐藏
        var viweport=this.up("container[xtype=app-viewport]");  //获取主视图，然后再去取得它的viewport，
        
        //2017-9-19 暂时显示所有图标
        var systemMenus = viweport.getViewModel().get('systemMenu');  //而不能直接 this.getViewModel().get('systemMenu')，因为这个view没有声明viewModel
        var menus=[];
        //组装第二层子菜单
        for (var i in systemMenus) {  

            var childs = systemMenus[i].children;  
       
            menus.push.apply(menus,childs);
           
        }
        //2017-9-19 暂时关闭自定义桌面
        //var menus = viweport.getViewModel().get('myDeskMenu'); （自定义桌面：暂未用到）
        */

        this.items=[{
            title: '我的桌面',
            closable : false,
            iconCls: 'fa-home',
            scrollable :true, 
            itemId:'myHome',
            bodyStyle :{
                background: '#f0f0f0'
            },
            layout:'vbox',
            // The following grid shares a store with the classic version's grid as well!
            items: [{
                xtype:'container',
                height:200,
                width:'100%',
                layout:'vbox',
                style :{
                    background: '#fff',
                    margin:'10px 5px',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
                },
                items:[{
                    width:'100%',                
                    xtype:'container',
                    layout:'hbox',
                    items:[{
                        flex:1,
                        xtype:'container',
                        html:'常用功能',
                        style :{
                            background: '#fff',
                            padding:'20px',
                            fontSize:'18px',
                            fontWeight:'400',
                            color:'#333'
                        }
                    },{
                        //width:100,
                        xtype:'button',
                        tooltip: '设置常用功能', 
                        //text: '<span style="font-size: 14px;">设置</span>',
                        iconCls: 'x-fa fa-cog', 
                        //cls: 'core-header-button',                        
                        //overCls: '', 
                        focusCls : '', 
                        listeners:{
                            click:'onSetDeskFunction'
                        },
                
                    }]
                    
                },{
                    //flex:1,      
                    height:125,          
                    width:'100%',
                    //xtype: 'main.mainmenuicon',
                    //datas: menus, 
                    xtype: 'main.indexmenuicon', //加入新的界面                        
                    style :{
                        background: '#fff'
                    }
                }]
            },{
                xtype:'container',
                flex:1,
                width:'100%',
                minHeight:200,
                layout:'hbox',
                style :{
                    margin:'5px 0px 10px 0px',
                },
                items:[{
                    flex:1,
                    height:'100%',
                    xtype:'container',
                    layout:'vbox',
                    style :{
                        margin:'5px 10px 5px 5px',
                        padding:'0px 0px 10px 0px',
                        background: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
                    },
                    items:[{
                        width:'100%',                
                        xtype:'container',
                        html:'通知公告',
                        style :{
                            background: '#fff',
                            padding:'20px',
                            fontSize:'18px',
                            fontWeight:'400',
                            color:'#333',
                            borderBottom: '1px solid #deded9'
                        }
                    },{
                        flex:1,             
                        width:'100%',                        
                        xtype: 'main.indexnotice',                                        
                        style :{
                            background: '#fff'
                        }
                    }]

                },{ 
                    flex:1,
                    height:'100%',
                    xtype:'container',
                    layout:'vbox',
                    style :{
                        margin:'5px 5px 5px 10px',
                        padding:'0px 0px 10px 0px',
                        background: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)'
                    },
                    items:[{
                        width:'100%',
                        xtype:'container',
                        html:'待办申请 / <span style="color:#3ca2c2">公文</span>',
                        style :{
                            background: '#fff',
                            padding:'20px',
                            fontSize:'18px',
                            fontWeight:'400',
                            color:'#333',
                            borderBottom: '1px solid #deded9'
                        }
                    },{
                        flex:1,              
                        width:'100%',
                        xtype: 'main.indexnotice',                         
                        style :{
                            background: '#fff'
                        }
                    }]
                }]
            }]
        }];
        
        this.callParent(arguments);  
    }    
    
});
