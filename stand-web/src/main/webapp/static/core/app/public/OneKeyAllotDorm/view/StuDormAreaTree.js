Ext.define("core.public.OneKeyAllotDorm.view.StuDormAreaTree", {
   extend: "core.base.view.BaseTreeGrid",
    alias: "widget.pubonkeyallotdorm.studormareatree",
    dataUrl: comm.get('baseUrl') + "/BaseStudentDorm/getTree",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    selModel: {},
    expandFirst:true,
    al:false,
    extParams: {
         whereSql: "",
         excludes:"checked",
         identity:"0"
    },
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '区域信息',
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
            var mainLayout = view.up("basepanel[xtype=pubonkeyallotdorm.mainlayout]");
            var filter = "[{'type':'string','comparison':'=','value':'0','field':'roomStatus'}";
            filter += ",{'type':'string','comparison':'=','value':'0','field':'isMixed'}]";
           
            var funData = mainLayout.funData;
            mainLayout.funData = Ext.apply(funData, {
                claiId: record.get("id"),
                claiLevel: record.get("level"),
                filter: filter
            });
            // 加载人员信息
            var storeyGrid = mainLayout.down("basegrid[xtype=pubonkeyallotdorm.selectdormgrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            proxy.extraParams = {
                filter: filter,
                areaId:record.get("id")
            };
            store.loadPage(1); // 给form赋值
            return false;
        }
    }
})