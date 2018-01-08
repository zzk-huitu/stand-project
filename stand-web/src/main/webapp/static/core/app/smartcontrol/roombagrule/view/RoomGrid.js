Ext.define("core.smartcontrol.roombagrule.view.RoomGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.roombagrule.roomgrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomType'}]",
    },
    pageDisplayInfo:false,
    al:false,
    selModel: {
        type: "checkboxmodel",   
        headerWidth:40,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        mode:'multi',  //multi,simple,single；默认为多选multi
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
                lineHeight:'32px'
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
        }]
    },
    listeners: {
        itemdblclick: function() {
            return false;
        }
    }
    
});