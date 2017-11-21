Ext.define("core.public.OneKeyAllotDorm.view.SelectDormGrid", {
    extend: "core.base.view.BaseGrid",
    alias: "widget.pubonkeyallotdorm.selectdormgrid",
    dataUrl: comm.get('baseUrl') + "/BaseRoomdefine/onKeylist",
    model: "com.zd.school.build.define.model.BuildDormDefine",
    extParams: {
        filter: "[{'type':'string','comparison':'=','value':'ROOT','field':'areaId'},{'type':'string','comparison':'=','value':'0','field':'roomStatus'},{'type':'string','comparison':'=','value':'0','field':'isMixed'}]"
    },
    al:false,
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
                    var isSelectStore = isSelectGrid.getStore();
                    console.log(isSelectStore);
                    for (var i = 0; i < isSelectStore.getCount(); i++) {
                        if (data.uuid == isSelectStore.getAt(i).get('uuid')) {
                            Ext.Msg.alert("提示", data.roomName+"已存在!");
                            return;
                        }
                    };
                    selectStore.removeAt(index);
                    isSelectStore.insert(0, [record]);
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
    }, { 
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