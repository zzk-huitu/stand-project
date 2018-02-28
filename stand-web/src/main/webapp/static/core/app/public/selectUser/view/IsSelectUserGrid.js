Ext.define("core.public.selectUser.view.IsSelectUserGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.pubselect.isselectusergrid",
    ref: 'isselectusergrid',
    title: "<font color='#ffeb00'>已选用户(向左拖动或双击移除)</font>",
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
        type: "public.selectUser.isselecteduserstore"
    },
    columns: [{
        xtype: "rownumberer",
        flex: 0,
        width: 50,
        text: '序号',
        align: 'center'
    }, {
        flex:1,
        minWidth: 100,
        text: "姓名",
        titleAlign: "center",
        align:'center',
        dataIndex: "xm"
    }/*, {
        width: 50,
        text: "性别",
        dataIndex: "xbm",
        renderer: function(value){        
            if(value==1)
                return "男";
            else if(value==2)
                return "女";
            else
                return "";
        }
    }, {
        flex:1,
        text: "部门",
        dataIndex: "deptName"
    }, {
        width: 120,
        text: "岗位",
        dataIndex: "jobName"
    }*/],
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

                var basePanel = grid.up("panel[xtype=pubselect.selectuserlayout]");
                var selectGrid = basePanel.down("basegrid[xtype=pubselect.selectusergrid]");
                var selectStore = selectGrid.getStore();
                selectStore.insert(0, [record]);
                return false;
            }
        }
    }
});