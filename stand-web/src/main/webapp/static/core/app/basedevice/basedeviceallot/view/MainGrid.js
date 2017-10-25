Ext.define("core.basedevice.basedeviceallot.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.basedeviceallot.maingrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    al:false,
    extParams: {
        whereSql: "   where roomId='ROOT'"
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '已存在设备',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '分配设备',
            ref: 'gridAllot',
            iconCls: 'x-fa fa-plus-circle'
        },{
            xtype: 'button',
            text: '编辑设备',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '删除设备',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        },{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'termName',
            funCode: 'girdFastSearchText',
            emptyText: '设备名称'
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
            text: "设备名称",
            dataIndex: "termName",
            width: 140,
        }, {
            text: "房间名称",
            dataIndex: "roomName",
            hidden: true
        }, {
            text: "序列号",
            dataIndex: "termSN",
            width: 140,
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",
            width: 140,	
        }, {
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE", //字典代码
            width: 140,
        }, {
            text: "设备状态",
            dataIndex: "termStatus",
            flex:1,
            renderer: function(value) {
                switch (value) {
                    case 0:
                        return '<font color=red>禁用</font>';
                        break;
                    case 1:
                        return '<font color=green>启用</font>';
                        break;
                }
            }
        },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 200,
            fixed: true,
            items: [{
                text:'编辑',  
                style:'font-size:12px;', 
                tooltip: '编辑',
                ref: 'gridEdit',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('editClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            },{
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