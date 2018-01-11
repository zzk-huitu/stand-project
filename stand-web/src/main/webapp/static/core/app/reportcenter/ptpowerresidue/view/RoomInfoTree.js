Ext.define("core.reportcenter.ptpowerresidue.view.RoomInfoTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.reportcenter.ptpowerresidue.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BaseRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    expandFirst:true,
    sortableColumns:false,
    selModel: {
      //  mode : 'single',

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
       whereSql: "  and level IN(1,2,3,4) OR (level=5 AND id IN(SELECT ROOM_ID FROM dbo.BUILD_T_DORMDEFINE WHERE ISDELETE=0 AND DORM_ID IN(SELECT DORM_ID FROM dbo.JW_T_CLASSDORMALLOT WHERE ISDELETE=0 AND CDORM_ID IN(SELECT CDORM_ID FROM dbo.DORM_T_STUDENTDORM WHERE ISDELETE=0)))) ",
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
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=reportcenter.ptpowerresidue.mainlayout]");
            var storeyGrid = mainLayout.down("panel[xtype=reportcenter.ptpowerresidue.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            mainLayout.funData.filter = "[{'type':'string','comparison':'=','value':'" + record.get('id') + "','field':'roomId'}]";
            proxy.extraParams = {
                roomId: record.get('id') 
            };
            store.load(); // 给form赋值
            return false;
        }
    }
})