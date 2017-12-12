Ext.define('core.main.view.index.DeskFunction', {
	extend: 'Ext.window.Window',

	alias : 'widget.main.deskfunction', 

	controller:'main.otherController',
	id: 'app-deskfunction',

	title: '设置常用功能',
	width: 1000,
	height:630,
	resizable: false,
	maximizable:true,
	draggable: true,
	closeAction:'hide',
	layout: 'fit',
	plain: false,
	modal: true,
	border: false,
	iconCls: 'x-fa fa-cog',
	items:[{
		width:'100%',
		frame: false,
	    layout: 'fit',
	    items:[{
	        xtype:'dataview',
	        //store: "core.good.images.store.ImageInfoStore",
	        tpl:new Ext.XTemplate(
		        '<tpl for=".">',
		            '<div class="allFunction thumb-wrap mainMenuIcon-wrap">',	
			            '<tpl if="isDeskFunc == 1 ">',  // <-- Note that the > is encoded		                  		                   
		                    '<i class="fa fa-check" style="color: rgba(60, 255, 1, 0.6);font-size: 80px;font-weight: 400; position: absolute;width: 100%;left: 0;"></i>',
		                '<tpl else>',
		                    '<i class="fa fa-times" style="color: rgba(255, 13, 0, 0.6);font-size: 80px;font-weight: 400; position: absolute;width: 100%;left: 0;"></i>',		                	 
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
		   
	        style:{
	            overflow:'overlay'
	        },
	        trackOver: true,  
	        overItemCls: 'x-item-hover',  
	        itemSelector:'div.thumb-wrap',
	        multiSelect: true,
	        emptyText:'<div style="width:100%;line-height: 100px;text-align:center">暂无菜单功能数据！</div>',
	        plugins: [
	            Ext.create('Ext.ux.DataView.DragSelector', {})
	        ],	      

	    }],
	    tbar: [
	        { xtype: 'button', text: '设为常用', ref: 'gridAdd', iconCls: 'x-fa fa-check',
		        listeners:{
		            click:'setDeskFuncBtn'
		        } 
		    },
	        { xtype: 'button', text: '取消常用', ref: 'gridRemove', iconCls: 'x-fa fa-times',
		        listeners:{
		            click:'cancelDeskFuncBtn'
		        } 
		    },
	    ],
	}],

	initComponent: function() {
		var me = this;
		
		me.showAllFuntion(me);

		me.callParent();
	},

	showAllFuntion:function(component){
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
	            			menus[i].isDeskFunc=1;
	            		else
	            			menus[i].isDeskFunc=0;
	            		datas.push(menus[i]);
	            	}
	            }
	        }
        }
        selectChild(systemMenus);

        iconStore.loadData(datas);   //显示菜单

    	component.items[0].items[0].store=iconStore;
		
	},
	listeners:{
		close:function(panel){
			Ext.getCmp("app-indexmenuicon").showDeskFuntion();	
		}
	}
});