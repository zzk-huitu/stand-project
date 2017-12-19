Ext.define("core.system.roleright.view.RoleRightGrid", {
	extend: "core.base.view.BaseTreeGrid",
	alias: "widget.system.roleright.rolgerightgrid",
	//title: "角色权限菜单",
	dataUrl: comm.get('baseUrl') + "/SysMenu/roleMenuList",
	model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysMenuTree", "checked").modelName,
	al: true,
	extParams: {
		whereSql: " and isDelete='0' ",
		orderSql: " order by parentNode,orderIndex asc"
	},
	menuCode:"ROLERIGHT",
	tbar: [{
		xtype: 'button',
		text: '授权',
		ref: 'gridAdd',
		iconCls: 'x-fa fa-user-secret',
		disabled: false
	}, {
		xtype: 'button',
		text: '取消授权',
		ref: 'gridEdit',
		iconCls: 'x-fa fa-user-times',
		disabled: true
	}, {
		xtype: 'button',
		text: '展开',
		ref: 'gridExpand',
		iconCls: 'x-fa fa-minus-square-o',
		//disabled: true
	}, {
		xtype: 'button',
		text: '折叠',
		ref: 'gridCollapse',
		iconCls: 'x-fa fa-plus-square-o',
		//disabled: true
	},{
		xtype: 'button',
		text: '设置功能权限',
		ref: 'gridSetPermission',
		iconCls: 'x-fa fa-pencil-square',
		disabled: true
	}],
	columns:  {
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
			header: '菜单名称',
			dataIndex: 'text',
			xtype: 'treecolumn',
			align:'left',
            titleAlign:"left",
			flex:2,
			minWidth: 200
		}, {
			header: '排序号',
			dataIndex: 'orderIndex',
			width: 80
		}, {
			header: '菜单类型',
			dataIndex: 'menuType',
			columnType: "basecombobox", //列类型
			ddCode: "MENUTYPE", //字典代码
			width: 100
		}, {
			header: '菜单编码',
			dataIndex: 'menuCode',
			width: 200
		}, {
			header: '菜单功能权限',
			dataIndex: 'roleMenuPerName',
			minWidth: 150,
			flex:2,
			renderer: function(value,metaData) {  
               	var title=" 菜单功能权限 ";
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  
		}
		/*, {
				header: '图标',
				dataIndex: 'smallIcon',
				renderer: function(value) {
					return "<img src=\"" + value + "\" width=16 hight=16/>'";
				},
				width: 30
			}*/
		]
	}
});