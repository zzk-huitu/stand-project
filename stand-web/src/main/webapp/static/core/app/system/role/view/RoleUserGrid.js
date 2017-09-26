Ext.define("core.system.role.view.RoleUserGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.system.role.roleusergrid",
	dataUrl: comm.get('baseUrl') + "/SysRole/roleUserList",
	al:false,
//	dataUrl: comm.get('baseUrl') + "/sysuser/list",
	model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysUser", "checked").modelName,
    //selModel:null,	
	noPagging: true,
	extParams: {
		whereSql: "",
		orderSql: ""
	},
	tbar: [],
	panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAddUser',
            funCode: 'girdFuntionBtn',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelUser',
            funCode: 'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle'
        },'->',{
            xtype: 'tbtext',
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'courseName',
            funCode:'girdFastSearchText',
            isNotForm:true,   //由于文本框重写了baseform下面的funcode值，所以使用这个属性，防止重写这里设定的fundcode值。
            emptyText: '请输入姓名'
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search'
        }]
    },
	panelBottomBar:false,

	columns: {        
        defaults:{
            //flex:1,    	//【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
			text: "主键",
			dataIndex: "uuid",
			hidden: true 
		}, {
			text: "编号",
			dataIndex: "userNumb",
            width:150
		}, {
			text: "用户名",
			dataIndex: "userName",
            width:150
		},{
			text: "姓名",
			dataIndex: "xm",
            width:150
		}, {
			text: "性别",
			dataIndex: "xbm",
			columnType: "basecombobox",
			ddCode: "XBM",
            width:60
		},{
            minWidth:150,
            flex:1,
            text: "部门",
            dataIndex: "deptName"
        }, {
            text: "岗位",
            dataIndex: "jobName",
            minWidth:150,
            flex:1,
        }/*, {
			text: "岗位",
			dataIndex: "jobName"
		}*/]
	}
});