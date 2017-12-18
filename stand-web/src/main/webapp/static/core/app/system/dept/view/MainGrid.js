Ext.define("core.system.dept.view.MainGrid", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.system.dept.maingrid",
    dataUrl: comm.get('baseUrl') + "/SysOrg/chkTreeList",
    model: "com.zd.school.plartform.baseset.model.BaseOrgChkTree",
    al: true,
    expandFirst:true,
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
    }, {
        xtype: 'button',
        text: '同步部门数据到UP',
        ref: 'sync',
        funCode:'girdFuntionBtn',         
        iconCls: 'x-fa fa-rss'
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
            minWidth: 100,
            flex:2
        },/* {
            header: '排序号',
            width:80,
            dataIndex: 'orderIndex'
        }, */{
            header: '部门类型',
            minWidth:80,
            flex:1,
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
        },{
            text: "是否系统内置",
            dataIndex: "isSystem",
            flex:1,
            renderer: function(value) {
                return value=="1"?"<font color=green>是</font>":"<font color=red>否</font>"
            }
        }, {
            header: '备注',
            dataIndex: 'remark',
            flex:1.5,
            renderer: function(value, metaData) {
                var title = "备注";
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';
                return value;
            }
        }]
    }
});