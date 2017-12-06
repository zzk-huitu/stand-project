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

    emptyText: '没有下级菜单了',
    
    scrollable :true,
    datas:[],   //菜单项
    
    initComponent : function() {  
        var me =this;

        //加入读取任务数值的数据
        var iconStore=Ext.create('Ext.data.Store', {
            fields: [
                'id','text', 'iconCls', 'leaf','children','menuCode','menuType','bigIcon','smallIcon','taskNumber'
            ],
        });
        
        Ext.Ajax.request({
            url: comm.get('baseUrl')+'/sysuser/getUserMenuTask',
            method: "POST",
            async: false,
            timeout: 60000,                
            success: function(response, opts) {
                var result = Ext.decode(response.responseText);
                //console.log(result);
                if(result.success){
                    var objList=result.obj;
                    var iconDatas=me.datas;
                    for(var i=0;i<objList.length;i++){
                        var obj=objList[i];
                        for(var j=0;j<iconDatas.length;j++){
                            if(obj.name==iconDatas[j].menuCode){
                                iconDatas[j].taskNumber=obj.value;
                                break;
                            }
                        }
                    }                
                }
                iconStore.loadData(me.datas);   //显示菜单
                me.store=iconStore;
            },

            failure: function(response, opts) {
                iconStore.loadData(me.datas);   //显示菜单
                me.store=iconStore;
            }
        });            


        this.callParent(arguments);  
    },

    listeners: {
        itemclick:'onViewIconItemClick',  //会去控制器里找到对应的方法

        afterrender:function(){ 
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

    }
}) 