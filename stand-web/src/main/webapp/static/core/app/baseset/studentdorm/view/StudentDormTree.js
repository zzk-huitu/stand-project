Ext.define("core.baseset.studentdorm.view.StudentDormTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.studentdorm.studentdormtree",
    displayField: "text",
    model: "com.zd.school.plartform.comm.model.CommTree",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classtreelist",
    /*dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",*/
    extParams: {
        excludes: "checked",
        whereSql: ""
    },
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '宿舍分配',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: '',
            titleAlign:'right',
    }]
},
   columns:{
    defaults:{
            titleAlign:"center"
        },
    items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1,
            minWidth:250
        }, {
            text: "顺序号",
            dataIndex: "orderIndex",
            width:100
        },{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
  },
     listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("basepanel[xtype=baseset.studentdorm.mainlayout]");
            var basetreegrid = mainLayout.down("basetreegrid[xtype=baseset.studentdorm.studentdormtree]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'claiId'},{'type':'integer','comparison':'=','value':0,'field':'isDelete'}]";
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                claiLevel: record.get("level"),
                filter: filter
            });
            // 加载人员信息
            var storeyGrid = mainLayout.down("panel[xtype=baseset.studentdorm.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter,
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
});