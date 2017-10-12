Ext.define("core.baseset.roomallot.view.IsSelectRoomGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.baseset.roomallot.isselectroomgrid",
    extParams: {},
    ref: 'isselectroomgrid',
    title: "<font color=#ffeb00>已选人员(选中后向左拖动或双击删除)</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
     store: {
        type: "baseset.roomallot.isselectroomstore"
    },
    viewConfig: {
        stripeRows: true
    },
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            minWidth:120,
            flex:1,
            text: "教师工号",
            dataIndex: "gh",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
            text: "教师姓名",
            dataIndex: "xm",
            field: {
                xtype: "textfield"
            }
        }, {
            width:100,
            text: "教师性别",
            dataIndex: "xbm",
            renderer: function(value) {
                switch (value) {
                    case '1':
                    return '男';
                    break;
                    case '2':
                    return '女';
                    break;
                }
            },
            field: {
                xtype: "textfield"
            }
        },{
            width:100,
            text: "部门",
            dataIndex: "deptName"
        }, {
            width:100,
            text: "岗位",
            dataIndex: "jobName"
        }]
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("basepanel[xtype=baseset.roomallot.selectroomlayout]");
                var selectGrid = basePanel.down("panel[xtype=baseset.roomallot.selectroomgrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    },
})