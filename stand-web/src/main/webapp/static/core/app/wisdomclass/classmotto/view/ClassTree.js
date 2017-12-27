Ext.define("core.wisdomclass.classmotto.view.ClassTree", {
    extend: "core.base.view.BaseTreeGrid",
    alias: "widget.wisdomclass.classmotto.classtree",
    model:" com.zd.school.plartform.comm.model.CommTree",
    dataUrl:comm.get('baseUrl') + "/BaseStudentDorm/classtreelist",
    expandFirst:true,
    selModel: {},
    sortableColumns:false,
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '班级信息',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        }, '->',{
            xtype: 'button',
            text: '刷新',
            ref: 'gridRefresh',
            iconCls: 'x-fa fa-refresh'
        }]
    },
    extParams: {
        excludes: 'checked',
        whereSql: "",
        orderSql: " order by orderIndex asc "
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
            minWidth:150
        }, /*{
            text: "顺序号",
            dataIndex: "orderIndex",
            width:100
        },*/{
            text:"主键",
            dataIndex:'id',
            hidden:true
        }]
    },
    listeners: {
        itemclick: function(view, record, item, index, e) {
            var mainLayout = view.up("panel[xtype=wisdomclass.classmotto.mainlayout]");
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                claiLevel: record.get("level")
            });
            // 加载人员信息
            var grid = mainLayout.down("panel[xtype=wisdomclass.classmotto.maingrid]");
            var store = grid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                claiId: record.get("id"),
            };
            store.load(); // 给form赋值        
        }
    }
});