Ext.define("core.smartcontrol.climatecontrol.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.smartcontrol.climatecontrol.maingrid",
	dataUrl: comm.get("baseUrl") + "/BasePtIrRoomDevice/list", //数据获取地址
	model: "com.zd.school.control.device.model.PtIrRoomDevice", //对应的数据模型

    menuCode:"CLIMATE_CONTROL",

    al:false,
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '开启',
            ref:'gridOpen',
            iconCls: 'x-fa fa-plus-circle',
            funCode:'girdFuntionBtn',
            //disabled:true
        },{
            xtype: 'button',
            text: '关闭',
            ref: 'gridClose',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分         
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '温度',
            ref: 'gridSet',
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle',      
        },'->',{
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
        }]
    },
    defSort: [{
    	property: 'updateTime',
    	direction: 'DESC'
    }],
    panelButtomBar:{},
	//扩展参数
	extParams: {
        filter: '[{"type":"string","comparison":"","value":"空调","field":"deviceTypeName"}]'
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
        },{
    		text: "主键",
    		dataIndex: "uuid",
    		hidden: true
    	},{
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
            minWidth:100,
        },{
            text: "品牌名称",
            dataIndex: "brandname",
            flex:1,
            minWidth:100,
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                value= (record.get("deviceBrandName")+" - "+record.get("deviceTypeName"));
                return value
            }
        }, {
            text: "型号",
            dataIndex: "deviceTypeCode",
            flex:1,
            minWidth:100,
        }, {
            text: "备注",
            dataIndex: "notes",
            minWidth:200,
            flex:2
        },/*{
            text: "楼层",
            dataIndex: "nodeText",
            width:200,
        },*/{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 150,
            fixed: true,
            items: [{
                text:'开启',  
                style:'font-size:12px;', 
                tooltip: '打开空调',
                ref: 'gridOpen',                
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('opneClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
                text:'关闭',  
                style:'font-size:12px;', 
                tooltip: '关闭空调',
                ref: 'gridClose',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('closeClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            },{
                text:'温度',  
                style:'font-size:12px;', 
                tooltip: '调节温度',
                ref: 'gridSet',              
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('setClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }
});