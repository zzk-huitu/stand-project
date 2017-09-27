Ext.define("core.baseset.roomdefine.view.RoomGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomdefine.RoomGrid",
    dataUrl: comm.get('baseUrl') + "/BuildRoominfo/list",
    model: "com.zd.school.build.define.model.BuildRoominfo",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomType'}]",
    },
    tbar: null,
    title: "区域房间",
    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "房间名称",
        dataIndex: "roomName",
        field: {
            xtype: "textfield"
        }
    }, {
        text: "房间类型", //字段中文名
        dataIndex: "roomType", //字段名
        columnType: "basecombobox", //列类型
        ddCode: "FJLX" //字典代码
    }, {
        text: "门牌号1",
        dataIndex: "extField01",
        field: {
            xtype: "textfield"
        }
    }, {
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
});