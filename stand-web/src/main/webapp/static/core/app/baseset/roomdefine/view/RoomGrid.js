Ext.define("core.baseset.roomdefine.view.RoomGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomdefine.roomgrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomType'}]",
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域房间',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }],
    }, 
    panelButtomBar:null,
    columns:{
         defaults:{
            titleAlign:"center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            flex: 1,
            minWidth: 100,
            text: "房间名称",
            dataIndex: "roomName",
            field: {
                xtype: "textfield"
            }
        }, {
            width:200,
            text: "房间类型", //字段中文名
            dataIndex: "roomType", //字段名
            columnType: "basecombobox", //列类型
            ddCode: "FJLX" //字典代码
        }, {
            width:200,
            text: "门牌号1",
            dataIndex: "extField01",
            field: {
                xtype: "textfield"
            }
        }, {
            width:200,
            text: "网络状态",
            dataIndex: "roomNet",
            renderer: function(value) {
                switch (value) {
                    case '0':
                        return '<font color=red>有</font>';
                        break;
                    default:
                        return '<font color=blue>无</font>';
                        break;
                }
            }
        }]
      }
  
});