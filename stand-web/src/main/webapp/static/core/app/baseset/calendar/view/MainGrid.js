Ext.define("core.baseset.calendar.view.MainGrid", {
	extend: "core.base.view.BaseGrid",
	alias: "widget.baseset.calendar.maingrid",
	dataUrl: comm.get('baseUrl') + "/BaseCalenderdetail/list",
	model:factory.ModelFactory.getModelByName("com.zd.school.jw.eduresources.model.JwCalenderdetail","checked").modelName,
    al:false,
    menuCode:"SCHOOLCALENDAR", //new：此表格与权限相关的菜单编码
	//title:'作息时间详细信息',
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '作息时间详细信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'button',
            text: '添加',
            ref: 'gridAdd_Tab',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-plus-circle',
            disabled:false,
        },{
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
        },{
            xtype: 'button',
            text: '导出',
            ref: 'gridExport',
            funCode:'girdFuntionBtn',   //指定此类按钮为girdFuntionBtn类型，用于于右边的按钮进行功能区分
            iconCls: 'x-fa fa-file-excel-o'
        }],
    }, 
    panelButtomBar:{},
   //排序字段及模式定义
    defSort: [{
        property: 'beginTime',
        direction: 'ASC'
    },{
        property: 'isafgernoon',
        direction: 'ASC'
    },{
        property: 'updateTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
       items: [{
		text: "主键",
		dataIndex: "uuid",
		hidden: true
	},{
		text: "外键",
		dataIndex: "canderId",
		hidden: true
	},{
        xtype: "rownumberer",
        flex:0,
        width: 50,
        text: '序号',
        align: 'center'
    }, {
       flex: 1,
        minWidth: 100,
       text: "时辰",
       dataIndex: "isafgernoon",
       field: {
         xtype: "textfield"
		},
		renderer: function(value) {
            var re = value;
            switch (value) {
                case 0:
                    re = '上午';
                    break;
                case 1:
                    re = '下午';
                    break;
                case 2:
                    re = '晚上';
                    break;
            }

            return re;
        }
	}, {
		text: "节次名称",
		dataIndex: "jcName",
		field: {
			xtype: "textfield"
		},
		flex: 1,
        minWidth: 100
	}, { 
		flex: 1,
        minWidth: 100,
		text: "开始时间",
		dataIndex: "beginTime",
		//renderer: Ext.util.Format.dateRenderer('H:i')
		renderer:function(v){
			if(v.trim()!=""){
	            var date=v.replace(new RegExp(/-/gm) ,"/");  
	            return Ext.Date.format(new Date(date), 'H:i');
	        }else
	        	return "";
        },
        
	}, {
		flex: 1,
        minWidth: 100,
		text: "结束时间",
		dataIndex: "endTime",
		//renderer: Ext.util.Format.dateRenderer('H:i')
		renderer:function(v){
			if(v.trim()!=""){
	            var date=v.replace(new RegExp(/-/gm) ,"/");       
	            return Ext.Date.format(new Date(date), 'H:i');
	        }else
	        	return "";
        	}
	},{
        flex: 1,
        minWidth: 100,
        text: "是否考勤",
        dataIndex: "needSignIn",
        renderer: function(v) {
            if (v == 1) {
                return "<span style='color:green'>需要</span>";
            } else {
                return "<span style='color:red'>不需要</span>";
            }

        }
    }/*, {
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
            }, {
                text:'详细',  
                style:'font-size:12px;', 
                tooltip: '详细',
                ref: 'gridDetail',
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('detailClick_Tab', {
                        view: view.grid,
                        record: rec
                    });
                }
            }, {
                text:'删除',  
                style:'font-size:12px;', 
                tooltip: '删除',
                ref: 'gridDelete',
                getClass :function(v,metadata,record,rowIndex,colIndex,store){                            
                    if(comm.get("isAdmin")!="1"){
                        var menuCode="SCHOOLCALENDAR";     // 此菜单的前缀
                        var userBtn=comm.get("userBtn");                 
                        if(userBtn.indexOf(menuCode+"_gridDelete")==-1){
                            return 'x-hidden-display';
                        }
                    }
                    return null; 
                },  
                handler: function(view, rowIndex, colIndex, item) {
                    var rec = view.getStore().getAt(rowIndex);
                    this.fireEvent('deleteClick', {
                        view: view.grid,
                        record: rec
           
                 });
                }
            }]
        }*/]
    }
	
	
});