/*
图标子菜单，用于显示第二层的图标菜单
*/
Ext.define('core.main.view.index.IndexMenuIcon', {  
    extend : 'Ext.view.View',  
    
    alias : 'widget.main.indexmenuicon',  
    //title : '功能菜单',  
    //iconCls:'x-fa fa-calendar-minus-o',
    id: 'app-indexmenuicon',

    viewModel : 'main.mainModel',  
    
    tpl:new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="mainMenuIcon-wrap" style="padding: 5px 0px 5px 0px;height:125px">',
                '<tpl if="taskNumber != null ">',  // <-- Note that the > is encoded
                    '<span class="mainMenuIcon-tag">{taskNumber}</span>',
                '</tpl>',
                '<tpl if="bigIcon !=\'\' ">',  // <-- Note that the > is encoded
                    '<img src="{bigIcon}" class="mainMenuIcon-img"/>',
                '<tpl elseif="iconCls !=\'\' ">',
                    '<i class="{iconCls} mainMenuIcon-icon" aria-hidden="true"></i>', 
                '<tpl else>',
                    '<i class="fa fa-calendar-minus-o mainMenuIcon-icon" aria-hidden="true"></i>',
                '</tpl>',            
                '<br/><span class="mainMenuIcon-text">{text}</span>',
            '</div>',
        '</tpl>'
    ),
    itemSelector: 'div.mainMenuIcon-wrap',

    emptyText: '<span style="width: 100%;text-align: center;display: inline-block;line-height: 100px;">当前没有可显示的子菜单！</span>',
    
    scrollable :true,
    datas:[],   //菜单项
    
    initComponent : function() {  
        var me =this;
        /*
        //加入读取任务数值的数据
        var iconStore=Ext.create('Ext.data.Store', {
            fields: [
                'id','text', 'iconCls', 'leaf','children','menuCode','menuType','bigIcon','smallIcon','taskNumber'
            ],
        });

        
        iconStore.loadData(me.datas);   //显示菜单
        me.store=iconStore;
        */
        this.callParent(arguments);  
    },

    listeners: {
        itemclick:'onViewIconItemClick',  //会去控制器里找到对应的方法

        afterrender:function(component){ 

            this.showDeskFuntion();

            //统一设置滚动的高度
            $("#app-indexmenuicon").on("mousewheel DOMMouseScroll", function (e) {
        
                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

                var $this = $(this),
                    timeoutId = $this.data('timeoutId');
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                $this.data('timeoutId', setTimeout(function() {
                    //do something
                    $this.removeData('timeoutId');

                    var currentScroll=$this.scrollTop();
                    if (delta > 0) {
                        // 向上滚                    
                        $this.animate({ 
                            scrollTop:(currentScroll-125)
                        },80);                 
                    } else if (delta < 0) {
                        // 向下滚
                        $this.animate({ 
                            scrollTop:(currentScroll+125)
                        },80);                
                    }

                    $this = null
                }, 80));
                return false;
            });
        }

    },

    showDeskFuntion:function(){
        //读取当前常用功能
        var deskFunc="";
        Ext.Ajax.request({
            url: comm.get('baseUrl')+'/SysUser/getUserDeskFunc',
            method: "GET",
            async: false,
            timeout: 60000,                
            success: function(response, opts) {
                var result = Ext.decode(response.responseText);          
                if(result.success){
                    deskFunc=result.obj;
                }                
            }
        });       

        //加入读取任务数值的数据
        var iconStore=Ext.create('Ext.data.Store', {
            fields: [
                'id','text', 'iconCls', 'leaf','children','menuCode','menuType','bigIcon','smallIcon','taskNumber'
            ],
        });

        var viweport=Ext.ComponentQuery.query("container[xtype=app-viewport]")[0];  //获取主视图，然后再去取得它的viewport，           
        var systemMenus = viweport.getViewModel().get('systemMenu'); 

        var datas=[];   
        //组装所有子菜单
        function selectChild(menus){
            for (var i in menus) {  
                var childs = menus[i].children;      
                if(childs.length>0){
                    selectChild(childs); 
                }
                else{
                    //只显示功能型子菜单    
                    if(menus[i].menuType=="FUNC"){
                        if(deskFunc.indexOf(menus[i].menuCode)!=-1)
                            datas.push(menus[i]);
                    }
                }
            }
        }
        selectChild(systemMenus);
        
        iconStore.loadData(datas);   //显示菜单

        this.setStore(iconStore);    
        
    }
}) 