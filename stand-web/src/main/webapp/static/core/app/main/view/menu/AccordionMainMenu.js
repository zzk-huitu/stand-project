Ext.define('core.main.view.menu.AccordionMainMenu', {  
    extend : 'Ext.panel.Panel',  
    alias : 'widget.main.mainmenuaccordion',  
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
    bodyStyle : {  
        padding : '0px',
        background:'#354d8b' 
    },  
    scrollable:'y', 
    layout : {  
        type : 'accordion',  
        titleCollapse : true, 
        animate : true  
    },       

    initComponent : function() {  
        this.items = [{
            hidden:true     //加入一个隐藏的panel，以致于下面的面板不会默认打开
        }];  

        var viweport=this.up("container[xtype=app-viewport]");  //获取主视图，然后再去取得它的viewport，
        var menus = viweport.getViewModel().get('systemMenu');  //而不能直接 this.getViewModel().get('systemMenu')，因为这个view没有声明viewModel

        // 2017/12/5 只显示第一个菜单的子项
        if(menus.length!=0){
            var menusItems=[];  
            var children=menus[0].children;
            //var children=menus;
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
                    //layout : 'fit', 
                    width:'100%',
                    //scrollable:'y',
                    bodyStyle:{
                        background: 'none',
                        overflow: 'overlay'
                    },
                    items:[]
                    /*    
                    dockedItems : [{  
                        dock : 'left',  
                        xtype : 'toolbar',
                        scrollable:'y', 
                        padding:0, 
                        margin: 0, 
                        width:'100%',   
                        items : []  
                    }],    */                    
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
                            viweport.controller.onMenuItemClick(null,header);
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
                                    viweport.controller.onMenuItemClick(null,button);
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
               
                this.items.push(accpanel);                      
            }            
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
}) 