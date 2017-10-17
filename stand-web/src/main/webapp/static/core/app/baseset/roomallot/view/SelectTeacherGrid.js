Ext.define("core.baseset.roomallot.view.SelectTeacherGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.baseset.roomallot.selectteachergrid",
    dataUrl: comm.get('baseUrl') + "/BaseOfficeAllot/teacherAllot",
    model: "com.zd.school.plartform.system.model.SysUser",
    al:false,
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html:'快速搜索：'
        },{
            xtype:'textfield',
            name:'xm',
            funCode:'girdFastSearchText',
            emptyText: '请输入教师姓名'
        },{
            xtype: 'button',
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型
            ref: 'gridFastSearchBtn',
            iconCls: 'x-fa fa-search'
        }]
    },
    /**
     * 高级查询面板
     */
     panelButtomBar: null,
     viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
                var data = record.data;
                selectStore = grid.getStore();

                var basePanel = grid.up("basepanel[xtype=baseset.roomallot.selectteacherlayout]");
                var isSelectGrid;
                if(basePanel){
                    
                    isSelectGrid = basePanel.down("panel[xtype=baseset.roomallot.isselectteachergrid]");
                    var isSelectStore = isSelectGrid.getStore();
                    for (var i = 0; i < isSelectStore.getCount(); i++) {
                        if (data.userNumb == isSelectStore.getAt(i).get('userNumb')) {
                            Ext.Msg.alert("提示", "该教师已存在!");
                            return;
                        }
                    };

                    selectStore.removeAt(index);
                    isSelectStore.insert(0, [record]);
                }

                return false;
            }
        }
    },


    defSort: [{
        property: "createTime", //字段名
        direction: "DESC" //升降序
    }],

    extParams: {
        filter: '[{"type":"string","comparison":"=","value":"1","field":"category"}]',
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
            dataIndex: "userNumb",
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
            columnType: "basecombobox",
            ddCode: "XBM"
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
    emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});
