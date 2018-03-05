Ext.define("core.smartcontrol.watermeter.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.smartcontrol.watermeter.maingrid",
	dataUrl: comm.get("baseUrl") + "/BasePtSkMeter/list", //数据获取地址
	model: "com.zd.school.control.device.model.PtSkMeter", //对应的数据模型
    menuCode:"WATER_METER",
	//工具栏操作按钮
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'button',
            text: '添加',
            ref:'gridAdd_Tab',
            iconCls: 'x-fa fa-plus-circle',
            funCode:'girdFuntionBtn',
            //disabled:true
        },{
            xtype: 'button',
            text: '计量绑定',
            ref: 'gridBinding',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-link'
        },{
            xtype: 'button',
            text: '编辑',
            ref: 'gridEdit_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            disabled:true,
            iconCls: 'x-fa fa-pencil-square'
        },{
            xtype: 'button',
            text: '删除',
            ref: 'gridDelete',
            funCode:'girdFuntionBtn',
            iconCls: 'x-fa fa-minus-circle',
            disabled:true
        }]
    },
    defSort: [{
    	property: 'updateTime',
    	direction: 'DESC'
    }],
    panelButtomBar:{},
	//扩展参数
	extParams: {
		
	},
	columns:{        
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
            text: "计量数（脉冲数/升）",
            dataIndex: "measure",
            width:200,
        },{
            text: "备注",
            dataIndex: "notes",
            flex:1,
        }, {
            text: "更新时间",
            dataIndex: "updateTime",
            width:200,
        },{
            xtype: 'actiontextcolumn',
            text: "操作",
            align: 'center',
            width: 100,
            fixed: true,
            items: [{
                text:'详情',  
                style:'font-size:12px;', 
                tooltip: '详情',
                ref: 'gridDetail',                
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            },{
                text:'计量设备',  
                style:'font-size:12px;', 
                tooltip: '计量设备',
                ref: 'meterBingTerm',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="WATER_METER";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_meterBingTerm")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('meterBingClick', {
                        view: view.grid,
                        record: rec
                    });
                }
            }]
        }]
    }
});