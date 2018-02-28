Ext.define("core.basedevice.baserate.view.SkDataGridTwo", {
    extend: "Ext.grid.Panel",
    alias: "widget.basedevice.baserate.skdatagridtwo",
    extParams: {},
    title: "<font color=#ffeb00>已选设备(向左拖动或双击移除)</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        selType: "checkboxmodel",
        width: 10
    },
     store: {
        type: "basedevice.baserate.isselectstore"
    },
    viewConfig: {
        stripeRows: true
    },

    columns: [{
        text: "主键",
        dataIndex: "uuid",
        hidden: true
    }, {
        flex:1,
        minWidth:100,
        text: "设备名称",
        dataIndex: "termName",
        field: {
            xtype: "textfield"
        }
    }, {
        flex:1.2,
        minWidth:120,
        text: "序列号",
        dataIndex: "termSN",
        field: {
            xtype: "textfield"
        }
    }, /*{
        width:100,
        text: "设备类型",
        dataIndex: "termTypeID",
        columnType: "basecombobox", //列类型
        ddCode: "PTTERMTYPE" //字典代码
    }*/],
     viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
            drop: function(node, data, dropRec, dropPosition) {
                //var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
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
                else/* if(newRec.length==arrays.length)*/
                    data.records=arrays;    //方式二：移除左边的数据
                //return false;
            },        
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=basedevice.baserate.dkmainlayout]");
                var selectGrid = basePanel.down("basegrid[xtype=basedevice.baserate.skdatagrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    },

});