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
            disabled:true,
            iconCls: 'x-fa fa-toggle-on',
            funCode:'girdFuntionBtn',
            //disabled:true
        },{
            xtype: 'button',
            text: '关闭',
            ref: 'gridClose',
            disabled:true,
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分         
            iconCls: 'x-fa fa-toggle-off'
        },{
            xtype: 'numberfield',
            text: '温度设定',
            ref:'tempSet',
            value:"",
            emptyText: "温度设定",
            allowDecimals:false,
            maxValue:35,
            minValue:17
        },{
            xtype: 'button',
            text: '温度',
            ref: 'gridSet',
            disabled:true,
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle',      
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'deviceTypeCode',
            funCode: 'girdFastSearchText',
            emptyText: '请输入型号名称'
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
        },*/]
    }
});