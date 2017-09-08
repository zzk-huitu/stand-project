Ext.define("core.system.permission.view.MenuTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.system.permission.menutree",
    dataUrl: comm.get('baseUrl') + "/SysMenu/treeList",
    model:"com.zd.school.plartform.system.model.SysMenuTree",
    
    multiSelect: false,
    scrollable:true,
    title: "菜单列表",

    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by parentNode,isHidden,orderIndex asc",
        excludes:"checked"
    },

    columnLines:false,
    selModel: null,
    lines:true,
    useArrows: false,
    viewConfig: {
        stripeRows: false
    },

    tools: [{
        type: 'refresh',
        qtip: '刷新',
        handler: function(event, toolEl, header) {
            var tree = header.ownerCt
            tree.getStore().load();
            tree.getSelectionModel().deselectAll(true);
        }
    }],

    // columns: [{
    //     header: '部门名称',
    //     dataIndex: 'text',
    //     xtype: 'treecolumn',
    //     flex: 1
    // }, {
    //     header: '主负责人',
    //     dataIndex: 'mainLeader'
    // }, {
    //     header: '副负责人',
    //     dataIndex: 'viceLeader'
    // }],
    listeners: {
        itemclick: function(grid, record, item, index, e) {
            
            var mainLayout = grid.up("panel[xtype=system.permisson.mainlayout]");
            var funData = mainLayout.funData;
            funData.defaultObj = Ext.apply(funData.defaultObj, {
                menuId: record.get("id"),
                menuText: record.get("text"),
                perAuthCode: record.get("menuCode"),
                menuType: record.get("menuType"),
            });
            //加载权限信息
            var mainGrid = mainLayout.down("panel[xtype=system.permission.maingrid]");
            var store = mainGrid.getStore();
            var proxy = store.getProxy();
            var filterArry = new Array();
            proxy.extraParams = {
                filter: '[{"type": "string", "value": "'+record.get("id")+'", "field": "menuId", "comparison": ""}]'
            };
            store.loadPage(1);       
        }
    }
});