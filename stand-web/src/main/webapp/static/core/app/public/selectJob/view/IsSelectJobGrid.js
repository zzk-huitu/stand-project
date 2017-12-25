Ext.define("core.public.selectJob.view.IsSelectJobGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.pubselect.isselectjobgrid",
    ref: 'isselectjobgrid',
    title: "<font color='#ffeb00'>已选岗位(选中后向左拖动或双击移除）</font>",
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
    store: {
        type: "public.selectJob.isselectedjobstore"
    },
    
    viewConfig: {
        stripeRows: true
    },
    columns: [{
        xtype: "rownumberer",
        flex:0,
        width: 50,
        text: '序号',
        align: 'center'
    },{
        text: "名称",
        dataIndex: "jobName",
        flex: 2
    }, {
        text: "编码",
        dataIndex: "jobCode",
        flex: 1
    }, {
        text: "级别",
        dataIndex: "orderIndex",
        flex: 1
    }],
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
                else /*if(newRec.length==arrays.length)*/
                    data.records=arrays;    //方式二：移除左边的数据
                //return false;
            },
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var IsSelectStore = grid.getStore();
                IsSelectStore.removeAt(index);

                var basePanel = grid.up("panel[xtype=pubselect.selectjoblayout]");
                var selectGrid = basePanel.down("panel[xtype=pubselect.selectjobgrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
});