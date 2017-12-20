Ext.define("core.baseset.studentdorm.view.DormAllotTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.baseset.studentdorm.dormallottree",
    displayField: "text",
    model: "com.zd.school.plartform.comm.model.CommTree",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/classtreelist",
    extParams: {
        excludes: "checked",
    },
    selModel: {},
    expandFirst:true,
    sortableColumns:false,
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '数据列表',
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
   columns:{
    defaults:{
            titleAlign:"center"
        },
    items:[{
            text: "区域名称",
            dataIndex: "text",
            xtype:'treecolumn',
            flex: 1,
            minWidth:200
        },{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
  },
     listeners: {
        itemclick: function(view, record, item, index, e) {
            var detailLayout = view.up("basepanel[xtype=baseset.studentdorm.dormallotLayout]");
            var filter = "[{'type':'string','comparison':'=','value':'" + record.get("id") + "','field':'claiId'}]";
            var funData = detailLayout.funData;
            detailLayout.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                filter: filter
            });
            // 加载班级宿舍列表
             var classDormGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.classdormgrid]");
             var store = classDormGrid.getStore();
             var proxy1 = store.getProxy();
             proxy1.extraParams = {
                filter: filter
            };
            store.loadPage(1); 
            //获取未分配宿舍学生列表
            var dormNotAllotGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.dormnotallotgrid]");
            var dormNotAllotGridstore = dormNotAllotGrid.getStore();
            var proxy2 = dormNotAllotGridstore.getProxy();
            whereSql = " where studentId not in (select stuId from DormStudentDorm where isDelete=0) and claiId='" + record.get("id") + "' and isDelete=0";
            proxy2.extraParams = {
               // filter: filter,
                whereSql: whereSql,
                classId:record.get("id")
            };
            dormNotAllotGridstore.loadPage(1);
            

            //获取到已分配的grid
            var dormAllotFinshGrid = detailLayout.down("basegrid[xtype=baseset.studentdorm.dormallotfinishgrid]");
            var dormAllotFinshGridStore = dormAllotFinshGrid.getStore();
            var proxy3 = dormAllotFinshGridStore.getProxy();
            proxy3.extraParams = {
                claiId:record.get("id")
            };
            dormAllotFinshGridStore.loadPage(1); //刷新

        }
    }
});