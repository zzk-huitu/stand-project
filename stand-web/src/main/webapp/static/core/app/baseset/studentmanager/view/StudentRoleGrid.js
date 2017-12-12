Ext.define("core.baseset.studentmanager.view.StudentRoleGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentmanager.studentrolegrid",
    model: 'com.zd.school.plartform.system.model.SysRole',
    dataUrl: comm.get('baseUrl') + "/SysUser/userRoleList",
    title:"用户所属角色",
    noPagging:true,
    al:false,
    remoteSort:false,
  
    tbar: [{
        xtype: 'button',
        text: '添加',
        ref: 'gridAdd',
        iconCls: 'x-fa fa-plus-circle'
    }, {
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
    }],
    panelTopBar:null,
    panelButtomBar:null,
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
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
        }, {
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "角色名称",
            dataIndex: "roleName",
            flex:1,
        }, {
            text: "角色编码",
            dataIndex: "roleCode",
            flex:1,
        }]
    }
});