Ext.define("core.baseset.roomallot.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomallot.maingrid",
    dataUrl: comm.get('baseUrl') + "/BaseOfficeAllot/list",
    model: "com.zd.school.build.allot.model.JwOfficeAllot",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'roomId'}]"
    },
    //al:false,
    menuCode:"BASEROOMALLOT", //new：此表格与权限相关的菜单编码
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '分配办公室',
            ref: 'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '解除设置',
            ref: 'gridDelete',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '推送消息',
            ref: 'officeTs',
            iconCls: 'x-fa fa-plus-circle',
            hidden:true
        }]
    }, 
   panelButtomBar:{},
   
   columns:  {        
    defaults:{
            titleAlign:"center"
        },
    items:[{
        xtype: "rownumberer",
        width: 80,
        text: '序号',
        align: 'center'
    }, {
        text: "主键",
        dataIndex: "uuid",
        hidden:true
    }, {
        text: "教师老师主键",
        dataIndex: "tteacId",
        hidden:true
    }, {
        text: "房间主键",
        dataIndex: "roomId",
        hidden:true
    }, {
        flex: 1,
        minWidth: 100,
        text: "老师姓名",
        dataIndex: "xm",
        field: {
            xtype: "textfield"
        }
    }, {
         width: 150,
        text: "房间名",
        dataIndex: "roomName",
        field: {
            xtype: "textfield"
        }
    }, {
        width: 150,
        text: "所属楼层",
        dataIndex: "areaName",
        field: {
            xtype: "textfield"
        }
    }, {
        width: 150,
        text: "所属楼栋",
        dataIndex: "upAreaName",
        field: {
            xtype: "textfield"
        }
    }]
}
});