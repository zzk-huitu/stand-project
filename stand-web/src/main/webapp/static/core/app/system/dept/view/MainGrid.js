Ext.define("core.system.dept.view.MainGrid", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.system.dept.maingrid",
    dataUrl: comm.get('baseUrl') + "/SysOrg/chkTreeList",
    model: "com.zd.school.plartform.baseset.model.BaseOrgChkTree",
    al: true,
    menuCode:"DEPARTMENT",
    //selModel: null,    
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by parentNode,orderIndex asc"
    },
    tbar: [{
        xtype: 'button',
        text: '添加部门',
        ref: 'gridAdd_Tab',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-plus-circle',
    }/*, {
        xtype: 'button',
        text: '添加同级',
        ref: 'gridAddBrother_Tab',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-plus-circle',
    }*//*, {
        xtype: 'button',
        text: '修改',
        ref: 'gridEdit_Tab',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-pencil-square',
        disabled:true
    }*/, {
        xtype: 'button',
        text: '同步部门数据到UP',
        ref: 'sync',
        funCode:'girdFuntionBtn',         
        iconCls: 'x-fa fa-rss'
    }, {
        xtype: 'button',
        text: '修改',
        ref: 'gridEdit_Tab',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-pencil-square'
    },{
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle',
    }, {
        xtype: 'button',
        text: '刷新',
        ref: 'gridRefresh',
        iconCls: 'x-fa fa-refresh'
    },{
        xtype: 'button',
        text: '设置部门岗位',
        ref: 'gridSetJob',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-pencil-square'
    },{
        xtype: 'button',
        text: '设置部门上级主管',
        ref: 'gridSetMainJob',
        funCode: 'girdFuntionBtn',
        iconCls: 'x-fa fa-pencil-square'
    }],
    
    columns:  {        
        defaults:{
            //flex:1,
            align:'center',
            titleAlign:"center"
        },
        items: [{
            header: '部门名称',
            dataIndex: 'text',
            xtype: 'treecolumn',
            //flex:false,
            align:'left',
            width: 300
        },/* {
            header: '排序号',
            width:80,
            dataIndex: 'orderIndex'
        }, */{
            header: '部门类型',
            width:100,
            dataIndex: 'deptType',
            columnType: "basecombobox", //列类型
            ddCode: "DEPTTYPE" //字典代码

        }, {
            header: '主负责岗位',
            dataIndex: 'mainLeaderName',
            flex:1,
        }, {
            header: '上级主管岗位',
            dataIndex: 'superjobName',
            flex:1,
        }, {
            header: '内线电话',
            dataIndex: 'outPhone',
            flex:1,
        }, {
            header: '外线电话',
            dataIndex: 'inPhone',
            flex:1,
        }, {
            header: '备注',
            dataIndex: 'remark',
            flex:1,
        }]
    }
});