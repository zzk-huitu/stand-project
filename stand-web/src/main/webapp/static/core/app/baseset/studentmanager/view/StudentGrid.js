Ext.define("core.baseset.studentmanager.view.StudentGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.baseset.studentmanager.studentgrid",
	dataUrl: comm.get('baseUrl') + "/SysUser/list",
	model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysUser", "checked").modelName,
	al: false,

    menuCode:"STUDENTMANAGER", //new：此表格与权限相关的菜单编码

	//排序字段及模式定义
	defSort: [{
		property: 'userNumb',
		direction: 'ASC'
	}, {
		property: 'state',
		direction: 'DESC'
	}],
	extParams: {
		filter: '[{"type":"string","comparison":"=","value":"2","field":"category"}]'
	},
	title: "部门人员账户",

	panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-square',
            disabled: false
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '锁定账户',
            ref: 'gridLock',
            funCode:'girdFuntionBtn',    
            iconCls: 'x-fa fa-lock',
            disabled:true,
        },{
            xtype: 'button',
            text: '解锁账户',
            ref: 'gridUnLock',
            funCode:'girdFuntionBtn',       
            iconCls: 'x-fa fa-unlock',
            disabled:true,
        },{
            xtype: 'button',
            text: '重置密码',
            ref: 'gridSetPwd',
            funCode:'girdFuntionBtn',         
            iconCls: 'x-fa fa-key',
            disabled:true,
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file'
        },{
            xtype: 'button',
            text: '同步人员数据到UP',
            ref: 'syncToUP', 
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-rss'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            width:100,
            name:'userName',
            funCode:'girdFastSearchText', 
            emptyText: '用户名'
        },{
            xtype:'textfield',
            width:100,
            name:'xm',
            funCode:'girdFastSearchText', 
            emptyText: '学生姓名'
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',   
            iconCls: 'x-fa fa-search',  
        }],
    },

    panelButtomBar:null,

	columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
			text: "主键",
			dataIndex: "uuid",
			hidden: true
		},{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
			text: "用户名",
			dataIndex: "userName",
			width:150,
            align:'left'
		}, {
			text: "学生姓名",
			dataIndex: "xm",
			width:100,
            align:'left'
		}, {
			text: "性别",
			dataIndex: "xbm",
			columnType: "basecombobox",
			ddCode: "XBM",
			width:80,
            align:'left'
		},{
            text: "身份",
            dataIndex: "category",
            columnType: "basecombobox",
            ddCode: "CATEGORY",
            width:80,
            align:'left'
        }, {
			text: "编制",
			dataIndex: "zxxbzlb",
			ddCode: "ZXXBZLB",
			columnType: "basecombobox",
			minWidth:100,
            flex:1,
            align:'left'
		}/*, {
			text: "岗位",
			dataIndex: "jobName"
		}*/, {
			text: "账户状态",
			dataIndex: "state",
			width:100,
            align:'left',
			renderer: function(value) {
				return (value == '0') ? '<font color=green>正常</font>' : '<font color=red>锁定</font>';
			}
		},{
            width:100,
            text: "卡片编号",
            dataIndex: "upCardId",
            align:'left'       
        },{
            width:100,
            text: "发卡状态",
            dataIndex: "useState",
            align:'left',
            renderer: function(value, metaData) {          
                if(value==0)
                    return "<span style='color:red'>未发卡</span>";
                else if(value==1)
                    return "<span style='color:green'>已发卡</span>";            
                else 
                    return "<span style='color:#FFAC00'>卡片失效</span>";            
            }        
        },{
            xtype:'actiontextcolumn',
            text: "操作",
            width:200,
            fixed:true,
            items: [{
                text:'部门岗位',
                style:'font-size:12px;',
                tooltip: '部门岗位',
                ref: 'gridDeptJob',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="STUDENTMANAGER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridDeptJob")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('gridDeptJobClick', {
                        view:view.grid,
                        record: rec,
                        cmd:"deptJob"
                    });
                }
            },{
                text:'角色管理',
                style:'font-size:12px;',
                tooltip: '角色管理',
                ref: 'gridRole',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="STUDENTMANAGER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridRole")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('gridUserRoleClick', {
                        view:view.grid,
                        record: rec,
                        cmd:"userRole"
                    });
                }
            },{
                text:'编辑',  
                style:'font-size:12px;',         
                tooltip: '编辑',
                ref: 'gridEdit',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="STUDENTMANAGER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridEdit_Tab")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {                 
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('editClick_Tab', {
                        view:view.grid,
                        record: rec,
                        cmd:"edit"
                    });
                }
            },{
                text:'详情',     
                style:'font-size:12px;',
                tooltip: '详情',
                ref: 'gridDetail',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view:view.grid,
                        record: rec
                    });
                }
            }/*暂不开放此功能,{
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SYSUSER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('deleteClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }*/]
        }]
	}
});