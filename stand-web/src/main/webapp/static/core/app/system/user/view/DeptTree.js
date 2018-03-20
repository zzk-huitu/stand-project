Ext.define("core.system.user.view.DeptTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.system.user.depttree",
    //dataUrl: comm.get('baseUrl') + "/SysOrg/treeList",
    dataUrl: comm.get('baseUrl') + "/SysOrg/getUserRightDeptTree",
    model: "com.zd.school.plartform.baseset.model.BaseOrgTree",
    al: true,
    expandFirst:true,
    scrollable:true,
    title: "部门列表",
    selModel: {
        selType: ""
    },
    extParams: {
        whereSql: " and isDelete='0' ",
        orderSql: " order by parentNode,orderIndex asc",
        excludes:"checked"      //排除这个字段，不显示复选框
    },

    columnLines:false,
    multiSelect: false,
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
            var mainlayout = tree.up("basepanel[xtype=system.user.mainlayout]");
            var mianGrid = mainlayout.down("basegrid[xtype=system.user.usergrid]");
            var store = mianGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams.deptId="";
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
            var mainLayout = grid.up("panel[xtype=system.user.mainlayout]");        
            var userGrid = mainLayout.down("panel[xtype=system.user.usergrid]");
            var store = userGrid.getStore();
            var proxy = store.getProxy();

            var deptId = record.get("id");
            var isRight = record.get("isRight"); 
            var deptType =record.get("deptType");

            if(deptId!='2851655E-3390-4B80-B00C-52C7CA62CB39'&&record.get("isRight")==0){
                proxy.extraParams = {
                    deptId: "0",
                };
                store.loadPage(1);
                return false;
            }


            Ext.apply(mainLayout.funData, {
                deptId: record.get("id"),
                isRight:record.get("isRight"),
                deptType:record.get("deptType")
            });
         
              //获取快速搜索框的参数
            var girdSearchTexts = userGrid.query("field[funCode=girdFastSearchText]");
            var filter=new Array();
            if(girdSearchTexts[0].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[0].getValue(), "field": "userName", "comparison": ""})
            }
            if(girdSearchTexts[1].getValue()){
                filter.push({"type": "string", "value": girdSearchTexts[1].getValue(), "field": "xm", "comparison": ""})
            }
            if(filter.length==0)
                filter=null;
            else 
                filter = JSON.stringify(filter);
            
            proxy.extraParams = {
                deptId: record.get("id"),
                filter:filter
            };
            store.loadPage(1);
         }
    }
});