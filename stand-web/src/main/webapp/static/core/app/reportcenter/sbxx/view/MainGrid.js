
Ext.define("core.reportcenter.sbxx.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.reportcenter.sbxx.maingrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/termlist",
    model: "com.zd.school.control.device.model.PtTerm",
    menuCode:"SBXX", //new：此表格与权限相关的菜单编码
/*    defGroup:"roomName",
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        id: 'restaurantGrouping',
        collapsible :true,
        enableGroupingMenu:false,
        enableNoGroups:false,
    }],*/
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '设备序列号',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800,
                lineHeight:'30px',
            }
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o'
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        }, {
            xtype:'textfield',
            name:'termName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入设备名称'
        }, {
            xtype:'textfield',
            name:'roomName',
            funCode: 'girdFastSearchText',
            emptyText: '请输入房间名称'
        }, {
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:{
    },
  
    
    //排序字段及模式定义
    defSort: [{
        property: 'updateTime',
        direction: 'DESC'
    },/*{
        property: 'createTime',
        direction: 'DESC'
    }*/],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    },{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    },{
        text: "设备名称",
        dataIndex: "termName",
        field: {
            xtype: "textfield"
        },
        flex:1.5,
        minWidth:150
    },{
        text: "序列号",
        dataIndex: "termSN",
        flex:1.2,
        minWidth:120         
    },{
        text: "房间名称",
        dataIndex: "roomName",
        flex:1.5,
        minWidth:150
    },  {
        text: "网关名称",
        dataIndex: "gatewayName",
        flex:1,
        minWidth:100
    }, {
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE", //字典代码
        flex:1,
        minWidth:100
    }]
    }    
});