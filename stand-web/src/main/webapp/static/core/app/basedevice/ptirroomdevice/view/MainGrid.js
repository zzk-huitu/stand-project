Ext.define("core.basedevice.ptirroomdevice.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.ptirroomdevice.maingrid",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/list",
    model: "com.zd.school.control.device.model.PtIrRoomDevice",
    al: false,
    extParams: {
        whereSql: " and isDelete='0' ",
    },
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
            text: '绑定品牌型号',
            ref: 'gridBinDing',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'deviceTypeCode',
            funCode: 'girdFastSearchText',
            emptyText: '型号名称'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
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
            text: "房间名称",
            dataIndex: "roomName",
            width: 150,
        }, {
            text: "型号名称",
            dataIndex: "deviceTypeCode",
            width: 150,
        }, {
            text: "备注",
            dataIndex: "notes",
            flex:1
        },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 160,
            fixed: true,
            items: [{
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('deleteClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }    
});