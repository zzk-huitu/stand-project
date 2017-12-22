Ext.define("core.public.OneKeyAllotDorm.view.IsSelectDormGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.pubonkeyallotdorm.isselectdormgrid",
    title: "<font color=#ffeb00>已选宿舍(选中后向左拖动或双击删除)</font>",
    noPagging: true,
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
        type: "public.selectUser.isselecteddormstore"
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"
        },
        listeners: {
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
                var IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("basepanel[xtype=pubonkeyallotdorm.mainlayout]");
                var selectGrid = basePanel.down("basegrid[xtype=pubonkeyallotdorm.selectdormgrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    },
    columns :{
        defaults: {
            titleAlign: "center"
        },
        items:[{
            text: "主键",
            dataIndex: "uuid",
            hidden: true
        }, {
            flex:1,
            minWidth:100,
            text: "宿舍名称",
            dataIndex: "roomName",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 100,
            text: "所属楼层",
            dataIndex: "areaName",
            field: {
                xtype: "textfield"
            }
        }, {
            width: 80,
            text: "所属楼栋",
            dataIndex: "upAreaName",
            field: {
                xtype: "textfield"
            }
        },{
            width: 60,
            text: "床位数",
            dataIndex: "dormBedCount",
            field: {
                xtype: "textfield"
            }
        },{
            width: 80,
            text: "宿舍类型",
            dataIndex: "dormType",
            renderer: function(value) {
                switch (value) {
                    case '1':
                    return '<font color=red>男宿舍</font>';
                    break;
                    case '2':
                    return '<font color=green>女宿舍</font>';
                    break;
                    case '3':
                    return '<font color=blue>不限</font>';
                    break;
                }
            }
        }]
    },

});