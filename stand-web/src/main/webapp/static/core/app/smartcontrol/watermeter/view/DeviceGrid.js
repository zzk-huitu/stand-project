Ext.define("core.smartcontrol.watermeter.view.DeviceGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.smartcontrol.watermeter.devicegrid",
    dataUrl: comm.get('baseUrl') + "/BasePtTerm/list",
    model: "com.zd.school.control.device.model.PtTerm",
    al:false,
    pageDisplayInfo:false,  //不显示分页数据信息
    frame: false,
    columnLines: false,
    extParams: {
        filter:'[{"type":"string","value":"8","field":"termTypeID","comparison":"="}]'
    },
    panelTopBar:{
        xtype:'toolbar',
        items: [{
            xtype: 'tbtext',
            html: '房间设备（向右拖动或双击选择）',
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
            emptyText: '请输入序列号'
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
  
    columns:  {    
           
        defaults:{
            titleAlign:"center",
        },
        items: [{
            xtype: "rownumberer",
            width: 50,
            text: '序号',
            align: 'center'
        },{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            flex:1,
            minWidth:80,
            text: "设备名称",
            dataIndex: "termName",
            renderer: function(value, metaData) {
                var title = "设备名称";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        },{
            flex:1,
            minWidth:80,
            text: "序列号",
            dataIndex: "termSN",
            renderer: function(value, metaData) {
                var title = "序列号";
                var html = value;
                metaData.tdAttr = 'data-qtitle="' + title + '" data-qtip="' + html + '"';
                return value;
            }
        }, {
            flex:1,
            minWidth:80,
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE" //字典代码
        },{
            flex:1,
            minWidth:80,
            text: "费率",
            renderer: function(value,cellmeta,record,rowIndex,columnIndex,store) {
                var termTypeID= record.get("termTypeID");
                if(termTypeID=="9"){
                    value=record.get("dkprice");
                }
                if(termTypeID=="8"){
                    value=record.get("skprice");
                }
                return value
            }
        },{
            text: "房间名称",
            dataIndex: "roomName",
            flex:1,
            minWidth:80,
        }]
    },
    viewConfig: {
        stripeRows: false,      
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function(grid, record, item, index, e, eOpts) {
              
                var basePanel = grid.up("panel[xtype=smartcontrol.watermeter.binddetaillayout]");
                var data = record.data;
                var selectStore = grid.getStore();
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=smartcontrol.watermeter.deviceselsectgrid]");
                    
                    var isSelectStore = isSelectGrid.getStore();
                    for (var i = 0; i < isSelectStore.getCount(); i++) {
                        if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                            Ext.Msg.alert("提示", data.termName+"已存在!");
                            return ;
                        }
                    };
                  
                    selectStore.removeAt(index);
                    isSelectStore.insert(0, [record]);
                    
                }
                
                return false;
            }
        }
    },

    
    
});