Ext.define("core.reportcenter.ptroombagstatus.view.SysDeviceGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.ptroombagstatus.sysdevicegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    al:false,
    extParams: {
        whereSql:" where 1=1"
    },  
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间所有设备',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
        }]
    },
    panelButtomBar:{},
    defSort:[],
    columns: {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "设备名称",
            dataIndex: "termName",
            field: {
                xtype: "textfield"
            },
            flex:1,
            minWidth:120,
        }, {
            text: "设备编号",
            dataIndex: "termNo",
            width:150
        }, {
            text: "设备序列号",
            dataIndex: "termSN",
            width:150
        }, {
            text: "网关序列号",
            dataIndex: "gatewayID",
            width:150
        },{
            text: "所属房间",
            dataIndex: "roomName",
            width:150
        }, {
            text: "设备状态",
            dataIndex: "termStatus",
            width:150,
            renderer:function(v){
               return v==1?"<font color=red>启用</font>":"<font color=green>禁用</font>"
           }
       }]
   },

});