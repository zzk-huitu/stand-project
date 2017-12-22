Ext.define("core.public.SelectRoom.view.IsSelectRoomGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.pubselect.isselectroomgrid",
    ref: 'isselectroomgrid',
    title: "<font color='#ffeb00'>已选房间(选中后向左拖动或双击移除）</font>",
    columnLines: true,
    loadMask: true,
    multiSelect: true,
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
    viewConfig: {
        stripeRows: true
    },
    store: {
        type: "class.isselectedteacherStore"
    },
    columns: {
        defaults: {
            titleAlign: "center"
        },
        items: [{
            xtype: "rownumberer",
            flex: 0,
            width: 50,
            text: '序号',
            align: 'center'
        }, {
            width: 100,
            text: "所属楼栋",
            dataIndex: "areaUpName"
        }, {
            width: 100,
            text: "所属楼层",
            dataIndex: "areaName"
        }, {
            flex: 1,
            text: "房间名称",
            dataIndex: "roomName"
        }/*, {
            width: 100,
            text: "房间类型",
            dataIndex: "roomType",
            columnType: "basecombobox",
            ddCode: "FJLX"
        }*/]
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

                var basePanel = grid.up("panel[xtype=pubselect.selectroomlayout]");
                var selectGrid = basePanel.down("basegrid[xtype=pubselect.selectroomgrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
});