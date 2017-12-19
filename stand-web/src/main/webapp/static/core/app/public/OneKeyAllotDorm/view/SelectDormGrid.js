Ext.define("core.public.OneKeyAllotDorm.view.SelectDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.pubonkeyallotdorm.selectdormgrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoomdefine/onKeylist",
    model: "com.zd.school.build.define.model.BuildDormDefine",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomStatus'},{'type':'string','comparison':'=','value':'0','field':'isMixed'}]"
    },
    selModel: {
        type: "checkboxmodel",   
        headerWidth:30,    //设置这个值为50。 但columns中的defaults中设置宽度，会影响他
        //mode:'single',  //multi,simple,single；默认为多选multi
        checkOnly:true,    //如果值为true，则只用点击checkbox列才能选中此条记录
        //allowDeselect:true, //如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
    },
    al:false,
    pageDisplayInfo:false,
    panelTopBar:{},
    title: "<font color=#ffeb00>待选宿舍(选中后向左拖动或双击添加)</font>",
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: "DrapDropGroup"            //与下面的2行代码一样的效果
        },
        listeners: {
            drop: function (node, data, dropRec, dropPosition) {
            },
            beforeitemdblclick: function (grid, record, item, index, e, eOpts) {
                var data = record.data;
                var selectStore = grid.getStore();

                var basePanel = grid.up("basepanel[xtype=pubonkeyallotdorm.mainlayout]");
                var isSelectGrid;
                if(basePanel){
                    isSelectGrid = basePanel.down("panel[xtype=pubonkeyallotdorm.isselectdormgrid]");
                    if(isSelectGrid.isVisible()==true){
                       var isSelectStore = isSelectGrid.getStore();
                       for (var i = 0; i < isSelectStore.getCount(); i++) {
                        if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                            Ext.Msg.alert("提示", data.roomName+"已存在!");
                            return;
                        }
                     };
                    selectStore.removeAt(index);
                    isSelectStore.insert(0, [record]);

                    }
                   
                }
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
    },  {
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
  emptyText: '<span style="width:100%;text-align:center;display: block;">暂无数据</span>'
});