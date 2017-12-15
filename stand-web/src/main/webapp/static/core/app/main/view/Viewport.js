Ext.define('core.main.view.Viewport', {
    extend: 'Ext.container.Container',

    xtype: 'app-viewport',
    requires: [
        'core.base.controller.MainController',
        'core.main.controller.MainController',
        'core.main.model.MainModel',
        'Ext.layout.container.VBox',
        'Ext.plugin.Viewport',
        "core.main.view.Main",
        "core.main.view.Header",  
        "core.main.view.HeaderSmall",        
        //"core.main.view.Footer",
        //"core.main.view.menu.MainMenu",       
        "core.main.view.ChangePwd",

        //"core.train.teacher.view.DetailHtmlPanel" //若要使在sass-src目录下定义的样式生效，则必须要将文件加载。
        //"core.good.activity.view.MainLayout"  //只有当需要的js文件 requires进来的时候，才会被自动打包
    ],

    controller: 'main.mainController',
    viewModel: 'main.mainModel',

    /*设置最小宽度*/
    minWidth:1000,
   // scrollable:true,
    initComponent : function() {  
        var me = this;
        
        //加载菜单
        Ext.Ajax.request({
            url: comm.get('baseUrl')+'/SysUser/getUserMenuTree',
            method: "POST",
            async: false,
            timeout: 60000,        
            params:{
                excludes:'checked'
            },  
            success: function(response, opts  ) {
                try{
                    var result = Ext.decode(response.responseText);    
                    //console.log(result);
                    if(result.success==false){
                        Ext.MessageBox.show({
                            title: "警告",
                            msg: result.obj,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING,
                            fn: function(btn) {
                                location.reload()                                 
                            }
                        });      
                    }else{
                        me.getViewModel().set('systemMenu' , result);

                        

                        //以下方法，用来判断，用户是否拥有默认的桌面菜单权限，有则显示（自定义桌面：暂未用到）
                        // function searchChild(childObj,code){
                        //     for(var i=0;i<childObj.length;i++){
                        //         var currentObj=childObj[i];
                        //         if(code==currentObj.menuCode){
                        //             return true;
                        //         }

                        //         if(currentObj.children.length>0){
                        //             return searchChild(currentObj.children);                                
                        //         }
                        //     }
                        //     return false;
                        // }
                        //根据有权限的菜单，来判断这几个菜单，应该显示哪些
                        // var myDeskMenu=me.getViewModel().get('myDeskMenu');
                        // var currentMenu=[];                    
                        // for(var i=0;i<myDeskMenu.length;i++){
                        //     var code=myDeskMenu[i].menuCode;

                        //     for(var j=0;j<result.length;j++){
                        //         var currentResult=result[j];
                        //         if(code==currentResult.menuCode){
                        //             currentMenu.push(myDeskMenu[i]);
                        //             break;
                        //         }
                                
                        //         if(currentResult.children.length>0){
                        //             //递归查询子菜单
                        //             var isExist=searchChild(currentResult.children,code);
                        //             if(isExist==true){                                    
                        //                 currentMenu.push(myDeskMenu[i]);
                        //                 break;
                        //             }
                        //         }
                        //     }
                        // }
                        // me.getViewModel().set('myDeskMenu',currentMenu);
                    }
                }catch(err){
                    //如果出现错误，则表明返回的不是json数据，所以，回到登录界面
                    window.location.href = comm.get("baseUrl") + "/login.jsp";
                }
            },

            failure: function(response, opts) {
                 console.log('server-side failure with status code ' + response.status);
                 //如果出现错误，则表明返回的不是json数据，所以，回到登录界面
                 window.location.href = comm.get("baseUrl") + "/login.jsp";
            }
        });

        //获取在线人数
        Ext.Ajax.request({
            url: comm.get('baseUrl')+'/login/getOnlineCount',
            method: "POST",
            async: false,
            timeout: 60000,                    
            success: function(response, opts) {
                try{
                    var obj = Ext.decode(response.responseText);
                    //console.log(obj);
                    me.getViewModel().set('onlineNum' , obj.obj);   //此值后台返回
                }catch(err){
                    //如果出现错误，则表明返回的不是json数据，所以，回到登录界面
                    window.location.href = comm.get("baseUrl") + "/login.jsp";
                }
            },

            failure: function(response, opts) {
                 console.log('server-side failure with status code ' + response.status);
            }
        });

        me.getViewModel().set('currentUser' , comm.get("xm"));

        this.callParent(arguments);  
    },
    layout:  'border',
    items : [{  
            xtype: 'app-header',
            height: 100,
            padding:0,  
            id: 'app-header',
            region : 'north', // 把他放在maintop的下面  
            bind:{
                hidden:'{!isMainBigHeader}'
            },  
        },{  
            xtype: 'app-header-small',
            height: 50,
            padding:0,  
            id: 'app-header-small',
            region : 'north', // 把他放在maintop的下面  
            hidden:true,
            bind:{
                hidden:'{!isMainSmallHeader}'
            },  
        },{  
            xtype : 'main.mainmenutree',  
            region : 'west', // 左边面板  
            width : 200,          
            split : true,
            collapsible:true,            
            hidden:true,
            bind:{
                hidden:'{!isMainMenuTree}'
            }, 
            style:{
                paddingRight:'3px'
            }          
        },{  
            xtype : 'main.mainmenupanel',   
            region : 'west', // 左边面板  
            width : 200,          
            split : true,
            collapsible:true,
            bind:{
                hidden:'{!isMainMenu}'
            }, 
            style:{
                paddingRight:'3px'
            }         
        }, {  
            region : 'center', // 中间面版  
            xtype: 'app-main',
            minWidth:800,
            style:{
                paddingLeft:'2px'
            }
        }, {  
            region : 'south', // 中间面版  
            xtype: 'app-footer',
            height:30
        }]  
});