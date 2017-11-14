Ext.define("core.accesscontrol.useraccess.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.accesscontrol.useraccess.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseMjUserright/list",
    model: "com.zd.school.control.device.model.MjUserright",
    al:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '设备权限角色',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '删除权限',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-minus-circle'
        },{
            xtype: 'button',
            text: '删除人员权限',
            ref: 'gridDeleteAll',
            iconCls: 'x-fa fa-minus-circle'
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
        	text: "角色名",
        	dataIndex: "xm",
        	flex:1,
            minWidth:150,
        },{
        	text: "设备名称",
        	dataIndex: "termName",
        	width:150
    }]
    }    
});