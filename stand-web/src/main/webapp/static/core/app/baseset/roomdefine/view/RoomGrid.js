Ext.define("core.baseset.roomdefine.view.RoomGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomdefine.roomgrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomType'}]",
    },
    selModel: {
        type: "checkboxmodel",   
        headerWidth:40,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        mode:'single',  //multi,simple,single；默认为多选multi
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域房间',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px'
            }
        }],
    }, 
    panelButtomBar:null,
    columns:  {        
        defaults:{
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
            minWidth:100,
            field: {
                xtype: "textfield"
            }
        }, {
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
            minWidth:100,
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