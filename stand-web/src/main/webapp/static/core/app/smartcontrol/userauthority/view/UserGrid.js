Ext.define("core.smartcontrol.userauthority.view.UserGrid", {
    extend: "core.base.view.BaseGrid",
	alias: "widget.smartcontrol.userauthority.usergrid",
	dataUrl: comm.get('baseUrl') + "/teacherBase/list",
	model: factory.ModelFactory.getModelByName("com.zd.school.plartform.system.model.SysUser", "checked").modelName,
	al: false,
    pageDisplayInfo:false,
	multiSelect: true,
	menuCode:"USER_ACCESS_CONTROL",
	//排序字段及模式定义
	defSort: [{
		property: 'xm',
		direction: 'DESC'
	}],
	extParams: {
		whereSql: "",
		orderSql: ""
	},
	selModel: {
        selType: "checkboxmodel",
        width: 10,
        listeners: {
            selectionchange:function(model,selected,eOpts){
                var grid=model.view;
                var selectRow=model.getSelection();
                var querySql1="";
                var querySql2="";

                var uuids=new Array();
                if(selectRow.length==1){
                	querySql1 = " and USER_ID ="+"'"+selectRow[0].data.uuid+"'";
                }
                if(selectRow.length>1){
                	for (var i = 0; i < selectRow.length; i++) {
                      var temp=selectRow[i].data;
                      uuids.push("'"+temp.uuid+"'");
                  }
                querySql1 = " and USER_ID in (" + uuids.join(",") + ")";
                }
                var mainlayout = grid.up('panel[xtype=smartcontrol.userauthority.mainlayout]');
                var baseGrid = mainlayout.down('panel[xtype=smartcontrol.userauthority.maingrid]');
                //获取快速搜索框的值
                var girdSearchTexts = baseGrid.query("field[funCode=girdFastSearchText]");
                var filter=new Array();
                if(girdSearchTexts[0].getValue()){
                    querySql2+=" and XM like "+"'%"+girdSearchTexts[0].getValue()+"%'";
                    //filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "XM", "comparison": ""});
                }
                if(girdSearchTexts[1].getValue()){
                    querySql2+=" and ROOM_NAME like "+"'%"+girdSearchTexts[1].getValue()+"%'";
                   // filter.push({"type": "string", "value": girdSearchTexts[1].getValue(), "field": "ROOM_NAME", "comparison": ""});
                }
                var stores = baseGrid.getStore();
                var proxy = stores.getProxy();
                proxy.extraParams={
                    querySql:querySql1,
                    querySql2:querySql2
                };
                stores.load(); //刷新
            }
        }
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '人员列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'xm',
            funCode: 'girdFastSearchText',
            emptyText: '请输入姓名'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型  
            iconCls: 'x-fa fa-search',  
        }]
    },
    panelButtomBar:null,
    columns: {        
    	defaults:{
    		titleAlign:"center"
    	},
    	items:[{
    		text: "主键",
    		dataIndex: "uuid",
    		hidden: true
    	}, {
    		text: "编号",
    		dataIndex: "userNumb",
    		flex:1,
    		minWidth:80
    	}, {
    		text: "姓名",
    		dataIndex: "xm",
    		flex:1,
            minWidth:80
    	}, {
    		text: "性别",
    		dataIndex: "xbm",
    		columnType: "basecombobox",
    		ddCode: "XBM",
    		flex:1,
            minWidth:80
    	}, {
    		text: "岗位",
    		dataIndex: "allJobName",
    		flex:1,
            minWidth:80
    	}]
    },
	listeners: {
	        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
	            return false;
	        },
	        beforeitemmousedown: function(grid, record, item, index, e, eOpts) {
	            var model = grid.getSelectionModel();  
	            var flag=model.isSelected(index);
	            if (flag) {
	                model.deselect(index);
	                return false;
	            }
	        }
	    }
});