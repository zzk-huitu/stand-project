/*
图标子菜单，用于显示第二层的图标菜单
*/
Ext.define('core.main.view.index.IndexNotice', {  
    extend : 'Ext.view.View',  
    
    alias : 'widget.main.indexnotice',  
    //title : '功能菜单',  
    //iconCls:'x-fa fa-calendar-minus-o',
    //id: 'app-indexnotice',

    viewModel : 'main.mainModel',  
    
    tpl:new Ext.XTemplate(
        '<ul class="mainIndexNoticeUl">',          
        '<tpl for=".">',
            '<li class="mainIndexNoticeLi"><a>{name}</a><span>{date}</span></li>',
        '</tpl>',
        '</ul>'
    ),
    itemSelector: 'li.mainIndexNoticeLi',

    emptyText: '暂无数据！',
    
    scrollable :true,

    store: {
        fields: ['name','date'],
        data:[{
            name:'您好1，有申请需要您审批',
            date:'2017-12-07'
        },{
            name:'您好1，有申请需要您审批',
            date:'2017-12-07'
        },{
            name:'您好1，有申请需要您审批',
            date:'2017-12-07'
        },{
            name:'您好1，有申请需要您审批',
            date:'2017-12-07'
        },{
            name:'您好1，有申请需要您审批',
            date:'2017-12-07'
        }],
    },
    
    initComponent : function() {  
        var me =this;

        //加入读取任务数值的数据
        // var iconStore=Ext.create('Ext.data.Store', {
        //     fields: [
        //         'id','text', 'iconCls', 'leaf','children','menuCode','menuType','bigIcon','smallIcon','taskNumber'
        //     ],
        // });
        
        // Ext.Ajax.request({
        //     url: comm.get('baseUrl')+'/sysuser/getUserMenuTask',
        //     method: "POST",
        //     async: false,
        //     timeout: 60000,                
        //     success: function(response, opts) {
        //         var result = Ext.decode(response.responseText);
        //         //console.log(result);
        //         if(result.success){
        //             var objList=result.obj;
        //             var iconDatas=me.datas;
        //             for(var i=0;i<objList.length;i++){
        //                 var obj=objList[i];
        //                 for(var j=0;j<iconDatas.length;j++){
        //                     if(obj.name==iconDatas[j].menuCode){
        //                         iconDatas[j].taskNumber=obj.value;
        //                         break;
        //                     }
        //                 }
        //             }                
        //         }
        //         iconStore.loadData(me.datas);   //显示菜单
        //         me.store=iconStore;
        //     },

        //     failure: function(response, opts) {
        //         iconStore.loadData(me.datas);   //显示菜单
        //         me.store=iconStore;
        //     }
        // });            


        this.callParent(arguments);  
    },

    listeners: {
        itemclick:function(){
            alert("待实现功能！");
        }, 

        afterrender:function(){ 
            console.log(11111111);
        }

    }
}) 