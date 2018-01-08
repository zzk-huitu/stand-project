Ext.define("core.reportcenter.ptectermstatus.view.RoomInfoTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.reportcenter.ptectermstatus.roominfotree",
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