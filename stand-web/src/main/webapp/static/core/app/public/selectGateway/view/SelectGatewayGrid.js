Ext.define("core.public.selectGateway.view.SelectGatewayGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.public.selectGateway.selectgatewaygrid",
    al:true,
    frame: false,
    columnLines: false,
    dataUrl: comm.get("baseUrl") + "/BaseGateway/list", //数据获取地址
    model: "com.zd.school.control.device.model.PtGateway",
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
    /**
     * 工具栏操作按E钮
     * 继承自core.base.view.BaseGrid可以在此覆盖重写
     */
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'gatewayName',
            funCode:'girdFastSearchText',
            emptyText: '请输入网关名称'
        },{
            xtype:'textfield',
            name:'frontserverId',
            hidden:true,
            funCode:"girdFastSearchText"
        },{
            width:200,
            emptyText: '请选择服务器',
            xtype: "basetreefield",
            //ddCode: "DEPTTREE",
            name:"frontServerName",
            rootId: "ROOT",
            funCode:'girdFastSearchText',
            configInfo: {
                multiSelect: false,
                fieldInfo: "frontServerName~frontserverId,text~id",
                //whereSql: " and isDelete='0' ",
                //orderSql: " order by parentNode,orderIndex asc",
                url:comm.get('baseUrl') + "/BaseGateway/treelist"
            }
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search'
        }]
    },
    /**
     * 高级查询面板
     */
    panelButtomBar: null,
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
                selectStore = grid.getStore();
                selectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=public.selectGateway.selectgatewaylayout]");
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=public.selectGateway.isselectgatewaygrid]");
                    var isSelectStore = isSelectGrid.getStore();
                    isSelectStore.insert(0, [record]);
                }
                
                return false;
            }
        }
    },

    /** 排序字段定义 */
    defSort: [{
        property: "gatewayNo", //字段名
        direction: "ASC" //升降序
    }],
    /** 扩展参数 */
    extParams: {
        whereSql: ""
        //查询的过滤字段
        //type:字段类型 comparison:过滤的比较符 value:过滤字段值 field:过滤字段名
        //filter: "[{'type':'string','comparison':'=','value':'','field':'claiId'}]"
    },
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            xtype: "rownumberer",
            flex:0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            text: "机号",
            dataIndex: "gatewayNo",            
            width: 100,
        }, {
            text: "网关名称",
            dataIndex: "gatewayName",            
            minWidth: 100,
            flex:1
        }, {
            width: 100,
            text: "前置名称",
            dataIndex: "frontServerName",           
        }, {
            width: 100,
            text: "序列号",
            dataIndex: "gatewaySN",            
        },{
            width: 100,
            text: "网关IP",
            dataIndex: "gatewayIP",
        }]
    },
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});