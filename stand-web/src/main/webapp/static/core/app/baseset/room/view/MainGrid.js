Ext.define("core.baseset.room.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.room.maingrid",
    dataUrl: comm.get('baseUrl') + "/BuildRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    al:false,
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by roomName ",
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'}]"
    },
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
    title: "区域房间",
    tbar: [{
        xtype: 'button',
        text: '添加房间',
        ref: 'gridAdd_Tab',
        iconCls: 'x-fa fa-plus-circle'
    },{
        xtype: 'button',
        text: '批量添加房间',
        ref: 'roomAdd_Tab',
        iconCls: 'x-fa fa-plus-circle'
    }, {
        xtype: 'button',
        text: '编辑房间',
        ref: 'gridEdit_Tab',
        iconCls: 'x-fa fa-pencil-square',
        disabled: true
    }, {
        xtype: 'button',
        text: '删除房间',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
    }],

	panelTopBar:false,
	panelButtomBar:false,
    
    columns:  {        
        defaults:{
            //flex:1,
            //align:'center',
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "roomId",
            hidden: true
        }, {
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "房间类型", //字段中文名
            dataIndex: "roomType", //字段名
            columnType: "basecombobox", //列类型
            flex:1,
            ddCode: "FJLX" //字典代码
        }, {
            text: "门牌号1",
            dataIndex: "extField01",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号2",
            dataIndex: "extField02",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号3",
            dataIndex: "extField03",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号4",
            dataIndex: "extField04",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号5",
            dataIndex: "extField05",
            flex:1,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "网络状态",
            dataIndex: "roomNet",
            flex:1,
            renderer: function(value) {
                switch (value) {
                    case '0':
                        return '<font color=green>有</font>';
                        break;
                    default:
                        return '<font color=red>无</font>';
                        break;
                }
            }
        }]
    }
});