Ext.define("core.basedevice.basedeviceallot.view.RoominfoTree2", {
	extend: "core.base.view.BaseTreeGrid",
    alias: "widget.basedevice.basedeviceallot.roominfotree2",
    dataUrl: comm.get('baseUrl') + "/BasePtIrRoomDevice/treelist",
    model: "com.zd.school.build.define.model.BuildRoomAreaTree",
    al: true,
    forceFit:true,
    selModel: {
      
    },
    extParams: {
        whereSql: "",
        orderSql: "",
        excludes:"checked"
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
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "区域名称",
            dataIndex: "text",
            xtype: 'treecolumn',
        }, {
            text: "主键",
            dataIndex: 'id',
            hidden: true
        }]
    },
    
    listeners: {
    	 beforeitemclick: function() {
    	        return false;
    	    }
    }
   
});