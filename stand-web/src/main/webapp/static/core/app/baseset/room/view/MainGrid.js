Ext.define("core.baseset.room.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.room.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    al:false,
    menuCode:"JWTROOMINFO",
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by roomName ",
        filter: '[{"type":"string","comparison":"=","value":"","field":"roomName"}]'
    },
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }/*{
        property: 'createTime',
        direction: 'DESC'
    }*/],
    title: "区域房间",
    panelTopBar:{
        xtype:'toolbar',
        items: [/*{
            xtype: 'tbtext',
            html: '区域房间',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',*/{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '批量添加',
            ref: 'gridBatchAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        }, {
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-pencil-square',
            disabled: true
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
            name:'roomName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入房间名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    },
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
            text: "房间编号",
            dataIndex: "roomCode",
            flex:1,        
            minWidth:120,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
            minWidth:120,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "房间类型", //字段中文名
            dataIndex: "roomType", //字段名
            columnType: "basecombobox", //列类型
            width:100,
            ddCode: "FJLX" //字典代码
        }, {
            text: "所属楼层",
            dataIndex: "areaName",
            width:80
        }, {
            text: "门牌号1",
            dataIndex: "extField01",
            width:80,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号2",
            dataIndex: "extField02",
            width:80,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号3",
            dataIndex: "extField03",
            width:80,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号4",
            dataIndex: "extField04",
            width:80,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "门牌号5",
            dataIndex: "extField05",
            width:80,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "网络状态",
            dataIndex: "roomNet",
            width:80,
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