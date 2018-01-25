Ext.define("core.smartcontrol.roomuserauthority.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.roomuserauthority.maingrid",
    dataUrl: comm.get("baseUrl") + "/BaseMjUserright/mjrightlist", //数据获取地址
    model:"com.zd.school.teacher.teacherinfo.model.ViewUserRoom", //对应的数据模型
    menuCode:"ROOM_ACCESS_CONTROL",
    al: false,
    pageDisplayInfo:false,
    //工具栏操作按钮
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
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'XM',
            funCode: 'girdFastSearchText',
            emptyText: '请输入姓名'
        },{
            xtype:'textfield',
            name:'ROOM_NAME',
            funCode: 'girdFastSearchText',
            emptyText: '请输入房间名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型  
            iconCls: 'x-fa fa-search',  
        }]
    },
/*    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    }],*/
    panelButtomBar:{},
    //扩展参数
    extParams: {
        orderSql :"order by USER_ID"
    },
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
        text: "用户ID",
        dataIndex: "user_ID",
        hidden: true
    },{
        text: "用户姓名",
        dataIndex: "xm",
        minWidth:120,
        flex:1,
    },{
        text: "房间ID",
        dataIndex: "room_ID",
        hidden: true
    },{
        text: "房间代码",
        dataIndex: "room_CODE",
        width:150
    },{
        text: "区域ID",
        dataIndex: "area_ID",
        hidden: true
    },{
        text: "房间名称",
        dataIndex: "room_NAME",
        width:150
    },{
        text: "房间类型",
        dataIndex: "room_TYPE",
        width:150
    }]
    }
});