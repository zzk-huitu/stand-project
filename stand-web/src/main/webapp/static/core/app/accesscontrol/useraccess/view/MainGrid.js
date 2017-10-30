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
            html: '设备下具有权限的角色',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '选择人员',
            ref: 'gridAdde',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '保存数据',
            ref: 'gridSave',
            iconCls: 'x-fa fa-plus-circle'
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
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
        	text: "角色名",
        	dataIndex: "xm",
        	flex:1
        },{
        	text: "设备名称",
        	dataIndex: "termName",
        	width:150
    }]
    }    
});