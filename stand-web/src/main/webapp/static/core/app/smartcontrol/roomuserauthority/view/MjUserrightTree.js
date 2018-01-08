Ext.define("core.smartcontrol.roomuserauthority.view.MjUserrightTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.smartcontrol.roomuserauthority.mjuserrighttree",
    dataUrl: comm.get('baseUrl') + "/BaseRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    expandFirst:true,
    sortableColumns:false,
    selModel: {
        mode : 'single',
        listeners: {
            selectionchange:function(model,selected,eOpts){
                var grid=model.view;
                var selectRow=model.getSelection();
                var querySql1="";
                var mainlayout = grid.up('panel[xtype=smartcontrol.roomuserauthority.mainlayout]');
                var baseGrid = mainlayout.down('basegrid[xtype=smartcontrol.roomuserauthority.maingrid]');
                var stores = baseGrid.getStore();
                var proxy = stores.getProxy();
                var uuids=new Array();
                if(selectRow.length==1){
                	querySql1 = " and ROOM_ID ="+"'"+selectRow[0].data.id+"'";
                }
                if(selectRow.length>1){
                	for (var i = 0; i < selectRow.length; i++) {
                      var temp=selectRow[i].data;
                      uuids.push("'"+temp.id+"'");
                  }
                querySql1 = " and ROOM_ID in (" + uuids.join(",") + ")";
                }
                proxy.extraParams.querySql = querySql1;
                stores.load(); //刷新
            }
        }
    },
     tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:600
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
        }]
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: "",
        excludes:"checked"
    },
    columns:{
        defaults:{
            titleAlign:"center"
        },
        items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1
        },/* {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:60
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },
})