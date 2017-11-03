Ext.define("core.accesscontrol.useraccess.view.MjUserrightGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.accesscontrol.useraccess.mjuserrightgrid",
    al: false,
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    
    selModel: {
        selType: "checkboxmodel",
        width: 10,
        listeners: {
            selectionchange:function(model,selected,eOpts){
                var grid=model.view;
                var selectRow=model.getSelection();
                var uuids=new Array();
                for (var i = 0; i < selectRow.length; i++) {
                    var temp=selectRow[i].data;
                    uuids.push(temp.uuid);
                }
                var uuid = uuids.join(",");
                var mainlayout = grid.up('panel[xtype=accesscontrol.useraccess.mainlayout]');
                var baseGrid = mainlayout.down('panel[xtype=accesscontrol.useraccess.maingrid]');
                var stores = baseGrid.getStore();
                var proxys = stores.getProxy();
                var filter = "[{'type':'string','comparison':'in','value':'"+uuid +"','field':'termId'}]";
                proxys.extraParams = {
                		filter: filter
                };
                stores.load(); //刷新
            }
        }
    },
    
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间下属设备',
            style: {
                fontSize: '14px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
        	xtype: 'tbtext',
        	height:32,
            html: '',
          }],
    }, 
    panelButtomBar:null,
    
    extParams: {
        whereSql: ""
    },
    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        text: "设备名称",
        dataIndex: "termName",
        flex:1
    }, {
        text: "序列号",
        dataIndex: "termSN",
        width:100
    }, {
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE", //字典代码
        width:100	
    }],
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