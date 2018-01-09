Ext.define("core.reportcenter.eleccount.view.RoomInfoTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.reportcenter.eleccount.roominfotree",
    dataUrl: comm.get('baseUrl') + "/BaseRoomarea/list",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    expandFirst:true,
    sortableColumns:false,
    selModel: {
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
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=reportcenter.eleccount.mainlayout]");
            var level = record.get('level');
            var storeyGrid = mainLayout.down("panel[xtype=reportcenter.eleccount.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            if (level == 1 || level == 2) {
                mainLayout.funData.wheresql1 = "";
                return false
            }
            if (level == 3) {
                var selRecords = new Array();
                for (var i = 0; i < record.childNodes.length; i++) {
                    selRecords.push("''" + record.data.children[i].id + "''");
                }
                proxy.extraParams = {
                    wheresql1: "'f.AREA_ID in (" + selRecords.join(',') + ")" + "'",
                    wheresql2: mainLayout.funData.wheresql2
                };
                mainLayout.funData.wheresql1 = "'f.AREA_ID in (" + selRecords.join(',') + ")" + "'";
            }
            if (level == 4) {
                proxy.extraParams = {
                    wheresql1: "'f.AREA_ID=''" + record.raw.id + "'''",
                    wheresql2: mainLayout.funData.wheresql2
                };
                mainLayout.funData.wheresql1 = "'f.AREA_ID=''" + record.raw.id + "'''";
            }
            if (level == 5) {
                proxy.extraParams = {
                    wheresql1: "'D.ROOM_ID=''" + record.get('id') + "'''",
                    wheresql2: mainLayout.funData.wheresql2
                };
                mainLayout.funData.wheresql1 = "'D.ROOM_ID=''" + record.get('id') + "'''";
            }
            store.load(); // 给form赋值'
            return false;
        }
    }

})