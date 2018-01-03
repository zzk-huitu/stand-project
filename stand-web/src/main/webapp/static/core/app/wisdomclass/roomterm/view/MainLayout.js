Ext.define("core.wisdomclass.roomterm.view.MainLayout", {
    extend: "core.base.view.BasePanel",
    alias: "widget.wisdomclass.roomterm.mainlayout",
    
    requires: [    
        "core.wisdomclass.roomterm.view.MainLayout",
        "core.wisdomclass.roomterm.view.RoomTree",
        "core.wisdomclass.roomterm.view.MainGrid",
        "core.wisdomclass.roomterm.view.DetailLayout",
        "core.wisdomclass.roomterm.view.DetailForm",
        "core.wisdomclass.roomterm.controller.MainController",
   ],
    
    controller: 'wisdomclass.roomterm.maincontroller',
    otherController:'wisdomclass.roomterm.othercontroller',
    
  
    funCode: "roomterm_main",
    detCode: "roomterm_detail",
    detLayout: "wisdomclass.roomterm.detaillayout",
    funData: {
        action: comm.get("baseUrl") + "/BaseInfoterm", //请求Action
        pkName: "uuid",
        defaultObj: {
        },
    tabConfig:{         //zzk：2017-6-1加入，用于对tab操作提供基本配置数据
        titleField:'termCode',
        addTitle:'分配终端',
        editTitle:'编辑终端分配',
        detailTitle:'终端分配详情'
        }
    },

    layout: "border",
    /*设置最小宽度，并且自动滚动*/
    minWidth:1000,
    scrollable:'x',

    items: [{
        split: true,
        xtype: "wisdomclass.roomterm.roomtree",
        region: "west",
        width: 250
    }, {
        xtype: "wisdomclass.roomterm.maingrid",
        region: "center"
    }]
})