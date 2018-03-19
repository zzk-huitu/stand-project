Ext.define("core.baseset.studentdorm.view.StudentDormTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.studentdorm.studentdormtree",
    displayField: "text",
    model: "com.zd.school.plartform.comm.model.CommTree",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classtreelist",
    extParams: {
        excludes: "checked",
        whereSql: ""
    },
    
    expandFirst:true,
    sortableColumns:false,
    selModel: {},
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '班级列表',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh',
            titleAlign:'right',
    }]
  },
 /*  columns:{
    defaults:{
            titleAlign:"center"
        },
    items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1,
            minWidth:250
        }/*, {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:100
        },{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
  },*//*
     listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=baseset.studentdorm.mainlayout]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'claiId'}]";
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                filter: filter
            });
            // 加载人员信息
            var storeyGrid = mainLayout.down("basegrid[xtype=baseset.studentdorm.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                claiId:record.get("id"),
               // filter: filter,
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }*/
});