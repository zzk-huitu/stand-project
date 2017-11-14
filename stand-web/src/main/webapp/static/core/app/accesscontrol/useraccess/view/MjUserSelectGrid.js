Ext.define("core.accesscontrol.useraccess.view.MjUserSelectGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.accesscontrol.useraccess.mjuserselectgrid",
    model: "com.zd.school.control.device.model.MjUserright",
    al:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '选择角色赋权(双击)',
            style: {
                fontSize: '14px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '选择人员',
            ref: 'gridAdd_Win',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '保存',
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
            text: "主键",
            dataIndex: "termId",
            hidden: true
        }, {
            text: "人员主键",
            dataIndex: "stuId",
            hidden:true
        }, {
            text: "设备名称",
            dataIndex: "termName",
            width:100
        }, {
            text: "设备序列号",
            dataIndex: "termSN",
            width:100
        }, {
            text: "角色名称",
            dataIndex: "xm",
            width:100
        }]
    },
    
    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
            grid.getStore().removeAt(index); //将选中的移除
            return false;
        },
        beforeitemclick: function(grid, record, item, index, e, eOpts) {
            return false;
        }
    }
});