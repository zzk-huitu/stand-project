Ext.define("core.basedevice.basegateway.view.MainGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.basegateway.miangrid",
    dataUrl: comm.get('baseUrl') + "/BaseGateway/list",
    model: "com.zd.school.control.device.model.PtGateway",
    forceFit: false,
    al: false,
    extParams: {
     // filter: '[{"type":"string","comparison":"=","value":"0","field":"isDelete"}]'
    },
    menuCode:"BASEGATEWAY", //new：此表格与权限相关的菜单编码
    //title: "数据列表",
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
            text: '批量设置前置',
            ref: 'gridSetFront',
            iconCls: 'x-fa fa-cogs'
        },/*{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle'
        }, */{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        }, {
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-minus-circle'
        }],
    }, 
    panelButtomBar:{},
   //排序字段及模式定义
    defSort: [{
        property: "gatewayNo", //字段名
        direction: "ASC" //升降序
    }],
 
    columns:  {        
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
        },{
            text: "前置主键",
            dataIndex: "frontserverId",
            hidden: true
        }, {
            text: "机号",
            dataIndex: "gatewayNo",
            field: {
                xtype: "textfield"
            },
            width: 100,
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",
            field: {
                xtype: "textfield"
            },
            width: 100,
        }, {
            width: 100,
            text: "前置名称",
            dataIndex: "frontServerName",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 100,
            text: "序列号",
            dataIndex: "gatewaySN",
            field: {
                xtype: "textfield"
            }
        }, {
            flex: 1,
            minWidth:150,
            text: "网关IP",
            dataIndex: "gatewayIP",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 80,
            text: "网关状态",
            dataIndex: "gatewayStatus",
            renderer: function(value) {
                switch (value) {
                    case 0:
                        return '<font color=green>启用</font>';
                        break;
                    case 1:
                        return '<font color=red>禁用</font>';
                        break;
                }
            }
        }, {
            width: 100,
            text: "前置IP",
            dataIndex: "frontServerIP",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 100,
            text: "前置端口",
            dataIndex: "frontServerPort",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 80,
            text: "是否启用",
            dataIndex: "frontServerStatus",
            renderer: function(value) {
                switch (value) {
                    case 0:
                        return '<font color=green>启用</font>';
                        break;
                    case 1:
                        return '<font color=red>禁用</font>';
                        break;
                }
            }
        }, {
            width: 100,
            text: "备注",
            dataIndex: "notes",
            field: {
                xtype: "textfield"
            }
        }, {
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 180,
            fixed: true,
            items: [{
                text:'设备参数',  
                style:'font-size:12px;', 
                tooltip: '设备参数',
                ref: 'buttonBaseAndHigh',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('baseAndHighClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
                text:'网络参数',  
                style:'font-size:12px;', 
                tooltip: '网络参数',
                ref: 'buttonNetWork',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('netWorkClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
   },

});