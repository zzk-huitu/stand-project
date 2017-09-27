Ext.define("core..baseset.roomdefine.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomdefine.maingrid",
   /* dataUrl: comm.get('baseUrl') + "/BuildClassRoomDefine/list",
    model: "com.zd.school.build.define.model.BuildClassRoomDefine",*/
    menuCode:"BASEROOMDEFINE", //new：此表格与权限相关的菜单编码
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'}]"
    },

    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '详细',
            ref: 'gridDetail_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'campusName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入校区名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        },' ',{
            xtype: 'button',
            text: '高级搜索',
            ref: 'gridHignSearch',
            iconCls: 'x-fa fa-sliders'
        }],
    }, 
   
    tbar: [{
        xtype: 'button',
        text: '设置教室',
        ref: 'gridAdds',
        iconCls: 'table_add'
    }, {
        xtype: 'button',
        text: '解除设置',
        ref: 'gridDelete',
        iconCls: 'table_remove'
    }],
    columns: [{
        xtype: "rownumberer",
        width: 35,
        text: '序号',
        align: 'center'
    }, {
        text: "房间主键",
        dataIndex: "roomId",
        hidden: true
    }, {
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "教室名称",
        dataIndex: "roomName"
    }, {
        text: "所属楼层",
        dataIndex: "areaName",
        field: {
            xtype: "textfield"
        }
    }, {
        text: "所属楼栋",
        dataIndex: "upAreaName",
        field: {
            xtype: "textfield"
        }
    }, {
        text: "教室标识",
        dataIndex: "className",
        field: {
            xtype: "textfield"
        }
    }]
 
});