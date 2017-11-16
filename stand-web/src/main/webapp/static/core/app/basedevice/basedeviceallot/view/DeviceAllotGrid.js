Ext.define("core.basedevice.basedeviceallot.view.DeviceAllotGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.basedevice.basedeviceallot.deviceallotgrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/getNoAllotList",
    model: "com.zd.school.control.device.model.PtTerm",
    al:true,
    pageDisplayInfo:false,  //不显示分页数据信息
    frame: false,
    columnLines: false,
    extParams: {
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '未分配的设备（双击添加）',
            style: {
                fontSize: '16px',
                color: '#C44444',
                fontWeight:800
            }
        },'->',{
            xtype: 'tbtext', 
            html:'快速搜索：'
        },{
            xtype:'textfield',
            width:100,
            name:'termSN',
            dataType:'string',
            funCode:'girdFastSearchText', 
            emptyText: '序列号'
        },{
            xtype:'numberfield',
            width:100,
            name:'termNo',
            dataType:'numeric',
            funCode:'girdFastSearchText', 
            value:'',
            emptyText: '机号'
        },{
            xtype: 'button',            
            ref: 'gridFastSearchBtn',  
            funCode:'girdSearchBtn',    //指定此类按钮为girdSearchBtn类型 
            iconCls: 'x-fa fa-search',  
        }],
    }, 
    panelButtomBar:null,
    
    //排序字段及模式定义
    defSort: [{
        property: 'createTime',
        direction: 'DESC'
    }],
    extParams: {},
    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            flex:1,
            minWidth:100,
            text: "序列号",
            dataIndex: "termSN",
            renderer: function(value, metaData) {
                var title = "序列号";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            width:100,
            text: "机号",
            dataIndex: "termNo",
            renderer: function(value, metaData) {
                var title = "机号";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            width:100,
            text: "设备名称",
            dataIndex: "termName",
            renderer: function(value, metaData) {
                var title = "设备名称";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            width:100,
            text: "网关名称",
            dataIndex: "gatewayName",
            renderer: function(value, metaData) {
                var title = "网关名称";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            width:100,
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE" //字典代码
        }]
    },

    listeners: {
        beforeitemdblclick: function(grid, record, item, index, e, eOpts) {

            var mainlayout = grid.up('panel[xtype=basedevice.basedeviceallot.deviceallotlayout]');
            var deviceSysGrid = mainlayout.down("panel[xtype=basedevice.basedeviceallot.devicesysgrid]");
            var tree = mainlayout.down("basetreegrid[xtype=basedevice.basedeviceallot.roominfotree2]");
            var treelevel = tree.getSelectionModel().getSelection()[0];
            if (treelevel == null) {
                Ext.example.msg("提示", "请选择房间!");
                return false;
            }
        
            var leaf = treelevel.get('leaf');
            if (leaf != true) {
                Ext.example.msg("提示", "只能选择房间进行操作!");
                return false;
            }


            var selectStore = grid.getStore();
            selectStore.removeAt(index);

            var basePanel = grid.up("panel[xtype=basedevice.basedeviceallot.deviceallotlayout]");
            var isSelectGrid;
            if(basePanel){
                isSelectGrid = basePanel.down("panel[xtype=basedevice.basedeviceallot.devicesysgrid]");
                var isSelectStore = isSelectGrid.getStore();

                var roomName = treelevel.get('text');
                var roomId = treelevel.get('id');            
                record.set("roomName",roomName);
                record.set("roomId",roomId);
                //record.commit();

                isSelectStore.insert(0, record);
            }
            
            return false;
        }
    }
    
    
});