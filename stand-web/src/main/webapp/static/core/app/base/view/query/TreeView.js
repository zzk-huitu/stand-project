Ext.define('core.base.view.query.TreeView', {
	extend: 'Ext.tree.Panel',
	frame: false,
	animCollapse: false,
	alias: 'widget.mttreeview',
	rootVisible: false,
	multiSelect: false,
	width: 400,
	height:500,
	autoScroll: true,
	animate: true,
	al: true,           //是否store自动加载
	expandFirst:false,
	initComponent: function() {
		var me=this;
	
		/*此代码有问题，
		this.store = Ext.create("core.base.store.query.TreeStore", {
			url: this.url,
			model: 'com.zd.school.plartform.system.model.SysMenuTree',
			treeObj: me
		});*/
		
		var params={};
		if (this.params) {
			params = Ext.apply(params, this.params)
		}
		if (!this.multiSelect) {		
			params.excludes = "checked";
		}
		
		this.store=Ext.create('Ext.data.TreeStore', {
            defaultRootId: "ROOT",
            autoLoad: this.al,
            model: factory.ModelFactory.getModelByName(this.model, "checked").modelName,   
            proxy: {
                type: 'ajax',
                url: this.url,
                extraParams: params,
                reader: {
                    type: 'json'
                },
                writer: {
                    type: 'json'
                }
            },
            listeners:{
                load:function( store , records , successful , operation , eOpts ){
                    
                    //(处理服务器登录超时的解决方式)若为false，则表明返回的数据不是proxy指定的格式；则弹出提示
                    if(successful==false) {    
                       
                        if(operation.getResponse()==null){      //请求无响应出错的时候      
                            return;
                        }

                        var result=Ext.decode(Ext.valueFrom(  operation.getResponse().responseText, '{}')); 
                        var msg=result.obj;
                        if(!msg||typeof(msg) != "string")
                            msg="请求失败，请刷新页面重试！";
                                                
                        Ext.MessageBox.show({
                            title: "警告",
                            msg: msg,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING,
                            fn: function(btn) {
                                location.reload()       
                            }
                        });
                    
                    }else{
                        //当expandFirst为true时，展开第一层
                        if(me.expandFirst==true && me.getRootNode().childNodes.length>0){
                            me.getRootNode().childNodes[0].expand();   //展开第一层
                        }
                       
                    }                   
                }    
            }
        });

		
		
		/* 此功能暂时移除，在TreeStore中有bug
		var qc = Ext.create('Ext.form.field.ComboBox', {
			queryMode: 'local',
			store: new Ext.data.Store({
				fields: ['id', 'text', 'parentText']
			}),
			hideTrigger: true,
			valueField: 'id',
			displayField: 'text',
			ref: 'queryTreeCBB',
			emptyText: '输入查询信息...',
			flex: 1,
			listConfig: function(df) {
				return "{text}<tpl if='parentText'><div style='color:#C0C0C0;'>({parentText})</div></tpl>";
			}
		});
		this.dockedItems = [{
			xtype: 'toolbar',
			dock: 'top',
			layout: 'hbox',
			items: [qc]
		}]
		*/

		this.callParent(arguments);
	}
});