Ext.define("core.accesscontrol.useraccess.view.MjUserrightAllotGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.accesscontrol.useraccess.mjuserrightallotgrid",
    model: "com.zd.school.control.device.model.MjUserright",
    al:false,
    extParams: {},
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '选择角色  (双击添加或删除)',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },{
            xtype: 'button',
            text: '选择人员',
            ref: 'gridAdde',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '保存数据',
            ref: 'gridSave',
            iconCls: 'x-fa fa-plus-circle'
        },'->'],
    }, 
    panelButtomBar:null,
    
    columns: [{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    },{
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
        flex:1
    }, {
        text: "设备序列号",
        dataIndex: "termSN",
        width:150
    }, {
        text: "角色名称",
        dataIndex: "xm",
        width:150
    }],
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