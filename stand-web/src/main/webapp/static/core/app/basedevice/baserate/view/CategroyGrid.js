Ext.define("core.basedevice.baserate.view.CategroyGrid", {
	extend: "Ext.grid.Panel",
    alias: "widget.basedevice.baserate.categroygrid",
    forceFit: true,
    columnLines: true,
    selModel: {
        type: "checkboxmodel",   
        headerWidth:40,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        mode:'single',  //multi,simple,single；默认为多选multi
    },
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
        text: "类别",
        dataIndex: "categroy",
    }],
    listeners: {
        itemclick: function(view, record) {
            var mainLayout = view.up("panel[xtype=basedevice.baserate.mainlayout]");
            var categroy = record.get('categroy');
            var storeyGrid = mainLayout.down("panel[xtype=basedevice.baserate.maingrid]");
            var store = storeyGrid.getStore();
            var proxy = store.getProxy();
            if(categroy==="水控"){
            	proxy.extraParams = {
            			categroy: "0",
                    };
            }
            if(categroy==="电控"){
            	proxy.extraParams = {
            			categroy: "1",
                    };
            }
            store.load(); // 给form赋值
            return false;
        }
    }
    
});