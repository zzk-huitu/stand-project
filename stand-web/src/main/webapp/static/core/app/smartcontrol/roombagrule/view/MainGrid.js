Ext.define("core.smartcontrol.roombagrule.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.smartcontrol.roombagrule.maingrid",
	dataUrl: comm.get("baseUrl") + "/PtRoombagRule/list", //数据获取地址
	model:"com.zd.school.control.device.model.PtRoomBagRule", //对应的数据模型
    menuCode:"CLASSELEGANT",
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
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'roomRuleName',
            funCode: 'girdFastSearchText',
            emptyText: '房间规则名称'
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
            text: "房间规则名称",
            dataIndex: "roomRuleName",
            flex:1.2,
            minWidth:120,
        },{
            text: "允许关电开始时间",
            dataIndex: "shutDownStart",
            width:150,      
            renderer: function(v) {
                if (v.trim() != "") {
                    var date = v.replace(new RegExp(/-/gm), "/");
                    return Ext.Date.format(new Date(date), 'H:i:s');
                } else return "";
            }
        }, {
            text: "允许关电结束时间",
            dataIndex: "shutDownEnd",
            width:150,
            renderer: function(v) {
                if (v.trim() != "") {
                    var date = v.replace(new RegExp(/-/gm), "/");
                    return Ext.Date.format(new Date(date), 'H:i:s');
                } else return "";
            }
        }, {
            text: "无余额控制方式",
            dataIndex: "noMoneyMode",
            flex:1.2,
            minWidth:120,        
            columnType: "basecombobox", //列类型
            ddCode: "WYEKZFS" //字典代码
        }, {
            text: "报警金额",
            dataIndex: "warnvalue",
            flex:0.8,
            minWidth:80,
        }, {
            text: "扣费模式",
            dataIndex: "deDuctionMode",
            flex:0.8,
            minWidth:80,
            columnType: "basecombobox", //列类型
            ddCode: "KFMS" //字典代码
        }, {
            text: "扣费金额",
            dataIndex: "deDuctionValue",
            flex:0.8,
            minWidth:80,
        }, {
            text: "状态",
            dataIndex: "isEnable",
            width:80,
            renderer: function(value) {
                switch (value) {
                    case 1:
                        return '<font color=green>启用</font>';
                        break;
                    case 0:
                        return '<font color=red>禁用</font>';
                        break;
                }
            }
        }]
    }
});