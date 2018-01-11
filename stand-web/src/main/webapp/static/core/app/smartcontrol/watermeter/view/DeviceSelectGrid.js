Ext.define("core.smartcontrol.watermeter.view.DeviceSelectGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.smartcontrol.watermeter.deviceselsectgrid",
    //title: "<font color='#ffeb00'>选中的设备 (双击移除)</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
    viewConfig: {
        stripeRows: true
    },
    store: {
        type: "smartcontrol.watermeter.isselectstore"
    },

    tbar:[{
        xtype: 'tbtext',
        html: '选中的设备（双击移除）',
        style: {
            fontSize: '16px',
            color: '#C44444',
            fontWeight:800,
            lineHeight:'32px'
        }
    }],

    columns:  {        
        defaults:{
            titleAlign:"center"
        },
        items: [{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        },{
            text: "设备名称",
            dataIndex: "termName",
            minWidth:80,
            flex:1
        },{
            text: "序列号",
            dataIndex: "termSN",
            minWidth:80,
            flex:1
        },  {
            text: "设备类型",
            dataIndex: "termTypeID",
            columnType: "basecombobox", //列类型
            ddCode: "PTTERMTYPE", //字典代码
            minWidth:80,
            flex:1
        },{
            text: "房间名称",
            dataIndex: "roomName",
            minWidth:80,
            flex:1
        }]
    },

    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforedrop:function(node, data, overModel, dropPosition, dropHandlers){             
                var newRec=data.records;
                var arrays=new Array();
                
                var isSelectStore = this.grid.getStore();
                var oldRec=isSelectStore.getData().items;
                var isExist=null;
                for(var i in newRec){
                    isExist=false;
                    for(var j in oldRec){
                        if(newRec[i].get("uuid")==oldRec[j].get("uuid")){
                            //isSelectStore.remove(oldRec[j]);   //方式一：移除右边的原有数据
                            //this.refresh();
                            isExist=true;
                            break;
                        }                  
                    }
                    if(isExist==false)
                        arrays.push(newRec[i]);                        
                }
                
                if(arrays.length==0)
                    return false;
                else /*if(newRec.length==arrays.length)*/
                    data.records=arrays;    //方式二：移除左边的数据
                //return false;
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=smartcontrol.watermeter.binddetaillayout]");
                var selectGrid = basePanel.down("basegrid[xtype=smartcontrol.watermeter.devicegrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
    
});