Ext.define("core.basedevice.baserate.view.CategroyGrid", {
	extend: "Ext.grid.Panel",
    alias: "widget.basedevice.baserate.categroygrid",
    forceFit: true,
    sortableColumns:false,
    columnLines: true,
    selModel: null,
    store:{
    	type:"basedevice.baserate.categroystore",
    },
    extParams: {
        whereSql: ' and isDelete=0',
        filter: ''
    },
    tbar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
//            height:33,
            html: '控制类型',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
        	xtype: 'tbtext',
          height:33,
          html: '',
        }]
    },
    columns:  [{
        xtype: "rownumberer",
        width: 50,
        text: '序号',
        align: 'center'
    }, {
        text: "类别名称",
        dataIndex: "categroy",
    }],
    listeners: {
        itemclick: function(view, record) {
            var mainLayout = view.up("panel[xtype=basedevice.baserate.mainlayout]");
            var funData = mainLayout.funData;
            var categroy = record.get('categroy');
            var categroyValue="";
            var storeyGrid = mainLayout.down("panel[xtype=basedevice.baserate.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            if(categroy==="水控"){
                categroyValue="0"
            }
            if(categroy==="电控"){
                categroyValue="1"
            }
            proxy.extraParams = {
                categroy: categroyValue
            };
            mainLayout.funData = Ext.apply(funData, {
              categroy:categroyValue
           });
            store.load(); // 给form赋值
            return false;
        }
    }
    
});