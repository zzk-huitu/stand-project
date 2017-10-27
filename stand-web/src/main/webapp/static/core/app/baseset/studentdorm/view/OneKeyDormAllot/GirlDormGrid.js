Ext.define("core.baseset.studentdorm.view.GirlDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.studentdorm.girldormgrid",
    model: "com.zd.school.build.define.model.BuildDormDefine",
    extParams: {
    },
    al:false,
    noPagging: true,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '女生宿舍列表（双击移除或者批量删除）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '选择女生宿舍',
            ref: 'selectNv',
            iconCls: ''
        }, {
            xtype: 'button',
            text: '批量删除',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-plus-circle'
        }]
    },
    bottomInfoPanelRef:'girlTotalInfo',
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            width:100,
            text: "宿舍名称",
            dataIndex: "roomName",
            field: {
                xtype: "textfield"
            }
        }, {
            flex:1,
            minWidth:100,
            text: "所属楼层",
            dataIndex: "areaName",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
            text: "所属楼栋",
            dataIndex: "upAreaName",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
            text: "宿舍类型",
            dataIndex: "dormType",
            renderer: function(value) {
                switch (value) {
                    case '1':
                    return '<font color=red>男宿舍</font>';
                    break;
                    case '2':
                    return '<font color=green>女宿舍</font>';
                    break;
                    case '3':
                    return '<font color=blue>不限</font>';
                    break;
                }
            }
        }]
    },
    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
            grid.getStore().removeAt(index); //将选中的移除
            var girlCount = grid.getStore().getCount();
            var dormInfo = grid.up('basepanel[xtype=baseset.studentdorm.onekeyallotdormlayout]');
            var girlyDormGrid = dormInfo.down('basegrid[xtype=baseset.studentdorm.girldormgrid]');
            var conutHtml="总数："+girlCount;
            girlyDormGrid.down('panel[ref= girlTotalInfo]').setHtml(conutHtml); 
    }                        
}, 
});