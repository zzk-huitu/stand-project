Ext.define("core.smartcontrol.roombagrule.view.RuleRoomGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.roombagrule.ruleroomgrid",
    model: 'com.zd.school.build.define.model.BuildRoominfo',
    dataUrl: comm.get('baseUrl') + "/BasePtRoomBagsRuleBind/ruleRoomlist",
    //title:"绑定费率的设备",
    al:false,
    tbar: [{
        xtype: 'button',
        text: '删除',
        ref: 'gridDelete',
        iconCls: 'x-fa fa-minus-circle'
    }],
    panelTopBar:null,
    panelButtomBar:null,
    remoteSort:false,
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    extParams: {
    },
   
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
        }, {
            text: "房间类型",
            dataIndex: "roomType",
            columnType: "basecombobox", //列类型
            width:120,
            ddCode: "FJLX" //字典代码
        },{
            text: "房间编号",
            dataIndex: "extField01",
            flex:1,
        },{
            text: "区域名称",
            dataIndex: "areaName",
            flex:1,
        },{
            text: "上级名称",
            dataIndex: "areaUpName",
            flex:1,
        },{
            text: "房间电话",
            dataIndex: "roomPhone",
            flex:1,
        }, {
            text: "网络状态",
            dataIndex: "roomNet",
            flex:1,
            renderer: function(value) {
                switch (value) {
                  case '0':
                  return '<font color=green>有网络</font>';
                  break;
                  case '1':
                  return '<font color=red>无网络</font>';                    
                  break;
              }
          }
      },{
            text: "是否多媒体教室",
            dataIndex: "ismediaroom",
            flex:1,
            renderer: function(value) {
                switch (value) {
                  case '0':
                    return '<font color=green>是</font>';
                    break;
                  case '1':
                    return '<font color=red>否</font>';                    
                    break;
                }
            }
        }]
    }
});