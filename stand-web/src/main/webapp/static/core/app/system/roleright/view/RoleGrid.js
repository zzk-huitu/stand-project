Ext.define("core.system.roleright.view.RoleGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.roleright.rolegrid",
    dataUrl: comm.get('baseUrl') + "/SysRole/list",
    model: 'com.zd.school.plartform.system.model.SysRole',
    selModel: {
        selType: "",
        mode:'single'
    },      
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    pageDisplayInfo:false,
    extParams: {
        whereSql: "",
        filter:"[{\"type\":\"numeric\",\"comparison\":\"=\",\"value\":0,\"field\":\"isDelete\"}]"
    },
    //title: "系统角色",
    panelTopBar: {
        xtype: 'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '角色列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->', {
            xtype: 'tbtext',
            html: '快速搜索：'
        }, {
            xtype: 'textfield',
            name: 'roleName',
            funCode: 'girdFastSearchText',
            emptyText: '角色名称'
        }, {
            xtype: 'button',
            funCode: 'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search',
        }]
    },
    panelButtomBar:false,
    columns: { 
        defaults:{
            flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
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
            text: "角色名称",
            dataIndex: "roleName"
        }, {
            text: "角色编码",
            dataIndex: "roleCode"
        },{
            text: "角色说明",
            dataIndex: "remark",
            renderer: function(value,metaData) {  

                var title=" 角色说明 ";

                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + value + '"';  
                return value;  
            }  

        }]
    }
})