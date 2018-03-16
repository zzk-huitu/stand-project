Ext.define("core.system.dept.view.DeptJobGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.system.dept.deptjobgrid",
	dataUrl: comm.get('baseUrl') + "/SysDeptjob/list",
	model: "com.zd.school.plartform.baseset.model.BaseDeptjob",
	al: false,
	//排序字段及模式定义
	defSort: [{
		property: 'jobType',
		direction: 'ASC'
	}, {
		property: 'jobLevel',
		direction: 'ASC'
	}],
	extParams: {
	},
	//title: "部门岗位",
	panelTopBar:{
        xtype:'toolbar',
        items: [{
			xtype: 'button',
			text: '添加部门岗位',
			ref: 'gridAddJob',
			iconCls: 'x-fa fa-plus-circle',
			tooltip: '设置部门所包含的岗位',
		}, {
			xtype: 'button',
			text: '设置上级主管',
			ref: 'gridSetSuperJob',
			iconCls: 'x-fa fa-pencil-square',
			tooltip: '为所选岗位设置上级主管岗位',
		},'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'jobName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入岗位名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:null,

    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items:[{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
			text: "主键",
			dataIndex: "uuid",
			hidden: true
		}, {
			text: "部门",
			dataIndex: "deptName",
			minWidth:150,
			flex:1
		}, {
			text: "岗位",
			dataIndex: "jobName",
			width:100,
		}, {
			text: "是否部门主管岗位",
			width:150,
			dataIndex: "jobType",
			renderer: function(value) {
				return (value != 0) ? '<font color=red>否</font>' : '<font color=green>是</font>';
			}
		}, {
			text: "主管部门",
			dataIndex: "parentdeptName",
			width:150,
		}, {
			text: "主管岗位",
			dataIndex: "parentjobName",
			width:150,
		}, {
			width: 280,
			fixed:true,
			text: "操作",
			xtype: "actiontextcolumn",
			ref: "deptJobDetail",
			align: "center",
			items: [{
				text: '设置主管岗位',
				style: 'font-size:12px;',
				tooltip: '设置本岗位为部门负责岗位',
				getClass: function(view, metadata, record, rowIndex, colIndex, store) {
					if (record.get("jobType") == 0) {
						return "x-hidden";
					} else
						return null;
				},
				handler: function(view, rowIndex, colIndex, item) {
					this.fireEvent("detailClick", view, "setLeader", rowIndex);
				}
			}, {
				text: '设置上级主管',
				style: 'font-size:12px;',
				tooltip: '为本岗位设置上级主管岗位',
				//ref: 'gridEdit',
				handler: function(view, rowIndex, colIndex, item) {
					this.fireEvent("detailClick", view, "setSuperJob", rowIndex);
				}
			},{
				text: '部门岗位用户',
				style: 'font-size:12px;',
				tooltip: '设置此部门岗位的用户',
				//ref: 'gridEdit',
				handler: function(view, rowIndex, colIndex, item) {
					this.fireEvent("detailClick", view, "setDeptJobUser", rowIndex);
				}
			}, {
				text: '删除',
				style: 'font-size:12px;',
				tooltip: '删除',
				//ref: 'gridEdit',
				handler: function(view, rowIndex, colIndex, item) {
					this.fireEvent("detailClick", view, "delete", rowIndex);
				}
			}]
		}]
	}
});