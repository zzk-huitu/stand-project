Ext.define("core.system.user.view.isSelectRoleGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.system.user.isselectrolegrid",
    dataUrl: comm.get('baseUrl') + "/SysRole/selectList",
    title: "当前已选角色",
    al: false,
    noPagging: true,
    panelTopBar:false,
    panelButtomBar:false,
    viewConfig: {
        stripeRows: false,
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=system.user.selectrolelayout]");
                var selectGrid = basePanel.down("basegrid[xtype=system.user.selectrolegrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    },
    //排序字段及模式定义
    defSort: [{
        property: 'orderIndex',
        direction: 'DESC'
    }],
    extParams: {
        whereSql: "",
        filter: "[{'type':'numeric','comparison':'=','value':0,'field':'isDelete'}]"
    },
    model: 'com.zd.school.plartform.system.model.SysRole',
    columns: { 
        defaults:{
            //flex:1,     //【若使用了 selType: "checkboxmodel"；则不要在这设定此属性了，否则多选框的宽度也会变大 】
            align:'center',
            titleAlign:"center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            text: "角色名称",
            dataIndex: "roleName",
            flex:1
        }, {
            text: "角色编码",
            dataIndex: "roleCode",
            flex:1
        }]
    }
});