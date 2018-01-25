Ext.define("core.reportcenter.ptroombagstatus.view.PtIrRoomDeviceGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.ptirroomdevicegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/list",
    model: "com.zd.school.control.device.model.PtIrRoomDevice",
    height: 200,
    animCollapse: true,
   // collapsible: true,
    noPagging: true,
    al:false,
    remoteSort:false,
    selModel:false,
 /*   tools: [{
      xtype: 'button',
      text: '查看所有设备',
      ref: 'gridfind',
      iconCls: 'x-fa fa-plus-circle',
  }],*/
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '红外设备',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
               // lineHeight:'30px',
            }
        },'->',{
            xtype: 'button',
            text: '查看所有设备',
            ref: 'gridfind',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-search-plus'
        }]
    },
    panelButtomBar:{},
    defSort:[],
    //title: "红外设备",
    columns: {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "房间名称",
            dataIndex: "roomName",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100
        }, {
            text: "型号名称",
            dataIndex: "deviceTypeCode",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100
        }, {
            text: "备注",
            dataIndex: "notes",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:100
        }]
    },
});